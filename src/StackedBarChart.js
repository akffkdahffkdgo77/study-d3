import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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
].map((krName) => ({
    krName,
    x: Math.floor(Math.random() * (1000000 - 100)) + 100,
    y: Math.floor(Math.random() * (1000000 - 100)) + 100,
    z: Math.floor(Math.random() * (1000000 - 100)) + 100
}));

export default function StackedBarChart() {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // 기본 canvas 설정
        const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('minWidth', '100px')
            .style('padding', '10px')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .style('background', '#252B2F')
            .style('visibility', 'hidden');

        const svg = d3
            .select(barChart.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        // 그래프가 그려질 svg의 사이즈 설정
        const graph = svg
            .append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
            .attr('transform', `translate(${ml}, ${mt})`);

        const xData = data.map((item) => item.krName);
        const subGroup = ['x', 'y', 'z'];

        // domain -> 실제 데이터 []
        // range -> 그래프에 표시될 데이터의 최소, 최대값
        // padding -> 간격
        const xScale = d3.scaleBand().domain(xData).range([0, graphWidth]).padding(0.25);

        // https://observablehq.com/@d3/d3-scalelinear#cell-174
        // Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
        // scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌

        console.log(d3.extent(data, (d) => d.x + d.y + d.z));
        const yScale = d3
            .scaleLinear()
            // .domain([0, data.reduce((accumulator, a) => a.x + a.y + a.z + accumulator, 0)])
            .domain(d3.extent(data, (d) => d.x + d.y + d.z))
            .domain([0, 3000000])
            .nice()
            .range([graphHeight, 0]);

        // X축, Y축
        const xAxisG = graph.append('g');
        const xAxis = d3.axisBottom(xScale).tickSize(graphHeight).tickPadding(10);

        const yAxisG = graph.append('g');
        const yAxis = d3.axisLeft(yScale);

        const color = d3.scaleOrdinal().domain(subGroup).range(['#000000', '#e41a1c', '#377eb8', '#4daf4a']);

        // d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv').then(
        //     (data) => {
        //         console.log(data.columns.splice(1));
        //         console.log(d3.stack().keys(['Nitrogen', 'normal', 'stress'])(data));

        //         return data;
        //     }
        // );

        const stackedData = d3.stack().keys(subGroup)(data);
        // console.log(stackedData);
        // console.log(xScale.bandwidth());

        xAxisG
            .call(xAxis)
            .call((g) => g.select('.domain').attr('stroke', 'transparent'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .attr('transform', `translate(${xScale.bandwidth() - (xScale.step() - xScale.bandwidth())}, 0)`)
            );
        // xAxisG.selectAll('text').attr('transform', 'translate(0, 10)');

        yAxisG
            .call(yAxis)
            .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1));

        graph
            .append('g')
            .selectAll('g')
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join('g')
            .attr('fill', (d) => color(d.key))
            .selectAll('rect')
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data((d) => d)
            .join('rect')
            .attr('x', (d) => xScale(d.data.krName))
            .attr('y', (d) => {
                console.log('y', d, yScale(d[1]));
                return yScale(d[1]);
            })
            .attr('height', (d) => {
                console.log('height', yScale(d[0]) - yScale(d[1]));
                return yScale(d[0]) - yScale(d[1]);
            })
            .attr('width', xScale.bandwidth());

        // const bars = graph.selectAll('rect');

        // 0 -> 값만큼 height가 생기는 animation을 위해서 초기값을 0으로 설정
        // bars.enter()
        //     .append('rect')
        //     .attr('width', xScale.bandwidth)
        //     .attr('height', graphHeight - yScale(0))
        //     .attr('fill', (d) => color(d.key))
        //     // .attr('fill', 'rgba(54, 162, 235, 0.2)')
        //     .attr('x', (d) => xScale(d.krName))
        //     .attr('y', yScale(0))
        //     // mouse over -> tooltip이 보이도록
        //     .on('mouseover', function (e, data) {
        //         tooltip
        //             .html(
        //                 `<div class="d3-tooltip-name">${
        //                     data.krName
        //                 }</div><br/><div class="d3-tooltip-label"><div class="d3-tooltip-color"><span></span></div><span class="d3-tooltip-name">totalCount:</span>${data.totalCount.toLocaleString()}</div>`
        //             )
        //             .style('visibility', 'visible');
        //         d3.select(this).transition().attr('fill', 'rgba(54, 162, 235, 0.5)');
        //     })
        //     // mouse move
        //     .on('mousemove', function (event) {
        //         tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        //     })
        //     // mouse out ->
        //     .on('mouseout', function () {
        //         tooltip.html(``).style('visibility', 'hidden');
        //         d3.select(this).transition().attr('fill', 'rgba(54, 162, 235, 0.2)');
        //     });

        // d3.selectAll('rect')
        //     .transition()
        //     .ease(d3.easeLinear)
        //     .duration(500)
        //     .attr('y', (d) => yScale(d.x + d.y + d.z))
        //     .attr('height', (d) => graphHeight - yScale(d.x + d.y + d.z))
        //     .delay((_, i) => i * 100);
    }, []);

    return <div style={{ margin: 100, backgroundColor: '#fff' }} ref={barChart} id="canvas" />;
}
