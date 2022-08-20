import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createAxis, createCanvas } from './utils';

const width = 800;
const height = 800;
let [mt, mr, mb, ml] = [50, 0, 50, 100];
const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const colors = ['#FFDEE3', '#D8ECFF', '#FFF6E1', '#E0F3F2', '#E8DDFF', '#FFEDDD'];

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
].map((krName) => ({
    krName,
    x: Math.floor(Math.random() * (1000000 - 100)) + 100,
    y: Math.floor(Math.random() * (1000000 - 100)) + 100,
    z: Math.floor(Math.random() * (1000000 - 100)) + 100
}));

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */
export default function StackedBarChart() {
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
                visibility: 'hidden'
            }
        });

        // DATA Pre-processing
        const xLabels = data.map((item) => item.krName);
        const subGroup = ['x', 'y', 'z'];
        const yLabels = d3.extent(data, (d) => d.x + d.y + d.z);

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
            domain: [0, yLabels[1]],
            range: [graphHeight, 0],
            options: {
                graphWidth
            }
        });

        // const xAxisG = graph.append('g');
        //      scale band -> not continuous data set
        //      domain -> 실제 데이터 []
        //      range -> 그래프에 표시될 데이터의 최소, 최대값
        //      padding -> 간격
        // const xScale = d3.scaleBand().domain(xLabels).range([0, graphWidth]).padding(0.25);
        // const xAxis = d3.axisBottom(xScale).tickSize(graphHeight).tickPadding(10);
        //      X축 Styling
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
        //      https://observablehq.com/@d3/d3-scalelinear#cell-174
        //      Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
        // scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌
        // const yScale = d3.scaleLinear().domain([0, yLabels[1]]).nice().range([graphHeight, 0]);
        // const yAxis = d3.axisLeft(yScale);
        //      Y축 Styling
        // yAxisG
        //     .call(yAxis)
        //     .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
        //     .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
        //     .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1));

        // Sub Group별 색상 설정하기
        const { scale: color } = createAxis({ graph, type: 'color', domain: subGroup, range: colors.slice(0, 3) });
        // const color = d3.scaleOrdinal().domain(subGroup).range(colors.slice(0, 3));

        // 중요!
        // Sub Group별로 stack을 만듬
        const stackedData = d3.stack().keys(subGroup)(data);

        /**
         * Referenced :
         * https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
         */

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

        // Stacked Bar Graph 그리기
        // 서브 그룹별로 stack을 만든 데이터를 넘겨줌
        const barG = graph.append('g').selectAll('g').data(stackedData);

        // 서브 그룹마다 rect를 만듬
        const bar = barG
            .join('g')
            .attr('fill', (d) => color(d.key))
            .selectAll('rect')
            .data((d) => d);

        // rect를 합치면서 하나의 bar 그리기
        bar.join('rect')
            .attr('x', (d) => xScale(d.data.krName))
            .attr('y', yScale(0)) // 0
            .attr('width', xScale.bandwidth())
            .attr('height', graphHeight - yScale(0)) // 0
            .on('mouseover', function (_event, d) {
                const subgroupName = d3.select(this.parentNode).datum().key; // 현재 선택한 데이터의 서브 그룹명
                const subgroupValue = d.data[subgroupName]; // 데이터 값
                tooltip
                    .html(
                        `<div class="d3-tooltip-name">${d.data.krName}</div>
                        <br/>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color-${subgroupName}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-name">${subgroupName}: </span>${subgroupValue.toLocaleString()}
                        </div>`
                    )
                    .style('visibility', 'visible');
            })
            .on('mousemove', function (event, _d) {
                tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
            })
            .on('mouseleave', function (_event, d) {
                tooltip.html(``).style('visibility', 'hidden');
            });

        // Animation Effect
        d3.selectAll('rect')
            .transition()
            .ease(d3.easeLinear)
            .duration(500)
            .attr('y', (d) => yScale(d[1]))
            .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
            .delay((_, i) => i * 10);
    }, []);

    return <div style={{ margin: 100, backgroundColor: '#fff' }} ref={barChart} id="canvas" />;
}
