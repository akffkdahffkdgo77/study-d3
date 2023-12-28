import * as d3 from 'd3';
import { lineTransition } from 'utils/line';
import { appendAttr } from 'utils/settings';

/**
 *  Multi Line 그리기
 *  @param {SVGGElement} graph SVG Element
 *  @param {Array} data datasets
 *  @param {object} coords x, y
 *  @param {object} options attr options (width, height, stroke ...)
 */
export const createLines = ({ graph, data, coords, options }) => {
    const line = d3.line().curve(d3.curveCardinal).x(coords.x).y(coords.y);
    const lineG = graph
        .selectAll()
        .data(data)
        .join('path')
        .attr('d', (d) => line(d.values))
        .call(lineTransition);
    appendAttr({ graph: lineG, options });
};
