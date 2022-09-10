import * as d3 from 'd3';

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */

export const createBar = ({ graph, data, coords, options, mouseOver, mouseMove, mouseLeave }) => {
    const bars = graph.append('g').selectAll().data(data);

    const barG = bars
        .enter()
        .append('rect')
        .attr('x', coords.x)
        .attr('y', coords.y)
        .on('mouseover', mouseOver)
        .on('mousemove', mouseMove)
        .on('mouseleave', mouseLeave);

    Object.keys(options).forEach((key) => barG.attr(key, options[key]));
};

export const createStackedBar = ({ graph, data, coords, options, mouseOver, mouseMove, mouseLeave }) => {
    // 카테고리별로 stack을 만든 데이터를 넘겨줌
    const barG = graph.selectAll().data(data);

    // 카테고리마다 rect를 만듬
    // https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_join
    const bar = barG
        .join('g')
        .attr('fill', options.color)
        .selectAll()
        .data((d) => d);

    // rect를 합치면서 하나의 bar 그리기
    bar.join('rect')
        .attr('x', coords.x)
        .attr('y', coords.y)
        .attr('width', options.width)
        .attr('height', options.height)
        .on('mouseover', mouseOver)
        .on('mousemove', mouseMove)
        .on('mouseleave', mouseLeave);
};

export const createGroupedBar = ({ graph, coords, category, data, options, mouseOver, mouseMove, mouseLeave }) => {
    const barG = graph.selectAll().data(data);

    // 카테고리마다 rect를 만듬
    const bar = barG
        .join('g')
        .attr('transform', options.transform)
        .selectAll()
        .data((d) => category.map((key) => ({ key, value: d[key] })));

    bar.join('rect')
        .attr('x', coords.x)
        .attr('y', coords.y)
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('fill', options.fill)
        .on('mouseover', mouseOver)
        .on('mousemove', mouseMove)
        .on('mouseleave', mouseLeave);
};

export const animateBar = ({ graph, options }) => {
    d3.select(graph)
        .selectAll('rect')
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .attr('y', options.y)
        .attr('height', options.height)
        .delay((_, i) => i * 10);
};
