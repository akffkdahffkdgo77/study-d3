import * as d3 from 'd3';

export const createBandScale = ({ domain, range, options }) => {
    return d3
        .scaleBand()
        .domain(domain)
        .range(range)
        .paddingOuter(options.padding / 2)
        .paddingInner(options.padding);
};

/**
 *  https://observablehq.com/@d3/d3-scalelinear#cell-174
 *  Y축의 값들이 그래프의 끝에 너무 가깝지 않도록 마진을 추가
 *  scale.nice() -> 축의 값이 2,5,10의 배수로 나오도록 해줌
 */
export const createLinearScale = ({ domain, range }) => {
    return d3.scaleLinear().domain(domain).nice().range(range);
};

export const createOrdinalScale = ({ domain, range }) => {
    return d3.scaleOrdinal().domain(domain).range(range);
};
