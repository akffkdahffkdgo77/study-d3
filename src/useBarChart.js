import { useEffect, useRef } from "react";

const useBarChart = () => {
    // const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        

        // // 기본 canvas 설정
        // const svg = d3
        //     .select(barChart.current)
        //     .append('svg')
        //     .attr('width', width)
        //     .attr('height', height)
        //     .attr('viewBox', [0, 0, width, height]);

        // // 그래프가 그려질 svg의 사이즈 설정
        // const graph = svg
        //     .append('g')
        //     .attr('width', graphWidth)
        //     .attr('height', graphHeight)
        //     // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
        //     .attr('transform', `translate(${ml}, ${mt})`);

        // TOOLTIP Styling
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

        // X축, Y축 설정하기
        const xAxisG = graph.append('g');

        // domain -> 실제 데이터 []
        // range -> 그래프에 표시될 데이터의 최소, 최대값
        // padding -> 간격
        const xScale = d3
            .scaleBand()
            .domain(data.map((item) => item.krName))
            .range([0, graphWidth])
            .padding(0.25);

        const xAxis = d3
            .axisBottom(xScale)
            .tickSize(height - mt - mb)
            .tickPadding(10);
        // X축 Styling
        xAxisG
            .call(xAxis)
            .call((g) => g.select('.domain').attr('stroke', 'transparent'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .attr('transform', `translate(${xScale.bandwidth() - (xScale.step() - xScale.bandwidth())}, 0)`)
            );

        const yAxisG = graph.append('g');

        // https://observablehq.com/@d3/d3-scalelinear#cell-174
        // Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
        // scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.extent(data, (d) => d.totalCount)[1]])
            .nice()
            .range([graphHeight, 0]);
        const yAxis = d3.axisLeft(yScale);
        yAxisG
            .call(yAxis)
            .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) => g.selectAll('.tick line').clone().attr('x2', graphWidth).attr('stroke-opacity', 0.1));

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


}

export default useBarChart;