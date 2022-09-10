export const tooltipMouseOver = ({ tooltip, html }) => {
    tooltip.html(html).style('opacity', '1').transition().duration(200);
};

export const tooltipMouseMove = ({ tooltip, event }) => {
    tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
};

export const tooltipMouseLeave = ({ tooltip }) => {
    tooltip.html(``).style('opacity', '0').transition().duration(200);
};
