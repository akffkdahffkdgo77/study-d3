/* eslint-disable no-sparse-arrays */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createAxis, createCanvas, createToolTip } from '../../utils/settings';

/*
    References :
    https://d3-graph-gallery.com/graph/bubble_tooltip.html
*/

export default function Component({ data, options }) {
    const bubbleChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        // React.18 Strict Mode
        // Prevent Render twice
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        const { datasets } = data;
        const graphWidth =
            bubbleChart.current.clientWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // Canvas + Graph 설정
        const graph = createCanvas({
            canvas: bubbleChart.current,
            width: bubbleChart.current.clientWidth + Math.floor(options.dimensions.margin[3] / 2),
            height: options.dimensions.height,
            margin: options.dimensions.margin
        });

        const { scale: xScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'x',
            domain: d3.extent(datasets, (d) => d.x),
            range: [0, graphWidth],
            draw: true,
            options: { tickSize: graphHeight, tickPadding: 10 }
        });

        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: d3.extent(datasets, (d) => d.y),
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        // Circle Radius 설정하기
        const { scale: zScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: d3.extent(datasets, (d) => d.z),
            range: [1, 25],
            draw: false,
            options: { graphWidth }
        });

        // Bubble Colors
        const { scale: colors } = createAxis({
            graph,
            type: 'ordinal',
            domain: [0, 1, 2, 3, 4, 5, 6, 7],
            range: d3.schemeSet2
        });

        const tooltip = createToolTip({ tooltipOptions: options.tooltip });
        const onMouseOver = function (event, d) {
            const index = datasets.indexOf(d);
            tooltip
                .style('opacity', '1')
                .html(
                    `<div class="d3-tooltip-name">
                        ${d?.x}
                    </div>
                    <div class="d3-tooltip-label">
                        <div class="d3-tooltip-color" style="background-color: ${colors(index)}">
                            <span></span>
                        </div>
                        <span class="d3-tooltip-value">totalCount:</span>${d?.x.toLocaleString()}
                    </div>`
                )
                .style('left', event.x / 2 + 'px')
                .style('top', event.y / 2 + 30 + 'px')
                .transition()
                .duration(200);
        };

        const onMouseMove = function (event, _d) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        };

        const onMouseLeave = function (_event, _d) {
            tooltip.transition().duration(10).style('opacity', '0');
        };

        graph
            .append('g')
            .selectAll()
            .data(datasets)
            .join('circle')
            .attr('class', 'bubbles')
            .attr('cx', (d) => xScale(d.x))
            .attr('cy', (d) => yScale(d.y))
            .attr('r', (d) => zScale(d.z))
            .style('fill', (_d, i) => colors(i))
            .style('opacity', '0.5')
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .on('mouseover', onMouseOver)
            .on('mousemove', onMouseMove)
            .on('mouseleave', onMouseLeave);
    }, [data, options]);

    return (
        <div
            style={{
                display: 'flex',
                alitngnItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 4
            }}
            ref={bubbleChart}
            id="bubble-chart-canvas"
        />
    );
}
