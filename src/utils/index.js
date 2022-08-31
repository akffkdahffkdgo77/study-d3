/* eslint-disable no-sparse-arrays */
import * as d3 from 'd3';

/**
 *  Referenced :
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */

export function createLineCanvas({ canvas, width, height }) {
    // 기본 canvas 설정
    const svg = d3
        .select(canvas)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
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

    return svg;
}

export const createLineGraph = ({ svg, width, height, margin: [mt, mr, mb, ml] }) => {
    const graphWidth = width - mr - ml;
    const graphHeight = height - mt - mb;

    // 그래프가 그려질 svg의 사이즈 설정
    const graph = svg
        .append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        // translate를 해서 그래프가 전체 캔버스의 중심에서 그려지도록 설정
        .attr('transform', `translate(${ml}, ${mt})`);

    return graph;
};

// TOOLTIP 그리기!!!
// https://observablehq.com/@d3/line-with-tooltip
export const createLineTooltip = ({ svg, yData, singleData, indexData, x, y, total, toolTipText }) => {
    // 그래프에 TOOLTIP 추가하기
    const tooltip = svg.append('g').style('pointer-events', 'none');

    // 그래프에 툴팁 관련 이벤트 리스너 추가하기
    svg.on('pointerenter pointermove', function (event) {
        // https://github.com/d3/d3-scale/blob/v4.0.2/README.md#continuous_invert
        // invert : 현재 마우스 포인터의 위치를 넘겨주면 그 위치에 해당하는 실제 데이터 값을 반환
        // continuous scale만 사용 가능한 함수

        // https://github.com/d3/d3-array/blob/v3.2.0/README.md#bisectCenter
        // bisectCenter : x의 값에 가장 근접한 값의 index를 반환
        // x축을 만들 때 사용한 데이터를 넘겨주기
        // ->array에서 넘겨 받은 x의 값에 가까운 데이터를 찾고 해당 데이터의 index를 반환
        const i = d3.bisectCenter(indexData, x.invert(d3.pointer(event)[0]));
        const left = d3.bisectLeft(indexData, x.invert(d3.pointer(event)[0]));
        const right = d3.bisectRight(indexData, x.invert(d3.pointer(event)[0]));

        const coord = left === total || right === total ? total : i > 0 ? i - 1 : 0;

        // 툴팁 UI
        tooltip.style('display', null);
        tooltip.attr(
            'transform',
            `translate(${70 + x(coord === total ? coord - 1 : coord)},${
                y(yData[coord === total ? total - 1 : coord]) + 70
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
                    .data(`${toolTipText(coord === total ? total - 1 : coord)}`.split(/\n/))
                    .join('tspan')
                    .attr('x', 0)
                    .attr('y', (_, i) => `${i * 1.1}em`)
                    .attr('font-weight', (_, i) => (i ? null : 'bold'))
                    .text((d) => d)
            );

        const { y: yCoord, width: w, height: h } = text.node().getBBox();
        text.attr('transform', `translate(${-w / 2},${15 - yCoord})`);
        path.attr('d', `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
        svg.property('value', singleData[coord]).dispatch('input', { bubbles: true });
    })
        .on('pointerleave', function () {
            tooltip.style('display', 'none');
            svg.node().value = null;
            svg.dispatch('input', { bubbles: true });
        })
        .on('touchstart', (event) => event.preventDefault());
};

export const createLine = ({ graph, d }) => {
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
        .attr('d', d)
        .call(lineTransition);
};

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
    let tooltip = null;
    if ([...d3.select('.d3-tooltip')].length > 0) {
        tooltip = d3.select('.d3-tooltip');
    } else {
        tooltip = d3.select('#root').append('div').attr('class', 'd3-tooltip');
    }
    Object.keys(tooltipOptions).forEach((key) => tooltip.style(key, tooltipOptions[key]));

    return { graph, tooltip };
};

