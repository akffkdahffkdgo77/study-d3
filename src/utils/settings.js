/* eslint-disable no-sparse-arrays */
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

export function createLineCanvas({ canvas, width, height }) {
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

    const graph = svg
        .append('g')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
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
