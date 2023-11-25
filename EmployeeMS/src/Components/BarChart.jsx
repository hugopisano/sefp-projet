// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import moment from 'moment';
// import 'moment/locale/fr';
// import 'moment/dist/locale/fr';

// const BarChart = ({ data, period, onPeriodChange }) => {
//     const chartRef = useRef();
//     const [totalPallets, setTotalPallets] = useState(0);

//     const calculateYAxisMax = () => {
//         switch (period) {
//             case 'week':
//                 return d3.max(data, d => d.total_pallets) + 5; // Ajustez selon les besoins
//             case 'month':
//                 return d3.max(data, d => d.total_pallets) + 20; // Ajustez selon les besoins
//             case 'year':
//                 return d3.max(data, d => d.total_pallets) + 50; // Ajustez selon les besoins
//             default:
//                 return d3.max(data, d => d.total_pallets);
//         }
//     };

//     useEffect(() => {
//         if (data && data.length > 0) {
//             drawChart();
//             const total = data.reduce((acc, item) => acc + item.total_pallets, 0);
//             setTotalPallets(total);
//         }
//     }, [data]);

//     const drawChart = () => {
//         // Effacer le contenu précédent
//         d3.select(chartRef.current).selectAll("*").remove();

//         // Taille du diagramme
//         const size = 330;
//         const margin = 30;
//         const width = size - 2 * margin;
//         const height = size - 2 * margin;

//         // Créer l'élément SVG
//         const svg = d3.select(chartRef.current)
//             .attr("width", size)
//             .attr("height", size)
//             .append("g")
//             .attr("transform", `translate(${margin},${margin})`);

//         moment.locale('fr');

//         let format, ticks;
//         if (period === 'week') {
//             format = d3.timeFormat("%a"); // Format pour les jours de la semaine
//             ticks = data.length; // Un marqueur par jour
//         } else if (period === 'month') {
//             format = d3.timeFormat("%d"); // Format pour les jours du mois
//             ticks = d3.timeDay.every(5); // Marqueur tous les 5 jours
//         } else if (period === 'year') {
//             format = d3.timeFormat("%b"); // Format pour les mois
//             ticks = d3.timeMonth; // Un marqueur par mois
//         }

//         // Créer les échelles
//         // Modification ici pour combiner le jour de la semaine avec le jour du mois
//         // const x = d3.scaleBand()
//         //     .range([0, width])
//         //     .domain(data.map(d => `${moment(d.date).format('dddd')}`))
//         //     .padding(0.3);
//         const x = d3.scaleTime()
//             .range([0, width])
//             .domain(d3.extent(data, d => d.date));

//         const xAxis = d3.axisBottom(x)
//             .tickFormat(format)
//             .ticks(ticks);

//         const yAxisMax = calculateYAxisMax(); // Calculez le maximum dynamique
//         // y.domain([0, yAxisMax]);

//         const y = d3.scaleLinear()
//             .range([height, 20])
//             .domain([0, yAxisMax]);
//         // Créer l'axe Y avec un intervalle de 30
//         const yAxis = d3.axisLeft(y)
//             .tickValues(d3.range(0, d3.max(data, d => d.total_pallets) + 100, 20));

//         // Ajouter l'axe X
//         // svg.append("g")
//         //     .attr("transform", `translate(0,${height})`)
//         //     .call(d3.axisBottom(x));
//         svg.append("g")
//             .attr("transform", `translate(0,${height})`)
//             .call(xAxis);

//         // Ajouter l'axe Y
//         // svg.append("g").call(d3.axisLeft(y));
//         svg.append("g").call(yAxis);

//         // Création de l'infobulle
//         const tooltip = d3.select("body")
//             .append("div")
//             .style("position", "absolute")
//             .style("visibility", "hidden")
//             .style("background", "white")
//             .style("border", "1px solid #000")
//             .style("border-radius", "5px")
//             .style("padding", "5px");

//         const cornerRadius = 10;
//         const dayInMilliseconds = 24 * 60 * 60 * 1000; // Un jour en millisecondes
//         const barWidth = width / (d3.max(data, d => d.date) - d3.min(data, d => d.date)) * dayInMilliseconds;

//         // Dessiner les barres
//         svg.selectAll(".bar")
//             .data(data)
//             .enter()
//             .append("path")
//             .attr("class", "bar")
//             .attr("x", d => x(d.date)) // Position X basée sur la date
//             .attr("y", d => y(d.total_pallets)) // Position Y basée sur le total des palettes
//             .attr("width", barWidth) // Largeur calculée des barres
//             .attr("height", d => height - y(d.total_pallets))
//             .attr("d", d => {
//                 // Calculer les dimensions de la barre
//                 const x1 = x(`${moment(d.date).format('dddd')}`);
//                 const y1 = y(d.total_pallets);
//                 const x2 = x1 + x.bandwidth();
//                 const y2 = height;

//                 // Créer un chemin avec des coins supérieurs arrondis
//                 return `M${x1},${y2} 
//                             L${x1},${y1 + cornerRadius} 
//                             Q${x1},${y1} ${x1 + cornerRadius},${y1} 
//                             L${x2 - cornerRadius},${y1} 
//                             Q${x2},${y1} ${x2},${y1 + cornerRadius} 
//                             L${x2},${y2} 
//                             Z`;
//             })
//             .attr("fill", "#2563EB")
//             .on("mouseover", function (event, d) {
//                 tooltip.html(`Date: ${moment(d.date).format('DD/MM/YYYY')}<br>Palettes: ${d.total_pallets}`)
//                     .style("visibility", "visible");
//             })
//             .on("mousemove", function (event) {
//                 tooltip.style("top", (event.pageY - 100) + "px")
//                     .style("left", (event.pageX - 100) + "px");
//             })
//             .on("mouseout", function () {
//                 tooltip.style("visibility", "hidden");
//             });

