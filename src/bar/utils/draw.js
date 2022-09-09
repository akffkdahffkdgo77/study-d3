/* eslint-disable no-sparse-arrays */
import * as d3 from 'd3';

/**
 *  Referenced :
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */

export const createBar = ({ graph, x, y, color, data, options, mouseOver, mouseMove, mouseLeave }) => {
    const bars = graph.selectAll().data(data);
    bars.enter()
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', options.width)
        // 0 -> 값만큼 height가 생기는 animation을 위해서 초기값을 0으로 설정
        .attr('height', options.height)
        .attr('fill', options.fill)
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

export const createGroupedBar = ({ graph, x, y, category, data, options, mouseOver, mouseMove, mouseLeave }) => {
    // Grouped Bar Graph 그리기
    const barG = graph.selectAll().data(data);

    // 카테고리마다 rect를 만듬
    const bar = barG
        .join('g')
        .attr('transform', options.transform)
        .selectAll()
        .data((d) => category.map((key) => ({ key, value: d[key] })));

    // rect를 합치면서 하나의 bar 그리기
    bar.join('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('fill', options.fill)
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
