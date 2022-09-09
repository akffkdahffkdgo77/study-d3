import * as d3 from 'd3';

export const createDonut = ({ graph, data, options, onMouseOver, onMouseMove, onMouseLeave }) => {
    const pie = d3.pie().value((d) => d[1]);
    const computedData = pie(Object.entries(data));

    const arc = d3
        .arc()
        .innerRadius(options.radius / 2)
        .outerRadius(options.radius);

    graph
        .selectAll()
        .data(computedData)
        .join('path')
        .attr('d', arc)
        .attr('fill', options.fill)
        .attr('stroke', options.stroke)
        .style('stroke-width', options.strokeWidth)
        .style('opacity', options.opacity)
        .on('mouseover', onMouseOver)
        .on('mousemove', onMouseMove)
        .on('mouseleave', onMouseLeave);
};
