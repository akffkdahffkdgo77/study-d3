import * as d3 from 'd3';

/**
 *  Generating Band Scale
 *
 *  @param {string[]} domain axis labels - required
 *  @param {number[]} range min, max values - required
 *  @param {object} options (padding) - required
 *  @returns {d3.ScaleBand}
 */
export const createBandScale = ({ domain, range, options }) => {
    return d3
        .scaleBand()
        .domain(domain)
        .range(range)
        .paddingOuter(options.padding / 2)
        .paddingInner(options.padding);
};

/**
 *  References :
 *  https://observablehq.com/@d3/d3-scalelinear#cell-174
 *  Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
 *  scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌
 */

/**
 *  Generating Linear Scale
 *
 *  @param {number[]} domain axis labels - required
 *  @param {number[]} range min, max values - required
 *  @returns {d3.ScaleLinear}
 */
export const createLinearScale = ({ domain, range }) => {
    return d3.scaleLinear().domain(domain).nice().range(range);
};

/**
 *  Generating Ordinal Scale
 * 
 *  Recommended for generating color scale.
    @param {number[]} domain optional
 *  @param {number[]} range min, max values - required
 *  @returns {d3.ScaleOrdinal}
 */
export const createOrdinalScale = ({ domain, range }) => {
    return d3
        .scaleOrdinal()
        .domain(domain || [])
        .range(range);
};
