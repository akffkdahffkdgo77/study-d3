/* eslint-disable no-sparse-arrays */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const width = 1000;
const height = 800;
let [mt, mr, mb, ml] = [50, 0, 50, 100];
const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const data = [
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
];

/**
 *  References :
 *  https://observablehq.com/@kellytall/day-one-a-line-chart
 *  https://observablehq.com/@d3/line-with-tooltip
 */

export default function LineChart() {
    const lineChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        // React.18 Strict Mode
        // Prevent Render twice
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // 사용할 데이터
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
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .style('-webkit-tap-highlight-color', 'transparent')
            .style('overflow', 'visible');

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

        // 그룹을 추가한 다음 x축 데이터를 그룹에 추가하기
        const xAxisG = graph.append('g');

        // x축 데이터 scale
        const xScale = d3
            // data를 new Date()로
            // line chart는 continuous data -> 그래야 bisect를 사용할 수 있음
            .scaleLinear()
            // [min, max] 반환
            // 실제 Date 형식의 데이터가 아닌 0,1,2,.. 정수로 이루어진 데이터를 넘겨주기
            .domain(d3.extent(data, (_d, i) => i))
            .nice()
            .range([0, graphWidth]);

        // 그룹을 추가한 다음 y축 데이터를 그룹에 추가하기
        const yAxisG = graph.append('g');

        // x축 생성하기
        const xAxis = d3
            // x축은 그래프 하단에
            .axisBottom(xScale)
            // x축 label을 원하는 데이터로 설정하는 방법
            .tickFormat((_d, i) => {
                return data[i].date.split('T')[0];
            })
            // grid line을 그리고 싶으면 추가
            .tickSize(graphHeight)
            // x축과 x축 label 간격 설정
            .tickPadding(10);

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

        /** 그래프 그리기!!! */

        // x축 설정
        // 축 및 grid line 색상 변경
        xAxisG
            .call(xAxis)
            .call((g) => g.select('.domain').remove())
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1));

        // y축 설정
        // 축 및 grid line 색상 변경
        yAxisG
            .call(yAxis)
            .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1));

        // TOOLTIP 그리기!!!
        // https://observablehq.com/@d3/line-with-tooltip

        // 툴팁에 표시될 데이터 형식 설정하기
        const title = (i) => `${xData[i]}\n${yData[i].toLocaleString()}`;

        function onEnter(event) {
            // https://github.com/d3/d3-scale/blob/v4.0.2/README.md#continuous_invert
            // invert : 현재 마우스 포인터의 위치를 넘겨주면 그 위치에 해당하는 실제 데이터 값을 반환
            // continuous scale만 사용 가능한 함수

            // https://github.com/d3/d3-array/blob/v3.2.0/README.md#bisectCenter
            // bisectCenter : x의 값에 가장 근접한 값의 index를 반환
            // x축을 만들 때 사용한 데이터를 넘겨주기
            // ->array에서 넘겨 받은 x의 값에 가까운 데이터를 찾고 해당 데이터의 index를 반환
            const i = d3.bisectCenter(indexData, xScale.invert(d3.pointer(event)[0]));
            const left = d3.bisectLeft(indexData, xScale.invert(d3.pointer(event)[0]));
            const right = d3.bisectRight(indexData, xScale.invert(d3.pointer(event)[0]));

            const coord = left === data.length || right === data.length ? data.length : i > 0 ? i - 1 : 0;

            // 툴팁 UI
            tooltip.style('display', null);
            tooltip.attr(
                'transform',
                `translate(${100 + xScale(coord === data.length ? coord - 1 : coord)},${
                    yScale(yData[coord === data.length ? data.length - 1 : coord]) + 70
                })`
            );

            // Tooltip 그리기
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
            text.attr('transform', `translate(${-w / 2},${15 - y})`);
            path.attr('d', `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
            svg.property('value', singleData[coord]).dispatch('input', { bubbles: true });
        }

        function onLeave() {
            tooltip.style('display', 'none');
            svg.node().value = null;
            svg.dispatch('input', { bubbles: true });
        }

        // 그래프에 TOOLTIP 추가하기
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
