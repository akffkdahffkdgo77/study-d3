import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { bisectCenter } from 'd3';

const width = 1000;
const height = 800;
let [mt, mr, mb, ml] = [50, 0, 50, 100];
const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const data = [
    // { date: '2022-04-24', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-04-25', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-04-26', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-04-29', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-04-30', value: Math.floor(Math.random() * (1000000 - 100)) + 100 }
    { date: '2022-05-01T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-02T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-03T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-04T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-05T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-06T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-07T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-08T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-09T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { date: '2022-05-10T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 }
    // { date: '2022-05-10T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-13T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-14T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-15T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-16T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-17T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-20T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-21T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-22T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-23T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    // { date: '2022-05-24T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 }
];

/*
    References :
    https://observablehq.com/@kellytall/day-one-a-line-chart
*/

// https://observablehq.com/@d3/line-with-tooltip
export default function Test() {
    const lineChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // TODO : Tooltip
        // https://observablehq.com/@d3/line-with-tooltip

        const xData = data.map((d) => new Date(d.date));
        const yData = data.map((d) => d.value);
        const singleData = d3.map(data, (d) => d);
        const indexData = d3.map(data, (_, i) => i);

        // SVG 추가하기
        const svg = d3
            .select(lineChart.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            // .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .style('-webkit-tap-highlight-color', 'transparent')
            .style('overflow', 'visible');

        // const focus = svg.append('g').attr('class', 'focus').style('display', 'none');
        // focus.append('circle').attr('r', 5).attr('class', 'circle').style('opacity', 0);

        // const tooltip = d3
        //     .select(lineChart.current)
        //     .append('div')
        //     .attr('class', 'tooltip')
        //     .style('position', 'absolute')
        //     .style('z-index', '10')
        //     .style('padding', '10px')
        //     .style('minWidth', '100px')
        //     .style('background', '#252B2F')
        //     .style('border-radius', '4px')
        //     .style('color', '#fff');

        // svg.append('rect').attr('class', 'overlay').attr('width', width).attr('height', height).style('opacity', 0);
        // .on('mouseover', () => {
        //     focus.style('display', null);
        // })
        // .on('mouseout', () => {
        //     tooltip.transition().duration(300).style('opacity', 0);
        // })
        // .on('mousemove', mousemove);

        // function mousemove(event) {
        //     // const bisect = d3.bisectLeft((d, i) => i);
        //     // const xPos = d3.pointer(event)[0];
        //     // const x0 = bisect(data, xScale.invert(xPos));

        //     const x0 = d3.bisectCenter(indexData, xScale.invert(d3.pointer(event)[0]));
        //     const d0 = data[x0];
        //     // const x = x0 === data.length - 1 ? data.length : x0 > 0 ? x0 - 1 : 0;
        //     console.log(x, x0, d0);

        //     // focus.attr('transform', `translate(${xScale(x)},${yScale(d0.value)})`);
        //     tooltip.transition().duration(300).style('opacity', 0.9);
        //     console.log(`translate(${xScale(x0) + 30}px,${yScale(d0.value) - 30}px)`);
        //     console.log(xScale(x0), yScale(yData[x0], graphHeight - yScale(yData[x0]) - 30));
        //     tooltip
        //         .html('testtesttesttest')
        //         .style('transform', `translate(${xScale(x0)}px,-${graphHeight - yScale(yData[x0]) - 30}px)`);
        // }

        // See : https://observablehq.com/@harrylove/draw-a-circle-dot-marker-on-a-line-path-with-d3
        // intersect하는 부분에 circle 추가하기
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

        // GRAPH 추가하기
        const graph = svg
            .append('g')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
            .attr('transform', `translate(${ml}, ${mt})`);

        // x축 데이터 scale
        const xScale = d3
            // data를 new Date()로
            // line chart는 continuous data -> 그래야 tooltip 그릴 수 있음
            .scaleLinear()
            // [min, max] 반환
            // .domain(d3.extent(data, (d) => new Date(d.date)))
            .domain(d3.extent(data, (d, i) => i))
            .nice()
            .range([0, graphWidth]);
        // .padding(-1);

        // xScale.ticks(d3.timeDay.every(1));
        // xScale.tickFormat(null, '%Y-%m-%d');
        // .ticks(20);

        // x축 생성하기
        const xAxis = d3
            // x축은 그래프 하단에
            .axisBottom(xScale)
            .tickFormat((d, i) => {
                console.log(data[i].date);
                return data[i].date.split('T')[0];
            })
            // .ticks(graphWidth / 80)
            // grid line을 그리고 싶으면 추가
            .tickSize(height - mt - mb)
            // x축과 x축 label 간격
            .tickPadding(10);

        // x축 데이터를 그룹을 추가한 다음 그룹에 추가하기
        const xAxisG = graph.append('g');

        // y축 데이터 scale
        const yScale = d3
            // y는 보통 linear를 사용
            .scaleLinear()
            // [min, max]
            .domain(d3.extent(data, (d) => d.value))
            // 값이 2,5,10의 배수로 나오도록
            .nice()
            .range([graphHeight, 0]);

        // y축은 왼쪽에
        const yAxis = d3.axisLeft(yScale);

        // y축 데이터를 그룹을 추가한 다음 그룹에 추가하기
        const yAxisG = graph.append('g');

        /** 그래프 그리기!!! */

        // x축 설정
        // 축 및 grid line 색상 변경
        xAxisG
            .call(xAxis)
            .call((g) => g.select('.domain').remove())
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1));
        // .call((g) =>
        //     g
        //         .selectAll('.tick line')
        //         .attr('transform', `translate(}, 0)`)
        // );

        // y축 설정
        // 축 및 grid line 색상 변경
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

        // // 툴팁에 표시될 데이터 형식 설정하기
        // const formatDate = xScale.tickFormat(null, '%Y-%m-%d');
        // const formatValue = yScale.tickFormat(100, ',');
        const title = (i) => `${xData[i]}\n${yData[i].toLocaleString()}`;

        function onEnter(event) {
            // https://github.com/d3/d3-scale/blob/v4.0.2/README.md#continuous_invert
            // invert : 현재 마우스 포인터의 위치를 넘겨주면 그 위치에 해당하는 실제 데이터 값을 반환
            // continuous scale만 사용 가능한 함수
            // https://github.com/d3/d3-array/blob/v3.2.0/README.md#bisectCenter
            // bisectCenter : x의 값에 가장 근접한 값의 index를 반환
            // xData를 넘겨주면 xData array에서 넘겨 받은 x의 값에 가까운 데이터를 찾고 해당 데이터의 index를 반환
            const i = d3.bisectCenter(indexData, xScale.invert(d3.pointer(event)[0]));
            const left = d3.bisectLeft(indexData, xScale.invert(d3.pointer(event)[0]));
            const right = d3.bisectRight(indexData, xScale.invert(d3.pointer(event)[0]));
            console.log('on enter', i, left, right);

            // const coord = right === 0 ? right : left === data.length - 1 ? left : i > 0 ? i - 1 : 0;
            const coord = left === data.length || right === data.length ? data.length : i > 0 ? i - 1 : 0;

            // 툴팁 설정
            tooltip.style('display', null);
            tooltip.attr(
                'transform',
                `translate(${100 + xScale(coord === data.length ? coord - 1 : coord)},${
                    yScale(yData[coord === data.length ? data.length - 1 : coord]) + 70
                })`
            );
            console.log(`translate(${xScale(coord)},${yScale(yData[coord])})`);
            console.log(xScale(1) - xScale(0));

            const path = tooltip.selectAll('path').data([,]).join('path').attr('fill', 'white').attr('stroke', 'black');
            const text = tooltip
                .selectAll('text')
                .data([,])
                .join('text')
                .call((text) =>
                    text
                        .selectAll('tspan')
                        .data(`${title(coord === data.length ? data.length - 1 : coord)}`.split(/\n/))
                        .join('tspan')
                        .attr('x', 0)
                        .attr('y', (_, i) => `${i * 1.1}em`)
                        .attr('font-weight', (_, i) => (i ? null : 'bold'))
                        .text((d) => d)
                );

            const { y, width: w, height: h } = text.node().getBBox();
            console.log(y, w, h);
            text.attr('transform', `translate(${-w / 2},${15 - y})`);
            path.attr('d', `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
            svg.property('value', singleData[coord]).dispatch('input', { bubbles: true });
        }

        function onLeave() {
            tooltip.style('display', 'none');
            svg.node().value = null;
            svg.dispatch('input', { bubbles: true });
        }

        // TOOLTIP 생성하기
        const tooltip = svg.append('g').style('pointer-events', 'none');

        // 그래프에 툴팁 관련 이벤트 리스너 추가하기
        svg.on('pointerenter pointermove', onEnter)
            .on('pointerleave', onLeave)
            .on('touchstart', (event) => event.preventDefault());

        // 라인 그리기
        const line = d3
            .line()
            .defined((d) => !isNaN(d.value))
            .x((d, i) => {
                console.log(xScale(i));
                return xScale(i);
            })
            .y((d) => yScale(d.value));

        graph
            .append('path')
            // .attr('transform', `translate(${xScale.step()}, 0)`)
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

        // const line = d3
        //     .line()
        //     .defined((i) => !isNaN(yData[i]))
        //     .x((i) => xScale(xData[i]))
        //     .y((i) => yScale(yData[i]));

        // graph
        //     .append('path')
        //     .datum(data)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'rgba(54, 162, 235, 0.2)')
        //     .attr('stroke-width', 3)
        //     .attr('stroke-linecap', 'round')
        //     .attr('stroke-linejoin', 'round')
        //     .attr('marker-start', 'url(#dot)')
        //     .attr('marker-mid', 'url(#dot)')
        //     .attr('marker-end', 'url(#dot)')
        //     .attr('d', line(indexData))
        //     .call(transition);

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
