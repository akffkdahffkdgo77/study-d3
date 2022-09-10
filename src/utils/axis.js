import * as d3 from 'd3';

/**
 *  @param {d3.AxisScale} scale The scale to be used for axis generation.
 *  @param {object} options Tick options (tickSize, tickPadding ...)
 *  @returns {d3.Axis} returns x axis for d3.scaleBand()
 */
export const createBandXAxis = ({ scale, options }) => {
    return d3
        .axisBottom(scale)
        .tickSize(options.tickSize + 6)
        .tickPadding(options.tickPadding);
};

/**
 *  @param {d3.AxisScale} scale The scale to be used for axis generation.
 *  @param {object} options Tick options (tickSize, tickPadding ...)
 *  @returns {d3.Axis} returns x axis for d3.linearScale()
 */
export const createXAxis = ({ scale, options }) => {
    return d3
        .axisBottom(scale)
        .ticks(options.ticks)
        .tickSize(options.tickSize + 6)
        .tickFormat(options.tickFormat || null)
        .tickPadding(options.tickPadding);
};

/**
 *
 * @param {d3.AxisScale} scale The scale to be used for axis generation.
 * @returns {d3.Axis} returns y axis for d3.linearScale()
 */
export const createYAxis = ({ scale }) => {
    return d3.axisLeft(scale);
};
