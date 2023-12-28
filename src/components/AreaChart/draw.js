import * as d3 from 'd3';

export const createArea = ({ graph, data, coords, options }) => {
    const area = d3.area().curve(d3.curveCardinal).x(coords.x).y0(coords.y0).y1(coords.y1);

    graph
        .append('path')
        .datum(data)
        .attr('fill', options.fill)
        .attr('fill-opacity', options.fillOpacity)
        .attr('stroke', options.stroke)
        .attr('d', area);
};
