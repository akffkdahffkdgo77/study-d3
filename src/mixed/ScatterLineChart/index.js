import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const width = 1000;
const height = 800;
let [mt, mr, mb, ml] = [50, 50, 50, 50];
const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const data = Array.from(Array(47)).map((_, i) => ({
    label: i,
    value: Math.floor(Math.random() * (100 - 0)) + 0
}));

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/connectedscatter_multi.html
 */

export default function ScatterLineChart() {
    const mixedChart = useRef(null);
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
            .select(mixedChart.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        // GRAPH 추가하기
        const graph = svg
            .append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
            .attr('transform', `translate(${ml}, ${mt})`);

        // 그룹을 추가한 다음 x축 데이터를 그룹에 추가하기
        const xAxisG = graph.append('g');

        // x축 데이터 scale
        const xScale = d3
            .scaleLinear()
            // [min, max] 반환
            .domain([0, 47])
            // .nice()
            .range([0, graphWidth]);

        // x축 생성하기
        const xAxis = d3
            // x축은 그래프 하단에
            .axisBottom(xScale)
            // grid line을 그리고 싶으면 추가
            .tickSize(graphHeight)
            // x축과 x축 label 간격 설정
            // .tickPadding(10)
            // grid line 수
            .ticks(48)
            .tickFormat((d) => (d === 0 ? 'YEAR 0' : (d + 1) % 12 === 0 ? `YEAR ${(d + 1) / 12}` : ''));

        // 그룹을 추가한 다음 y축 데이터를 그룹에 추가하기
        const yAxisG = graph.append('g');

        // y축 데이터 scale
        const yScale = d3
            // y는 보통 linear를 사용
            .scaleLinear()
            // [min, max]
            // 각 카테고리별로 max를 구한 후 그 중에서도 max를 구하기
            .domain([0, 100])
            // 값이 2,5,10의 배수로 나오도록
            .nice()
            .range([graphHeight, 0]);

        // y축은 왼쪽에
        const yAxis = d3
            .axisLeft(yScale)
            .ticks(4)
            .tickFormat((d) => (d > 0 ? `${d}%` : ''));

        /** 그래프 그리기!!! */
        // x축 설정
        // 축 및 grid line 색상 변경
        xAxisG
            .call(xAxis)
            .call((g) => g.select('.domain').remove())
            .call((g) =>
                g.selectAll('.tick line').attr('stroke-opacity', (_d, i) => (i === 0 || (i + 1) % 12 === 0 ? 0.1 : 0))
            )
            .call((g) => g.selectAll('.tick line').attr('stroke-dasharray', (_d, i) => (i === 0 || i === 47 ? 0 : 5)));

        // y축 설정
        // 축 및 grid line 색상 변경
        yAxisG
            .call(yAxis)
            .call((g) => g.select('.domain').remove())
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1))
            .call((g) => g.selectAll('.tick line').attr('stroke-dasharray', (d, i) => (d === 0 || d === 100 ? 0 : 5)))
            .call((g) => g.selectAll('.tick').selectChild('line').remove());

        // Tooltip 설정하기
        const tooltip = d3
            .select(mixedChart.current)
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('min-width', '120px')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .style('overflow', 'hidden');

        // See : https://d3-graph-gallery.com/graph/connectedscatter_tooltip.html
        function onMouseOver(_event, d) {
            let backgroundColor = '';
            if (d.label < 12 && d.value <= 80) {
                backgroundColor = '#EE3FA2';
            } else if (d.label < 24 && d.value <= 60) {
                backgroundColor = '#EE3FA2';
            } else if (d.label < 36 && d.value <= 40) {
                backgroundColor = '#EE3FA2';
            } else if (d.label < 48 && d.value <= 20) {
                backgroundColor = '#EE3FA2';
            } else {
                backgroundColor = '#1B43E0';
            }

            tooltip
                .html(
                    `<div class="d3-tooltip-name">
                    ${d.label}
                    </div>
                    <div class="d3-tooltip-label">
                        <div class="d3-tooltip-color" style="background-color: ${backgroundColor}">
                            <span></span>
                        </div>
                        <span class="d3-tooltip-value">${d.label}:</span>${d.value.toLocaleString()}
                    </div>`
                )
                .style('visibility', 'visible');
        }

        function onMouseMove(event, _d) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        }

        function onMouseLeave(_event, _d) {
            tooltip.style('visibility', 'hidden');
        }

        graph
            .append('g')
            .append('line')
            .attr('x1', 0)
            .attr('x2', xScale(data[11].label))
            .attr('y1', yScale(80))
            .attr('y2', yScale(80))
            .style('stroke', '#EE3FA2');
        graph
            .append('g')
            .append('line')
            .attr('x1', xScale(data[11].label))
            .attr('x2', xScale(data[11].label))
            .attr('y1', yScale(80))
            .attr('y2', yScale(60))
            .style('stroke', '#EE3FA2');
        graph
            .append('g')
            .append('line')
            .attr('x1', xScale(data[11].label))
            .attr('x2', xScale(data[23].label))
            .attr('y1', yScale(60))
            .attr('y2', yScale(60))
            .style('stroke', '#EE3FA2');
        graph
            .append('g')
            .append('line')
            .attr('x1', xScale(data[23].label))
            .attr('x2', xScale(data[23].label))
            .attr('y1', yScale(60))
            .attr('y2', yScale(40))
            .style('stroke', '#EE3FA2');
        graph
            .append('g')
            .append('line')
            .attr('x1', xScale(data[23].label))
            .attr('x2', xScale(data[35].label))
            .attr('y1', yScale(40))
            .attr('y2', yScale(40))
            .style('stroke', '#EE3FA2');
        graph
            .append('g')
            .append('line')
            .attr('x1', xScale(data[35].label))
            .attr('x2', xScale(data[35].label))
            .attr('y1', yScale(40))
            .attr('y2', yScale(20))
            .style('stroke', '#EE3FA2');
        graph
            .append('g')
            .append('line')
            .attr('x1', xScale(data[35].label))
            .attr('x2', graphWidth)
            .attr('y1', yScale(20))
            .attr('y2', yScale(20))
            .style('stroke', '#EE3FA2');

        graph
            .append('g')
            .selectAll()
            .data(data.filter((d) => d.value > 0))
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d.label))
            .attr('cy', (d) => yScale(d.value))
            .attr('r', 6)
            .attr('fill', (d, i) => {
                console.log(d.label, i);
                if (i < 12 && d.value <= 80) {
                    return '#EE3FA2';
                } else if (i < 24 && d.value <= 60) {
                    return '#EE3FA2';
                } else if (i < 36 && d.value <= 40) {
                    return '#EE3FA2';
                } else if (i < 48 && d.value <= 20) {
                    return '#EE3FA2';
                } else {
                    return '#1B43E0';
                }
            })
            .attr('stroke', 'white')
            .on('mouseover', onMouseOver)
            .on('mousemove', onMouseMove)
            .on('mouseleave', onMouseLeave);
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
            ref={mixedChart}
            id="multi-line-chart-canvas"
        />
    );
}
