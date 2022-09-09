import * as d3 from 'd3';

// See : https://observablehq.com/@jurestabuc/animated-line-chart
function lineTransition(path) {
    path.transition()
        .duration(3000)
        .attrTween('stroke-dasharray', function () {
            const length = this.getTotalLength();
            const interploate = d3.interpolateString('0,' + length, length + ',' + length);
            return function (t) {
                return interploate(t);
            };
        })
        .on('end', () => d3.select(this).call(lineTransition));
}

export const createLine = ({ graph, d }) => {
    graph
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'rgba(54, 162, 235, 0.2)')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('marker-start', 'url(#dot)')
        .attr('marker-mid', 'url(#dot)')
        .attr('marker-end', 'url(#dot)')
        .attr('d', d)
        .call(lineTransition);
};

export const createLines = ({ graph, data, x, y, d, fill, onMouseOver, onMouseMove, onMouseLeave }) => {
    graph
        .selectAll()
        .data(data)
        .join('path')
        .attr('d', d)
        .attr('stroke', fill)
        .style('stroke-width', 4)
        .style('fill', 'none')
        .call(lineTransition);

    // Point 추가가 추가될 group을 category별로 생성
    const dotG = graph.selectAll().data(data).join('g').style('fill', fill);

    // 생성한 group마다 circle 그려주기
    dotG.selectAll()
        .data((d) => d.values)
        .join('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('stroke', 'white')
        .on('mouseover', onMouseOver)
        .on('mousemove', onMouseMove)
        .on('mouseleave', onMouseLeave);
};
