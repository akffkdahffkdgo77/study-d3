import * as d3 from 'd3';

export const createArea = ({ graph, data, x, y, options }) => {
    const area = d3.area().curve(d3.curveCardinal).x(x).y0(y.y0).y1(y.y1);

    graph
        .append('path')
        .datum(data)
        .attr('fill', options.fill)
        .attr('fill-opacity', options.fillOpacity)
        .attr('stroke', options.stroke)
        .attr('d', area);
};

export const createLine = ({ graph, data, x, y, options }) => {
    const line = d3.line().curve(d3.curveCardinal).x(x).y(y);

    graph
        .append('path')
        .datum(data)
        .attr('fill', options.fill)
        .attr('stroke', options.stroke)
        .attr('stroke-width', options.strokeWidth)
        .attr('d', line);
};

export const createDots = ({ graph, data, cx, cy, r, onMouseOver, onMouseMove, onMouseLeave }) => {
    graph
        .selectAll()
        .data(data)
        .join('circle')
        .attr('fill', 'transparent')
        .attr('stroke', 'none')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', r)
        .on('mouseover', onMouseOver)
        .on('mousemove', onMouseMove)
        .on('mouseleave', onMouseLeave);
};
