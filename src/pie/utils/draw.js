import * as d3 from 'd3';
import { appendAttr } from 'utils/settings';

/**
 *
 * @param {SVGGElement} graph SVG Element
 * @param {object} data datasets
 * @param {object} options attr options (width, height, stroke ...)
 * @param {func} onMouseOver Mouse Over Interaction
 * @param {func} onMouseMove Mouse Move Interaction
 * @param {func} onMouseLeave Mouse Leave Interaction
 */
export const createDonut = ({ graph, data, options, onMouseOver, onMouseMove, onMouseLeave }) => {
    const pie = d3.pie().value((d) => d[1]);
    const computedData = pie(Object.entries(data));

    const arc = d3
        .arc()
        .innerRadius(options.radius / 2)
        .outerRadius(options.radius);

    const donutG = graph
        .selectAll()
        .data(computedData)
        .join('path')
        .attr('d', arc)
        .on('mouseover', onMouseOver)
        .on('mousemove', onMouseMove)
        .on('mouseleave', onMouseLeave);

    appendAttr({ graph: donutG, options });
};

/**
 *  References :
 *  https://stackoverflow.com/questions/19114896/d3-js-chart-area-filling-with-different-colors
 *  https://dev.to/cselig/controlling-svg-draw-order-in-d3-4n9l
 */

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
