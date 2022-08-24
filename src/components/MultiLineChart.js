import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createAxis, createCanvas } from '../utils';

// const width = 800;
// const height = 800;
// let [mt, mr, mb, ml] = [50, 20, 50, 50];
// const graphWidth = width - mr - ml;
// const graphHeight = height - mt - mb;

// const data = Array.from(Array(21)).map((_, i) => ({
//     date: i,
//     x: Math.floor(Math.random() * (1000 - 500)) + 500,
//     y: Math.floor(Math.random() * (500 - 100)) + 100,
//     z: Math.floor(Math.random() * (1500 - 1000)) + 1000
// }));

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/connectedscatter_multi.html
 */

export default function MultiLineChart({ data, options }) {
    const lineChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        // React.18 Strict Mode
        // Prevent Render twice
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        const { category, datasets } = data;
        const graphWidth = lineChart.current.clientWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // Data 형식 맞추기
        // const category = ['x', 'y', 'z'];
        const chartData = category.map((category) => ({
            name: category,
            values: datasets.map((d) => ({ year: d.date, value: d[category] }))
        }));

        // SVG 추가하기
        const { graph, tooltip } = createCanvas({
            canvas: lineChart.current,
            width: lineChart.current.clientWidth + Math.floor(options.dimensions.margin[3] / 2),
            height: options.dimensions.height,
            margin: options.dimensions.margin,
            tooltipOptions: options.tooltip
        });

        // X축, Y축 설정하기
        const { scale: xScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'x',
            domain: d3.extent(datasets, (d) => d.date),
            range: [0, graphWidth],
            draw: true,
            options: {
                ticks: datasets.length,
                tickSize: graphHeight,
                tickPadding: 10
            }
        });

        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: [
                0,
                d3.max([d3.max(datasets, (d) => d.x), d3.max(datasets, (d) => d.y), d3.max(datasets, (d) => d.z)])
            ],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        const { scale: colors } = createAxis({ graph, type: 'color', domain: category, range: options.colors });

        // // 그룹을 추가한 다음 x축 데이터를 그룹에 추가하기
        // const xAxisG = graph.append('g');

        // x축 데이터 scale
        // const xScale = d3
        //     .scaleLinear()
        //     // [min, max] 반환
        //     .domain(d3.extent(data, (d) => d.date))
        //     .range([0, graphWidth]);

        // // x축 생성하기
        // const xAxis = d3
        //     // x축은 그래프 하단에
        //     .axisBottom(xScale)
        //     // grid line을 그리고 싶으면 추가
        //     .tickSize(graphHeight)
        //     // x축과 x축 label 간격 설정
        //     .tickPadding(10)
        //     // grid line 수
        //     .ticks(data.length);

        // 그룹을 추가한 다음 y축 데이터를 그룹에 추가하기
        // const yAxisG = graph.append('g');

        // // y축 데이터 scale
        // const yScale = d3
        //     // y는 보통 linear를 사용
        //     .scaleLinear()
        //     // [min, max]
        //     // 각 카테고리별로 max를 구한 후 그 중에서도 max를 구하기
        //     .domain([0, d3.max([d3.max(data, (d) => d.x), d3.max(data, (d) => d.y), d3.max(data, (d) => d.z)])])
        //     // 값이 2,5,10의 배수로 나오도록
        //     .nice()
        //     .range([graphHeight, 0]);

        // y축은 왼쪽에
        // const yAxis = d3.axisLeft(yScale);

        // /** 그래프 그리기!!! */
        // // x축 설정
        // // 축 및 grid line 색상 변경
        // xAxisG
        //     .call(xAxis)
        //     .call((g) => g.select('.domain').remove())
        //     .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1));

        // // y축 설정
        // // 축 및 grid line 색상 변경
        // yAxisG
        //     .call(yAxis)
        //     .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
        //     .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
        //     .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1));

        // 라인을 여러 개 그리기 때문에 각 라인별 색상 설정하기
        // const colors = d3
        //     .scaleOrdinal()
        //     .domain(category)
        //     .range(['#D8ECFF', '#FFDEE3', '#FFF6E1', '#E0F3F2', '#E8DDFF', '#FFEDDD']);

        // Tooltip 설정하기
        // const tooltip = d3
        //     .select(lineChart.current)
        //     .append('div')
        //     .attr('class', 'd3-tooltip')
        //     .style('position', 'absolute')
        //     .style('z-index', '10')
        //     .style('visibility', 'hidden')
        //     .style('padding', '10px')
        //     .style('minWidth', '100px')
        //     .style('background', '#252B2F')
        //     .style('border-radius', '4px')
        //     .style('color', '#fff');

        // See : https://d3-graph-gallery.com/graph/connectedscatter_tooltip.html
        function onMouseOver(_event, d) {
            const category = d3.select(this.parentNode).datum(); // 현재 선택한 데이터의 카테고리명 찾기
            tooltip
                .html(
                    `<div class="d3-tooltip-name">
                    ${category.name}
                </div>
                <br/>
                <div class="d3-tooltip-label">
                    <div class="d3-tooltip-color-${category.name}">
                        <span></span>
                    </div>
                    <span class="d3-tooltip-name">${d.year}:</span>${d.value.toLocaleString()}
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

        // 라인 그리기
        const line = d3
            .line()
            .x((d) => xScale(d.year))
            .y((d) => yScale(d.value));

        graph
            .selectAll('lines')
            .data(chartData)
            .join('path')
            .attr('d', (d) => line(d.values))
            .attr('stroke', (d) => colors(d.name))
            .style('stroke-width', 4)
            .style('fill', 'none')
            .attr('transform', `translate(${options.dimensions.margin[3]}, ${options.dimensions.margin[0]})`)
            .call(transition);

        // Point 추가가 추가될 group을 category별로 생성
        const dotG = graph
            .selectAll('dots')
            .data(chartData)
            .join('g')
            .style('fill', (d) => colors(d.name));

        // 생성한 group마다 circle 그려주기
        dotG.selectAll('points')
            .data((d) => d.values)
            .join('circle')
            .attr('cx', (d) => xScale(d.year))
            .attr('cy', (d) => yScale(d.value))
            .attr('r', 5)
            .attr('stroke', 'white')
            .attr('transform', `translate(${options.dimensions.margin[3]}, ${options.dimensions.margin[0]})`)
            .on('mouseover', onMouseOver)
            .on('mousemove', onMouseMove)
            .on('mouseleave', onMouseLeave);

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
    }, [data, options]);

    return (
        <div
            style={{
                display: 'flex',
                alitngnItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 4
            }}
            ref={lineChart}
            id="multi-line-chart-canvas"
        />
    );
}