export const createAxis = ({ graph, draw, type, axisType = '', domain, range, options }) => {
    const axisG = graph.append('g');
    let scale = null;
    let axis = null;

    if (type === 'band') {
        /**
         *  scale band -> not continuous data set
         *  domain -> 실제 데이터 []
         *  range -> 그래프에 표시될 데이터의 최소, 최대값
         *  padding -> 간격
         */
        scale = d3
            .scaleBand()
            .domain(domain)
            .range(range)
            .paddingOuter(options.padding / 2)
            .paddingInner(options.padding);

        // X축이 그래프의 하단에 그려지도록
        axis = d3
            .axisBottom(scale)
            // grid line 그리기
            .tickSize(options.tickSize + 6)
            // x축 label과 x축 사이의 간격 설정
            .tickPadding(options.tickPadding);

        // X축 Styling
        if (draw) {
            axisG
                .call(axis)
                .call((g) => g.select('.domain').attr('stroke', 'transparent'))
                .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
                .call((g) =>
                    g
                        .selectAll('.tick line')
                        .attr('transform', `translate(${scale.bandwidth() - (scale.step() - scale.bandwidth())}, 0)`)
                );
        }
    } else if (type === 'linear') {
        /**
         *  https://observablehq.com/@d3/d3-scalelinear#cell-174
         *  Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
         *  scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌
         */
        scale = d3.scaleLinear().domain(domain).nice().range(range);

        if (axisType === 'x') {
            // // x축 생성하기
            axis = d3
                // x축은 그래프 하단에
                .axisBottom(scale)
                .ticks(options.ticks)
                .tickSize(options.tickSize + 6)
                .tickFormat(options.tickFormat || null)
                // x축 label과 x축 사이의 간격 설정
                .tickPadding(options.tickPadding);
        } else {
            // Y축이 그래프의 왼쪽에서 그려지도록
            axis = d3.axisLeft(scale);
        }

        if (draw) {
            if (axisType === 'y') {
                // Y축 Styling
                axisG
                    .call(axis)
                    .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
                    .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
                    .call((g) =>
                        g.selectAll('.tick line').clone().attr('x2', options.graphWidth).attr('stroke-opacity', 0.1)
                    );
            } else {
                axisG
                    .call(axis)
                    .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
                    .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1));
            }
        }
    } else if (type === 'color') {
        // 색상 설정
        scale = d3.scaleOrdinal().domain(domain).range(range);
    }

    return { scale, axis };
};

export const createBar = ({ graph, x, y, color, data, options, mouseOver, mouseMove, mouseLeave }) => {
    const bars = graph.selectAll().data(data);
    bars.enter()
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', options.width)
        // 0 -> 값만큼 height가 생기는 animation을 위해서 초기값을 0으로 설정
        .attr('height', options.height)
        .attr('fill', color)
        // mouse over -> tooltip이 보이도록
        .on('mouseover', mouseOver)
        // mouse move
        .on('mousemove', mouseMove)
        // mouse leave -> tooltip이 보이지 않도록
        .on('mouseleave', mouseLeave);
};

export const createStackedBar = ({ graph, x, y, color, data, options, mouseOver, mouseMove, mouseLeave }) => {
    // Stacked Bar Graph 그리기
    // 카테고리별로 stack을 만든 데이터를 넘겨줌
    const barG = graph.selectAll().data(data);

    // 카테고리마다 rect를 만듬
    // https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_join
    const bar = barG
        .join('g')
        .attr('fill', color)
        .selectAll()
        .data((d) => d);

    // rect를 합치면서 하나의 bar 그리기
    bar.join('rect')
        .attr('x', x)
        .attr('y', y) // 0
        .attr('width', options.width)
        .attr('height', options.height)
        .on('mouseover', mouseOver)
        .on('mousemove', mouseMove)
        .on('mouseleave', mouseLeave);
};

export const createGroupedBar = ({
    graph,
    x,
    xSubGroup,
    y,
    category,
    data,
    color,
    options,
    mouseOver,
    mouseMove,
    mouseLeave
}) => {
    // Grouped Bar Graph 그리기
    const barG = graph.selectAll().data(data);

    // 카테고리마다 rect를 만듬
    const bar = barG
        .join('g')
        .attr('transform', (d) => `translate(${x(d.label)}, 0)`)
        .selectAll()
        .data((d) => category.map((key) => ({ key, value: d[key] })));
    // rect를 합치면서 하나의 bar 그리기
    bar.join('rect')
        .attr('x', xSubGroup)
        .attr('y', y)
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('fill', color)
        .on('mouseover', mouseOver)
        .on('mousemove', mouseMove)
        .on('mouseleave', mouseLeave);
};

export const animateBar = ({ graph, y, height }) => {
    d3.select(graph)
        .selectAll('rect')
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .attr('y', y)
        .attr('height', height)
        .delay((_, i) => i * 10);
};

// See : https://observablehq.com/@jurestabuc/animated-line-chart
function lineTransition(path) {
    path.transition()
        .duration(3000)
        .attrTween('stroke-dasharray', function () {
            const length = this.getTotalLength();
            const interploate = d3.interpolateString('0,' + length, length + ',' + length);
            return function (t) {
                return interploate(t);
            };
        })
        .on('end', () => d3.select(this).call(lineTransition));
}

export const createLines = ({ graph, data, x, y, d, fill, onMouseOver, onMouseMove, onMouseLeave }) => {
    graph
        .selectAll()
        .data(data)
        .join('path')
        .attr('d', d)
        .attr('stroke', fill)
        .style('stroke-width', 4)
        .style('fill', 'none')
        .call(lineTransition);

    // Point 추가가 추가될 group을 category별로 생성
    const dotG = graph.selectAll().data(data).join('g').style('fill', fill);

    // 생성한 group마다 circle 그려주기
    dotG.selectAll()
        .data((d) => d.values)
        .join('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('stroke', 'white')
        .on('mouseover', onMouseOver)
        .on('mousemove', onMouseMove)
        .on('mouseleave', onMouseLeave);
};
