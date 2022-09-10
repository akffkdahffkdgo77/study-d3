import * as d3 from 'd3';
import { appendAttr, lineTransition } from 'utils/line';

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
