import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const width = 800;
const height = 800;
let [mt, mr, mb, ml] = [50, 0, 50, 100];
const graphWidth = width - ml - mr;
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

// https://github.com/d3/d3/blob/main/API.md#d3-api-reference
function App() {
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
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('minWidth', '100px')
            .style('background', '#252B2F')
            .style('border-radius', '4px')
            .style('color', '#fff');

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

        // domain -> 실제 데이터 []
        // range -> 그래프에 표시될 데이터의 최소, 최대값
        // padding -> 간격
        const x = d3
            .scaleBand()
            .domain(data.map((item) => item.krName))
            .range([0, graphWidth])
            .padding(0.25);

        // https://observablehq.com/@d3/d3-scalelinear#cell-174
        // Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
        // scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌
        const y = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.totalCount))
            .nice()
            .range([graphHeight, 0]);

        // X축, Y축
        const xAxisG = graph.append('g');
        const xAxis = d3
            .axisBottom(x)
            .tickSize(height - mt - mb)
            .tickPadding(10);

        const yAxisG = graph.append('g');
        const yAxis = d3.axisLeft(y);

        xAxisG
            .call(xAxis)
            .call((g) => g.select('.domain').attr('stroke', 'transparent'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .attr('transform', `translate(${x.bandwidth() - (x.step() - x.bandwidth())}, 0)`)
            );
        // xAxisG.selectAll('text').attr('transform', 'translate(0, 10)');

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

        const bars = graph.selectAll('rect').data(data);

        // 0 -> 값만큼 height가 생기는 animation을 위해서 초기값을 0으로 설정
        bars.enter()
            .append('rect')
            .attr('width', x.bandwidth)
            .attr('height', graphHeight - y(0))
            .attr('fill', 'rgba(54, 162, 235, 0.2)')
            .attr('x', (d) => x(d.krName))
            .attr('y', y(0))
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
            // mouse out ->
            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');
                d3.select(this).transition().attr('fill', 'rgba(54, 162, 235, 0.2)');
            });

        d3.selectAll('rect')
            .transition()
            .ease(d3.easeLinear)
            .duration(500)
            .attr('y', (d) => y(d.totalCount))
            .attr('height', (d) => graphHeight - y(d.totalCount))
            .delay((_, i) => i * 100);
    }, []);

    return (
        <div style={{ backgroundColor: '#000', height: '100vh' }}>
            <h1 style={{ width: '100%', textAlign: 'center', color: '#fff', marginTop: 0 }}>Bar Chart</h1>
            <div style={{ margin: 100, backgroundColor: '#fff' }} ref={barChart} id="canvas" />
        </div>
    );
}

export default App;
