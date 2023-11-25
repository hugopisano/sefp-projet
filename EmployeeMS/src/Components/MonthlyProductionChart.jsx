import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/dist/locale/fr';

const MonthlyProductionChart = ({ employeeData, productionData, onMonthChange, onYearChange }) => {
    const chartRef = useRef();
    const [selectedMonth, setSelectedMonth] = useState(parseInt(new Date().getMonth()));
    const [selectedYear, setSelectedYear] = useState();

    useEffect(() => {
        if (productionData && productionData.length > 0) {
            drawChart();
        }
    }, [productionData]);

    const drawChart = () => {
        d3.select(chartRef.current).selectAll("*").remove();

        const size = 300;
        const margin = 30;
        const width = size - 1.75 * margin;
        const height = size - 1.75 * margin;

        const svg = d3.select(chartRef.current)
            .attr("width", size)
            .attr("height", size)
            .append("g")
            .attr("transform", `translate(${margin}, ${margin})`);

        moment.locale('fr');

        // Créer les échelles
        const x = d3.scaleBand()
            .range([0, width])
            .domain(productionData.map(d => new Date(d.date)))
            .padding(0.2);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(productionData, d => d.total_pallets) + 5]);

        // Créer les axes
        const tickValues = productionData.filter((_, i) => i % 5 === 2).map(d => new Date(d.date));

        const xAxis = d3.axisBottom(x)
            .tickValues(tickValues) // Utiliser les valeurs filtrées pour les ticks
            .tickFormat(d => moment(d).format('DD MMM'));

        const yAxis = d3.axisLeft(y).ticks(5);

        // Ajouter les axes au graphique
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g").call(yAxis);

        // Ajouter les barres
        svg.selectAll(".bar")
            .data(productionData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(new Date(d.date)))
            .attr("y", d => y(d.total_pallets))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.total_pallets))
            .attr("fill", "#2563EB");

        // Ajouter les infobulles
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "white")
            .style("border", "1px solid #000")
            .style("border-radius", "5px")
            .style("padding", "5px");

        svg.selectAll(".bar")
            .on("mouseover", function (event, d) {
                tooltip.html(`Date: ${moment(new Date(d.date)).format('DD/MM/YYYY')}<br>Palettes: ${d.total_pallets}`)
                    .style("visibility", "visible");
            })
            .on("mousemove", function (event) {
                tooltip.style("top", (event.pageY - 100) + "px")
                    .style("left", (event.pageX - 100) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
            });

        return () => {
            tooltip.remove();
        };
    };

    // Générer les options pour les sélecteurs de mois et d'année
    const months = moment.months();
    const years = Array.from({ length: 5 }, (_, i) => moment().year() - i);


    return (
        <div>
            <div className="header">
                <h6>Employé du mois : <span className='font-bold'>{employeeData.nom} {employeeData.prenom}</span></h6>
                <div className='flex flex-row gap-3'>
                    <select value={selectedMonth} onChange={(e) => {
                        setSelectedMonth(parseInt(e.target.value, 10));
                        onMonthChange(parseInt(e.target.value, 10));
                    }}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'>
                        {months.map((month, index) => (
                            <option key={month} value={index}>{month}</option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={(e) => {
                        setSelectedYear(e.target.value);
                        onYearChange(e.target.value);
                    }}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            <svg ref={chartRef}></svg>
        </div>
    );
}

export default MonthlyProductionChart