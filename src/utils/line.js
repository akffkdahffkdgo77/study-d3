import * as d3 from 'd3';
import { appendAttr } from 'utils/settings';

/**
 *  References :
 *  https://observablehq.com/@jurestabuc/animated-line-chart
 */
export function lineTransition(path) {
    path.transition()
        .duration(3000)
        .attrTween('stroke-dasharray', function () {
            const length = this.getTotalLength();
            const interploate = d3.interpolateString('0,' + length, length + ',' + length);
            return function (t) {
                return interploate(t);
            };
        })
        .on('end', () => d3.select(this).call(lineTransition));
}

/**
 *  Line 그리기
 *  @param {SVGGElement} graph SVG Element
 *  @param {Array} data datasets
 *  @param {object} coords x, y
 *  @param {object} options attr options (width, height, stroke ...)
 */
export const createLine = ({ graph, data, coords, options }) => {
    const line = d3.line().curve(d3.curveCardinal).x(coords.x).y(coords.y);
    const lineG = graph.append('path').datum(data).attr('d', line).call(lineTransition);
    appendAttr({ graph: lineG, options });
};
