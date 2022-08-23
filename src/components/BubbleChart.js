/* eslint-disable no-sparse-arrays */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const width = 1000;
const height = 800;
let [mt, mr, mb, ml] = [50, 50, 50, 50];
const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const data = Array.from(Array(100)).map(() => ({
    x: Math.floor(Math.random() * (12000 - 100)) + 100,
    y: Math.floor(Math.random() * (500 - 100)) + 100,
    z: Math.floor(Math.random() * (50 - 10)) + 10
}));

/*
    References :
    https://d3-graph-gallery.com/graph/bubble_tooltip.html
*/

export default function BubbleChart() {
    const bubbleChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        // React.18 Strict Mode
        // Prevent Render twice
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // SVG 추가하기
        const svg = d3
            .select(bubbleChart.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .style('-webkit-tap-highlight-color', 'transparent');

        // GRAPH 추가하기
        const graph = svg
            .append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
            .attr('transform', `translate(${ml}, ${mt})`);

        // X축 설정하기
        const xAxisG = graph.append('g');
        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.x))
            .nice()
            .range([0, graphWidth]);
        const xAxis = d3.axisBottom(xScale).tickSize(graphHeight).tickPadding(10);

        // Y축 설정하기
        const yAxisG = graph.append('g');
        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.y))
            .nice()
            .range([graphHeight, 0]);
        const yAxis = d3.axisLeft(yScale);

        // Circle Radius 설정하기
        const zScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.z))
            .range([1, 50]);

        // 축 UI
        xAxisG
            .call(xAxis)
            .call((g) => g.select('.domain').remove())
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1));
        yAxisG
            .call(yAxis)
            .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1));

        // Bubble Colors
        const myColor = d3.scaleOrdinal().domain([0, 1, 2, 3, 4, 5, 6, 7]).range(d3.schemeSet2);

        // TOOLTIP UI 설정하기
        const tooltip = d3
            .select(bubbleChart.current)
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('minWidth', '100px')
            .style('background', '#252B2F')
            .style('border-radius', '4px')
            .style('color', '#fff');

        const onEnter = function (event, d) {
            tooltip
                .style('visibility', 'visible')
                .html('X Coordinate : ' + d?.x)
                .style('left', event.x / 2 + 'px')
                .style('top', event.y / 2 + 30 + 'px');
            tooltip.transition().duration(10);
        };

        const onMove = function (event, _d) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        };

        const onLeave = function (_event, _d) {
            tooltip.transition().duration(10).style('visibility', 'hidden');
        };

        graph
            .append('g')
            .selectAll('dot')
            .data(data)
            .join('circle')
            .attr('class', 'bubbles')
            .attr('cx', (d) => xScale(d.x))
            .attr('cy', (d) => yScale(d.y))
            .attr('r', (d) => zScale(d.z))
            .style('fill', (_d, i) => myColor(i))
            .style('opacity', '0.5')
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .on('mouseover', onEnter)
            .on('mousemove', onMove)
            .on('mouseleave', onLeave);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                alitngnItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 4
            }}
            ref={bubbleChart}
            id="bubble-chart-canvas"
        />
    );
}
