import * as d3 from 'd3';
import { createBandXAxis, createXAxis, createYAxis } from './axis';
import { createBandScale, createLinearScale, createOrdinalScale } from './scale';
import { drawBandXGridLines, drawXGridLines, drawYGridLines } from './gridLines';

/**
 * SVG 생성
 * @param {HTMLElement} canvas HTML element
 * @param {object} options width, height, margin, transform
 * @returns {SVGGElement} returns svg <g> element
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
        .attr('transform', transform || `translate(${ml}, ${mt})`);

    return graph;
};

/**
 * TOOLTIP 설정
 * @param {object} tooltipOptions tooltip styling options
 * @returns {HTMLDivElement} returns div element
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
 * AXIS 생성
 * @param {SVGGElement} graph svg <g> element
 * @param {boolean} draw if true, will draw grid lines
 * @param {string} type band | linear | ordinal
 * @param {string} [axisType=''] x | y
 * @param {number[] | string[]} domain [min, max] or string[]
 * @param {number[]} range [min, max]
 * @param {object} options styling options (graphWidth, graphHeight, tickSize, tickFormat...)
 * @returns {object} returns scale and axis
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
                drawYGridLines({ axisG, axis, options, gridLineOptions });
            } else {
                drawXGridLines({ axisG, axis, options, gridLineOptions });
            }
        }
    } else if (type === 'ordinal') {
        scale = createOrdinalScale({ domain, range });
    }

    return { scale, axis };
};
