/**
 *  Tooltip Interaction
 *
 *  @param {HTMLDivElement} tooltip div element - required
 *  @param {string} html template literals - required
 */
export const tooltipMouseOver = ({ tooltip, html }) => {
    tooltip.html(html).style('opacity', '1').transition().duration(200);
};

/**
 *  Tooltip Interaction
 *
 *  @param {HTMLDivElement} tooltip div element - required
 *  @param {MouseEvent} event mouse event - required
 */
export const tooltipMouseMove = ({ tooltip, event }) => {
    tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
};

/**
 *  Tooltip Interaction
 *
 *  @param {HTMLDivElement} tooltip div element - required
 */
export const tooltipMouseLeave = ({ tooltip }) => {
    tooltip.html(``).style('opacity', '0').transition().duration(200);
};
