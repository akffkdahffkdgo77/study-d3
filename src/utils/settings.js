import * as d3 from 'd3';
import { createBandXAxis, createXAxis, createYAxis } from './axis';
import { createBandScale, createLinearScale, createOrdinalScale } from './scale';
import { drawBandXGridLines, drawXGridLines, drawYGridLines } from './gridLines';

/**
 *  Appending SVG Element and Preparing graph
 *
 *  @param {HTMLElement} canvas HTML element - required
 *  @param {object} options width, height, margin, transform  - required
 *  @returns {SVGGElement} returns svg <g> element
 */
export const createCanvas = ({ canvas, options }) => {
    const {
        width,
        height,
        margin: [mt, mr, mb, ml],
        transform
    } = options;

    const graphWidth = width - mr - ml;
    const graphHeight = height - mt - mb;

    const svg = d3
        .select(canvas)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);

    const graph = svg
        .append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .style('transform', transform || `translate(${ml}px, ${mt}px)`);

    return graph;
};

/**
 *  Configuring Tooltip
 *
 *  @param {object} tooltipOptions tooltip styling options  - optional
 *  @returns {HTMLDivElement} returns div element
 */
export const createToolTip = ({ tooltipOptions }) => {
    let tooltip = null;
    if ([...d3.select('.d3-tooltip')].length > 0) {
        tooltip = d3.select('.d3-tooltip');
    } else {
        tooltip = d3.select('#root').append('div').attr('class', 'd3-tooltip');
    }
    Object.keys(tooltipOptions).forEach((key) => tooltip.style(key, tooltipOptions[key]));

    return tooltip;
};

/**
 *  Generating Axis
 *
 *  @param {SVGGElement} graph svg <g> element - required
 *  @param {boolean} draw if true, will draw grid lines - required
 *  @param {string} type band | linear | ordinal - required
 *  @param {string} [axisType=''] x | y - optional
 *  @param {number[] | string[]} domain [min, max] or string[] - required
 *  @param {number[]} range [min, max] - required
 *  @param {object} options tick options (ticks, tickSize, tickPadding, tickFormat ... ) - optional
 *  @param {object} gridLineOptions tick options (graphWidth, graphHeight...) - optional
 *  @returns {object} returns scale and axis
 */
export const createAxis = ({ graph, draw, type, axisType = '', domain, range, options, gridLineOptions }) => {
    const axisG = graph.append('g');
    let scale = null;
    let axis = null;

    if (type === 'band') {
        scale = createBandScale({ domain, range, options });
        axis = createBandXAxis({ scale, options });

        if (draw) {
            drawBandXGridLines({ axisG, axis, scale, gridLineOptions });
        }
    } else if (type === 'linear') {
        scale = createLinearScale({ domain, range });

        if (axisType === 'x') {
            axis = createXAxis({ scale, options });
        } else {
            axis = createYAxis({ scale });
        }

        if (draw) {
            if (axisType === 'y') {
                drawYGridLines({ axisG, axis, gridLineOptions });
            } else {
                drawXGridLines({ axisG, axis, gridLineOptions });
            }
        }
    } else if (type === 'ordinal') {
        scale = createOrdinalScale({ domain, range });
    }

    return { scale, axis };
};

/**
 *  Dynamically appending attr() to graph
 *
 *  @param {SVGGElement} graph svg <g> element - required
 *  @param {object} options attr options (width, height, stroke ...) - optional
 */
export function appendAttr({ graph, options }) {
    Object.keys(options).forEach((key) => graph.attr(key, options[key]));
}
