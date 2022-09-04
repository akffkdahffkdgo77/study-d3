import { useEffect, useRef } from 'react';

import * as d3 from 'd3';

const width = '100%';
const height = 500;
const [mt, mr, mb, ml] = [20, 50, 50, 50];
const graphHeight = height - mt - mb;

const data = Array.from(Array(10)).map((_d, index) => ({
    label: index,
    value: Math.floor(Math.random() * (1000 - 600) + 600)
}));

const dates = Array.from(Array(10)).map((_d, index) =>
    index + 1 > 9 ? `2013-04-${index + 1}` : `2013-04-0${index + 1}`
);

// See : https://d3-graph-gallery.com/graph/area_lineDot.html
export default function AreaChart() {
    const areaChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }
        rendered.current = false;

        const graphWidth = (areaChart.current?.clientWidth || 500) - mr - ml;

        // SVG 추가하기
        const svg = d3.select(areaChart.current).append('svg').attr('width', width).attr('height', height);

        // GRAPH 추가하기
        const graph = svg
            .append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
            .attr('transform', `translate(${ml}, ${mt})`);

        // Tooltip 설정하기
        const tooltip = d3
            .select(areaChart.current)
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('min-width', '120px')
            .style('border-radius', '4px')
            .style('color', '#ffffff')
            .style('visibility', 'hidden')
            .style('overflow', 'hidden');

        // DOMAIN 데이터
        const xDomain = [data[0].label, data[data.length - 1].label];
        const yMax = d3.extent(data, (d) => d.value);
        const yDomain = [yMax[0], yMax[1] + 50];

        // X축 데이터
        const xScale = d3.scaleLinear().domain(xDomain).range([0, graphWidth]);

        // X축 위치 및 label 설정
        const xAxis = d3
            // X축이 그래프의 하단에 그려지도록
            .axisBottom(xScale)
            .ticks(data.length)
            // grid line 그리기
            .tickSize(graphHeight)
            // x축 label과 x축 사이의 간격 설정
            .tickPadding(10)
            .tickFormat((d) => dates[d]);

        // X축 Styling
        graph
            .append('g')
            .call(xAxis)
            .call((g) => g.select('.domain').attr('stroke', 'transparent'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1));

        // Y축 데이터 설정하기
        const yScale = d3
            .scaleLinear()
            .domain(yDomain)
            // 2, 5, 10의 배수로
            .nice()
            .range([graphHeight, 0]);

        // Y축 위치 및 label 설정하기
        const yAxis = d3
            // Y축이 그래프의 왼쪽에서 그려지도록
            .axisLeft(yScale);

        // Y축 Styling
        graph
            .append('g')
            .call(yAxis)
            .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1));

        const area = d3
            .area()
            .curve(d3.curveCardinal)
            .x((_d, i) => xScale(data[i].label))
            .y0(graphHeight)
            .y1((_d, i) => yScale(data[i].value));

        graph
            .append('path')
            .datum(data)
            .attr('fill', '#818CF8')
            .attr('fill-opacity', 0.3)
            .attr('stroke', 'none')
            .attr('d', area);

        const line = d3
            .line()
            .curve(d3.curveCardinal)
            .x((_d, i) => xScale(data[i].label))
            .y((_d, i) => yScale(data[i].value));

        graph
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#818CF8')
            .attr('stroke-width', 4)
            .attr('d', line);

        graph
            .selectAll()
            .data(data)
            .join('circle')
            .attr('fill', 'transparent')
            .attr('stroke', 'none')
            .attr('cx', (d) => xScale(d.label))
            .attr('cy', (d) => yScale(d.value))
            .attr('r', 20)
            .on('mouseover', function onMouseOver(_event, d) {
                tooltip
                    .html(
                        `<div class="d3-tooltip-name">
                            ${dates[d.label]}
                        </div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: #818CF8">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">방문자:</span>${d.value.toLocaleString()}
                        </div>`
                    )
                    .style('visibility', 'visible');
            })
            .on('mousemove', function onMouseMove(event, _d) {
                tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
            })
            .on('mouseleave', function onMouseLeave(_event, _d) {
                tooltip.style('visibility', 'hidden');
            });
    }, []);

    return <div id="area-chart" style={{ backgroundColor: '#fff', borderRadius: 4 }} ref={areaChart} />;
}
