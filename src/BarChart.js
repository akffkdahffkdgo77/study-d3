import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createAxis, createCanvas } from './utils';

const width = 800;
const height = 800;
let [mt, mr, mb, ml] = [50, 0, 50, 100];
const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const data = [
    '전국',
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주'
].map((krName) => ({ krName, totalCount: Math.floor(Math.random() * (1000000 - 100)) + 100 }));

// DATA Pre-Processing
const xLabels = data.map((item) => item.krName);

export default function BarChart() {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // Canvas + Graph 설정
        const { graph, tooltip } = createCanvas({
            canvas: barChart.current,
            width,
            height,
            margin: [mt, mr, mb, ml],
            tooltipOptions: {
                position: 'absolute',
                'z-index': '10',
                'min-width': '100px',
                padding: '10px',
                'border-radius': '4px',
                color: '#fff',
                background: '#252B2F',
                visibility: 'hidde '
            }
        });

        // TOOLTIP Styling
        // const tooltip = d3
        //     .select('body')
        //     .append('div')
        //     .attr('class', 'd3-tooltip')
        //     .style('position', 'absolute')
        //     .style('z-index', '10')
        //     .style('minWidth', '100px')
        //     .style('padding', '10px')
        //     .style('border-radius', '4px')
        //     .style('color', '#fff')
        //     .style('background', '#252B2F')
        //     .style('visibility', 'hidden');

        // X축, Y축 설정하기
        const { scale: xScale } = createAxis({
            graph,
            type: 'x',
            domain: xLabels,
            range: [0, graphWidth],
            options: {
                padding: 0.25,
                tickSize: graphHeight,
                tickPadding: 10
            }
        });

        const { scale: yScale } = createAxis({
            graph,
            type: 'y',
            domain: [0, d3.extent(data, (d) => d.totalCount)[1]],
            range: [graphHeight, 0],
            options: {
                graphWidth
            }
        });

        // const xAxisG = graph.append('g');
        // domain -> 실제 데이터 []
        // range -> 그래프에 표시될 데이터의 최소, 최대값
        // padding -> 간격
        // const xScale = d3.scaleBand().domain().range([0, graphWidth]).padding(0.25);
        // const xAxis = d3.axisBottom(xScale).tickSize(graphHeight).tickPadding(10);

        // X축 Styling
        // xAxisG
        //     .call(xAxis)
        //     .call((g) => g.select('.domain').attr('stroke', 'transparent'))
        //     .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
        //     .call((g) =>
        //         g
        //             .selectAll('.tick line')
        //             .attr('transform', `translate(${xScale.bandwidth() - (xScale.step() - xScale.bandwidth())}, 0)`)
        //     );

        // const yAxisG = graph.append('g');

        // https://observablehq.com/@d3/d3-scalelinear#cell-174
        // Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
        // scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌
        // const yScale = d3
        //     .scaleLinear()
        //     .domain([0, d3.extent(data, (d) => d.totalCount)[1]])
        //     .nice()
        //     .range([graphHeight, 0]);
        // const yAxis = d3.axisLeft(yScale);
        // yAxisG
        //     .call(yAxis)
        //     .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
        //     .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
        //     .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1));

        const bars = graph.selectAll('rect').data(data);

        bars.enter()
            .append('rect')
            .attr('width', xScale.bandwidth())
            // 0 -> 값만큼 height가 생기는 animation을 위해서 초기값을 0으로 설정
            .attr('height', graphHeight - yScale(0))
            .attr('x', (d) => xScale(d.krName))
            .attr('y', yScale(0))
            .attr('fill', 'rgba(54, 162, 235, 0.2)')
            // mouse over -> tooltip이 보이도록
            .on('mouseover', function (e, data) {
                tooltip
                    .html(
                        `<div class="d3-tooltip-name">${
                            data.krName
                        }</div><br/><div class="d3-tooltip-label"><div class="d3-tooltip-color"><span></span></div><span class="d3-tooltip-name">totalCount:</span>${data.totalCount.toLocaleString()}</div>`
                    )
                    .style('visibility', 'visible');
                d3.select(this).transition().attr('fill', 'rgba(54, 162, 235, 0.5)');
            })
            // mouse move
            .on('mousemove', function (event) {
                tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
            })
            // mouse out -> tooltip이 보이지 않도록
            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');
                d3.select(this).transition().attr('fill', 'rgba(54, 162, 235, 0.2)');
            });

        // Transition Effect
        d3.selectAll('rect')
            .transition()
            .ease(d3.easeLinear)
            .duration(500)
            .attr('y', (d) => yScale(d.totalCount))
            .attr('height', (d) => graphHeight - yScale(d.totalCount))
            .delay((_, i) => i * 100);
    }, []);

    return <div style={{ margin: 100, backgroundColor: '#fff' }} ref={barChart} id="canvas" />;
}
