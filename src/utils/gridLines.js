/**
 *  Drawing Axis on graph
 *
 *  Recommended for Bar Graph
 *
 *  @param {SVGGElement} axisG SVG Group Element - required
 *  @param {d3.Axis} axis  axis - required
 *  @param {d3.ScaleBand} scale - d3.ScaleBand
 */
 export const drawBandXGridLines = ({ axisG, axis, scale }) => {
    axisG
        .call(axis)
        .call((g) => g.select('.domain').attr('stroke', 'transparent'))
        .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
        .call((g) =>
            g
                .selectAll('.tick line')
                .attr('transform', `translate(${scale.bandwidth() - (scale.step() - scale.bandwidth())}, 0)`)
        );
};

/**
 *  Drawing Axis on graph
 *
 *  Recommended for Linear Graph
 *  @param {*} axisG SVG Group Element - required
 *  @param {*} axis axis - required
 *  @param {options} gridLineOptions styling options - required
 */
export const drawXGridLines = ({ axisG, axis, gridLineOptions }) => {
    axisG
        .call(axis)
        .call((g) => g.select('.domain').attr('stroke', gridLineOptions?.stroke || '#eeeeee'))
        .call((g) => g.selectAll('.tick').attr('stroke-opacity', gridLineOptions?.opacity || 0.1));
};

/**
 *  Drawing Axis on graph
 *
 *  Recommended for Linear Graph
 *  @param {SVGGElement} axisG SVG Group Element - required
 *  @param {d3.Axis} axis  axis - required
 *  @param {options} gridLineOptions styling options - required
 */
export const drawYGridLines = ({ axisG, axis, gridLineOptions }) => {
    axisG
        .call(axis)
        .call((g) => g.select('.domain').attr('stroke', gridLineOptions?.stroke || '#eeeeee'))
        .call((g) => g.selectAll('.tick').attr('stroke-opacity', gridLineOptions?.opacity || 0.1))
        .call((g) =>
            g.selectAll('.tick line').clone().attr('x2', gridLineOptions.graphWidth).attr('stroke-opacity', 0.1)
        );
};
