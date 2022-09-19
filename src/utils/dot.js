/**
 *  Generating circles
 *
 *  These circles will be used to show tooltip. Therefore, need to pass mouse event listeners as well.
 *  If want only the tooltip, set the fill and stroke attributes of circle to 'none'.
 *  @param {SVGGElement} graph svg <g> element - required
 *  @param {Array} data datasets - required
 *  @param {object} options attr options (width, height ...) - optional
 *  @param {func} onMouseOver Mouse Over Interaction - required
 *  @param {func} onMouseMove Mouse Move Interaction - required
 *  @param {func} onMouseLeave Mouse Leave Interaction - required
 */
export const createDots = ({ graph, data, options, onMouseOver, onMouseMove, onMouseLeave }) => {
    const dotG = graph.append('g').selectAll().data(data).join('circle');

    Object.keys(options).forEach((key) => dotG.attr(key, options[key]));

    dotG.on('mouseover', onMouseOver).on('mousemove', onMouseMove).on('mouseleave', onMouseLeave);
};
