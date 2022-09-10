export const createDots = ({ graph, data, options, onMouseOver, onMouseMove, onMouseLeave }) => {
    const dotG = graph.append('g').selectAll().data(data).join('circle');

    Object.keys(options).forEach((key) => dotG.attr(key, options[key]));

    dotG.on('mouseover', onMouseOver).on('mousemove', onMouseMove).on('mouseleave', onMouseLeave);
};
