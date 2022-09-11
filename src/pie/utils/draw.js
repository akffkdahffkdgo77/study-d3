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

export const createGradientDonut = ({ graph, data, options, onMouseOver, onMouseMove, onMouseLeave }) => {
    const pie = d3.pie().value((d) => d[1]);
    const computedData = pie(Object.entries(data));

    const arc = d3
        .arc()
        .innerRadius(options.radius / 2)
        .outerRadius(options.radius);

    const gradient = graph.append('defs').append('linearGradient').attr('id', 'grad');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'hsl(228, 78%, 49%)');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', 'hsl(200, 96%, 64%)');

    graph
        .selectAll()
        .data(computedData)
        .join('path')
        .attr('class', (d) => (d.index === 0 ? 'raise' : ''))
        .attr('d', arc)
        .attr('fill', (d) => {
            if (d.index > 0) {
                return '#F5F5F5';
            }
            return 'url(#grad)';
        })
        .attr('filter', (d) => {
            if (d.index > 0) {
                return 'none';
            }
            return 'drop-shadow(1px 1px 4px black)';
        })

        .on('mouseover', onMouseOver)
        .on('mousemove', onMouseMove)
        .on('mouseleave', onMouseLeave)
        .transition()
        .duration(1200)
        .attrTween('d', (d) => {
            const i = d3.interpolate(d.startAngle, d.endAngle);
            return (t) => {
                d.endAngle = i(t);
                return arc(d);
            };
        });

    d3.select('.raise').raise();
};