//         // Assurer que l'infobulle est retirée quand le composant est démonté
//         return () => {
//             tooltip.remove();
//         };
//     };

//     return (
//         <div>
//             <div className="flex flex-row justify-between items-center">
//                 <h6>Total de palettes :</h6>
//                 <select value={period} onChange={(e) => onPeriodChange(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'>
//                     <option value="week">Semaine</option>
//                     <option value="month">Mois</option>
//                     <option value="year">Année</option>
//                 </select>
//             </div>
//             <h5 className='font-bold'>{totalPallets}</h5>
//             <svg ref={chartRef}></svg>
//         </div>
//     );
// };

// export default BarChart;

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import moment from 'moment';
// import 'moment/locale/fr';
// import 'moment/dist/locale/fr';

// const BarChart = ({ data, period, onPeriodChange }) => {
//     const chartRef = useRef();
//     const [totalPallets, setTotalPallets] = useState(0);

//     const calculateYAxisMax = () => {
//         switch (period) {
//             case 'week':
//                 return d3.max(data, d => d.total_pallets) + 5;
//             case 'month':
//                 return d3.max(data, d => d.total_pallets) + 20;
//             case 'year':
//                 return d3.max(data, d => d.total_pallets) + 50;
//             default:
//                 return d3.max(data, d => d.total_pallets);
//         }
//     };

//     useEffect(() => {
//         if (data && data.length > 0) {
//             drawChart();
//             const total = data.reduce((acc, item) => acc + item.total_pallets, 0);
//             setTotalPallets(total);
//         }
//     }, [data]);

//     const drawChart = () => {
//         d3.select(chartRef.current).selectAll("*").remove();

//         const size = 330;
//         const margin = 30;
//         const width = size - 2 * margin;
//         const height = size - 2 * margin;

//         const svg = d3.select(chartRef.current)
//             .attr("width", size)
//             .attr("height", size)
//             .append("g")
//             .attr("transform", `translate(${margin},${margin})`);

//         moment.locale('fr');

//         let format, ticks;
//         if (period === 'week') {
//             format = d3.timeFormat("%a");
//             ticks = data.length;
//         } else if (period === 'month') {
//             format = d3.timeFormat("%d");
//             ticks = d3.timeDay.every(5);
//         } else if (period === 'year') {
//             format = d3.timeFormat("%b");
//             ticks = d3.timeMonth;
//         }

//         moment.locale('fr');

//         const x = d3.scaleTime()
//             .range([0, width])
//             .domain(d3.extent(data, d => new Date(d.date)))

//         const xAxis = d3.axisBottom(x)
//             .tickFormat(d => moment(d).format('dd'))
//             .ticks(ticks);

//         const yAxisMax = calculateYAxisMax();
//         const y = d3.scaleLinear()
//             .range([height, 20])
//             .domain([0, yAxisMax]);
//         const yAxisInterval = period === 'year' ? 300 : 20;
//         const yAxis = d3.axisLeft(y)
//             .tickValues(d3.range(0, yAxisMax, yAxisInterval));

//         svg.append("g")
//             .attr("transform", `translate(0,${height})`)
//             .call(xAxis);

//         svg.append("g").call(yAxis);

//         const barWidth = width / data.length;

//         svg.selectAll(".bar")
//             .data(data)
//             .enter()
//             .append("rect")
//             .attr("class", "bar")
//             .attr("x", d => x(new Date(d.date)))
//             .attr("y", d => y(d.total_pallets))
//             .attr("width", barWidth)
//             .attr("height", d => height - y(d.total_pallets))
//             .attr("fill", "#2563EB");

// const tooltip = d3.select("body")
//     .append("div")
//     .style("position", "absolute")
//     .style("visibility", "hidden")
//     .style("background", "white")
//     .style("border", "1px solid #000")
//     .style("border-radius", "5px")
//     .style("padding", "5px");

// svg.selectAll(".bar")
//     .on("mouseover", function (event, d) {
//         tooltip.html(`Date: ${moment(d.date).format('DD/MM/YYYY')}<br>Palettes: ${d.total_pallets}`)
//             .style("visibility", "visible");
//     })
//     .on("mousemove", function (event) {
//         tooltip.style("top", (event.pageY - 100) + "px")
//             .style("left", (event.pageX - 100) + "px");
//     })
//     .on("mouseout", function () {
//         tooltip.style("visibility", "hidden");
//     });

//         return () => {
//             tooltip.remove();
//         };
//     };

//     return (
//         <div>
//             <div className="flex flex-row justify-between items-center">
//                 <h6>Total de palettes :</h6>
//                 <select value={period} onChange={(e) => onPeriodChange(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'>
//                     <option value="week">Semaine</option>
//                     <option value="month">Mois</option>
//                     <option value="year">Année</option>
//                 </select>
//             </div>
//             <h5 className='font-bold'>{totalPallets}</h5>
//             <svg ref={chartRef}></svg>
//         </div>
//     );
// };

// export default BarChart;

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
            // Configuration par défaut pour les autres périodes
            xAxis = d3.axisBottom(x)
                .tickFormat(d => moment(d).format('dd')) // Format par défaut
                .tickSizeOuter(0);
        }

        // const xAxis = d3.axisBottom(x)
        //     .tickFormat(d => moment(d).format('dd'))
        //     .tickSizeOuter(0);

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

        // ... Reste du code pour les tooltips
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

