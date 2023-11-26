import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/dist/locale/fr';

const BarChart = ({ data, period, onPeriodChange }) => {
    const chartRef = useRef();
    const [totalPallets, setTotalPallets] = useState(0);

    useEffect(() => {
        if (data && data.length > 0) {
            drawChart();
            const total = data.reduce((acc, item) => acc + item.total_pallets, 0);
            setTotalPallets(total);
        }
    }, [data]);

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
            .attr("transform", `translate(${margin},${margin})`);

        moment.locale('fr');

        let x;
        if (period === 'year') {
            x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(d => d.year))
                .padding(0.1);
        } else {
            x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(d => new Date(d.date)))
                .padding(0.2);
        }

        let xAxis;
        if (period === 'month') {
            const tickValues = data.filter((_, i) => i % 5 === 2).map(d => new Date(d.date));

            xAxis = d3.axisBottom(x)
                .tickValues(tickValues) // Utiliser les valeurs filtrées pour les ticks
                .tickFormat(d => moment(d).format('DD MMM'));
        } else if (period === 'year') {
            xAxis = d3.axisBottom(x);
        } else {
            xAxis = d3.axisBottom(x)
                .tickFormat(d => moment(d).format('dd')) // Format par défaut
                .tickSizeOuter(0);
        }

        const yAxisMax = d3.max(data, d => d.total_pallets) + 5;
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, yAxisMax]);

        const yAxis = d3.axisLeft(y).ticks(5);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        svg.append("g").call(yAxis);

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(period === 'year' ? d.year : new Date(d.date)))
            .attr("y", d => y(d.total_pallets))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.total_pallets))
            .attr("fill", "#2563EB");

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
                let tooltipContent;
                if (period === 'year') {
                    // Affichage pour l'année
                    tooltipContent = `Année: ${d.year}<br>Palettes: ${d.total_pallets}`;
                } else {
                    // Affichage pour le mois ou d'autres périodes
                    tooltipContent = `Date: ${moment(new Date(d.date)).format('DD/MM/YYYY')}<br>Palettes: ${d.total_pallets}`;
                }
                tooltip.html(tooltipContent)
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

    return (
        <div>
            <div className="flex flex-row justify-between items-center">
                <h6>Total de palettes :</h6>
                <select value={period} onChange={(e) => onPeriodChange(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'>
                    <option value="week">Semaine</option>
                    <option value="month">Mois</option>
                    <option value="year">Année</option>
                </select>
            </div>
            <h5 className='font-bold'>{totalPallets}</h5>
            <svg ref={chartRef}></svg>
        </div>
    );
};

export default BarChart;

