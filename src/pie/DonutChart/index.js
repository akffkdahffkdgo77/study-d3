import { useEffect, useRef } from 'react';

import * as d3 from 'd3';

const width = '100%';
const height = 500;
const [mt, mr, mb, ml] = [50, 50, 50, 50];
const graphHeight = height - mt - mb;

const radius = height / 2 - 50;

const data = { 블라블라: 500, 반려동물: 645, 직장생활: 1231, 스포츠: 938 };

// See : https://d3-graph-gallery.com/graph/donut_basic.html
export default function DonutChart() {
    const donutChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }
        rendered.current = false;

        const graphWidth = (donutChart.current?.clientWidth || 1000) - mr - ml;

        // SVG 추가하기
        const svg = d3.select(donutChart.current).append('svg').attr('width', width).attr('height', height);

        // GRAPH 추가하기
        const graph = svg
            .append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
            .attr('transform', `translate(${height / 2}, ${height / 2})`);

        // Tooltip 설정하기
        const tooltip = d3
            .select(donutChart.current)
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('min-width', '120px')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .style('overflow', 'hidden');

        const colors = d3.scaleOrdinal().range(['#9ADCFF', '#FFF89A', '#FFB2A6', '#FF8AAE']);

        const pie = d3.pie().value((d) => d[1]);
        const computedData = pie(Object.entries(data));

        const arc = d3
            .arc()
            .innerRadius(radius / 2)
            .outerRadius(radius);

        graph
            .selectAll()
            .data(computedData)
            .join('path')
            .attr('d', arc)
            .attr('fill', (d) => colors(d.data[0]))
            .attr('stroke', '#ffffff')
            .style('stroke-width', '3px')
            .style('opacity', 0.9)
            .on('mouseover', function onMouseOver(_event, d) {
                tooltip
                    .html(
                        `<div class="d3-tooltip-name">
                            ${d.data[0]}
                        </div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: ${colors(d.data[0])}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">게시글 수:</span>${d.data[1].toLocaleString()}
                        </div>`
                    )
                    .style('visibility', 'visible');
                d3.select(this).transition().attr('opacity', 1).attr('transform', 'scale(1.1)');
            })
            .on('mousemove', function onMouseMove(event, _d) {
                tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
            })
            .on('mouseleave', function onMouseLeave(_event, _d) {
                tooltip.style('visibility', 'hidden');
                d3.select(this).transition().attr('opacity', 0.9).attr('transform', 'scale(1)');
            });
    }, []);

    return <div id="donut-chart" style={{ backgroundColor: '#fff', borderRadius: 4 }} ref={donutChart} />;
}
