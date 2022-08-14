import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const width = 800;
const height = 800;
let [mt, mr, mb, ml] = [50, 0, 50, 100];
const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const data = [
    { date: '07-24', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '07-25', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '07-26', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '07-29', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '07-30', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-01', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-02', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-03', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-06', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-07', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-08', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-09', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-10', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-13', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-14', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-15', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-16', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-17', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-20', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '08-21', value: Math.floor(Math.random() * (1000000 - 100)) + 100 }
];

/*
    References :
    https://observablehq.com/@kellytall/day-one-a-line-chart
*/

export default function LineChart() {
    const lineChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // TODO : Tooltip
        // https://observablehq.com/@d3/line-with-tooltip

        const svg = d3
            .select(lineChart.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        // See : https://observablehq.com/@harrylove/draw-a-circle-dot-marker-on-a-line-path-with-d3
        svg.append('defs')
            .append('marker')
            .attr('id', 'dot')
            .attr('viewBox', [0, 0, 20, 20])
            .attr('refX', 10)
            .attr('refY', 10)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .append('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 10)
            .style('fill', 'rgba(54, 162, 235, 1)')
            .style('stroke', 'rgba(54, 162, 235, 1)');

        const graph = svg
            .append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
            .attr('transform', `translate(${ml}, ${mt})`);

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.date))
            .range([0, graphWidth])
            .padding(1);
        const xAxis = d3
            .axisBottom(xScale)
            .tickSize(height - mt - mb)
            .tickPadding(10);

        const xAxisG = graph.append('g');

        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.value))
            .nice()
            .range([graphHeight, 0]);
        const yAxis = d3.axisLeft(yScale);
        const yAxisG = graph.append('g');

        xAxisG
            .call(xAxis)
            .call((g) => g.select('.domain').remove())
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1));

        yAxisG
            .call(yAxis)
            .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .clone()
                    .attr('x2', width - ml - mr)
                    .attr('stroke-opacity', 0.1)
            );

        const line = d3
            .line()
            .defined((d) => !isNaN(d.value))
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.value));

        graph
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', 'rgba(54, 162, 235, 0.2)')
            .attr('stroke-width', 3)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .attr('marker-start', 'url(#dot)')
            .attr('marker-mid', 'url(#dot)')
            .attr('marker-end', 'url(#dot)')
            .attr('d', line(data))
            .call(transition);

        // See : https://observablehq.com/@jurestabuc/animated-line-chart
        function transition(path) {
            path.transition()
                .duration(3000)
                .attrTween('stroke-dasharray', tweenDash)
                .on('end', () => d3.select(this).call(transition));
        }

        function tweenDash() {
            const length = this.getTotalLength();
            const interploate = d3.interpolateString('0,' + length, length + ',' + length);
            return function (t) {
                return interploate(t);
            };
        }
    }, []);

    return <div style={{ margin: 100, backgroundColor: '#fff' }} ref={lineChart} id="line-chart-canvas" />;
}
