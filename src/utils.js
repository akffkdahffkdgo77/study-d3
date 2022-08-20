import * as d3 from 'd3';

/**
 *  Referenced :
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */

export const createCanvas = ({ canvas, width, height, margin: [mt, mr, mb, ml], tooltipOptions }) => {
    const graphWidth = width - mr - ml;
    const graphHeight = height - mt - mb;

    // 기본 canvas 설정
    const svg = d3
        .select(canvas)
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

    // 툴팁 설정
    const tooltip = d3.select('body').append('div').attr('class', 'd3-tooltip');
    Object.keys(tooltipOptions).forEach((key) => tooltip.style(key, tooltipOptions[key]));

    return { graph, tooltip };
};

export const createAxis = ({ graph, type, domain, range, options }) => {
    const axisG = graph.append('g');
    let scale = null;
    let axis = null;

    if (type === 'x') {
        /**
         *  scale band -> not continuous data set
         *  domain -> 실제 데이터 []
         *  range -> 그래프에 표시될 데이터의 최소, 최대값
         *  padding -> 간격
         */
        scale = d3.scaleBand().domain(domain).range(range).padding(options.padding);

        // X축이 그래프의 하단에 그려지도록
        axis = d3
            .axisBottom(scale)
            // grid line 그리기
            .tickSize(options.tickSize)
            // x축 label과 x축 사이의 간격 설정
            .tickPadding(options.tickPadding);

        // X축 Styling
        axisG
            .call(axis)
            .call((g) => g.select('.domain').attr('stroke', 'transparent'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .attr('transform', `translate(${scale.bandwidth() - (scale.step() - scale.bandwidth())}, 0)`)
            );
    } else if (type === 'y') {
        /**
         *  https://observablehq.com/@d3/d3-scalelinear#cell-174
         *  Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
         *  scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌
         */
        scale = d3.scaleLinear().domain(domain).nice().range(range);

        // Y축이 그래프의 왼쪽에서 그려지도록
        axis = d3.axisLeft(scale);

        // Y축 Styling
        axisG
            .call(axis)
            .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
            .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
            .call((g) => g.selectAll('.tick line').clone().attr('x2', options.graphWidth).attr('stroke-opacity', 0.1));
    } else if (type === 'color') {
        // 색상 설정
        scale = d3.scaleOrdinal().domain(domain).range(range);
    }

    return { scale, axis };
};
