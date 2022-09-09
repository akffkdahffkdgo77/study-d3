export const drawXGridLines = ({ axisG, axis, gridLineOptions }) => {
    axisG
        .call(axis)
        .call((g) => g.select('.domain').attr('stroke', gridLineOptions?.stroke || '#eeeeee'))
        .call((g) => g.selectAll('.tick').attr('stroke-opacity', gridLineOptions?.opacity || 0.1));
};

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

export const drawYGridLines = ({ axisG, axis, options }) => {
    axisG
        .call(axis)
        .call((g) => g.select('.domain').attr('stroke', '#eeeeee'))
        .call((g) => g.selectAll('.tick').attr('stroke-opacity', 0.1))
        .call((g) => g.selectAll('.tick line').clone().attr('x2', options.graphWidth).attr('stroke-opacity', 0.1));
};
