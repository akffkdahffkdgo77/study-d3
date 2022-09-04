import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { animateBar, createAxis, createBar, createCanvas } from '../utils';

export default function BarChart({ data, options }) {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // Default 설정
        const { xLabels, datasets } = data;
        const graphWidth = barChart.current.clientWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // Canvas + Graph 설정
        const { graph, tooltip } = createCanvas({
            canvas: barChart.current,
            width: barChart.current.clientWidth + Math.floor(options.dimensions.margin[3] / 2),
            height: options.dimensions.height,
            margin: options.dimensions.margin,
            tooltipOptions: options.tooltip
        });

        // X축, Y축 설정하기
        const { scale: xScale } = createAxis({
            graph,
            type: 'band',
            domain: xLabels,
            range: [0, graphWidth],
            draw: true,
            options: { padding: 0.25, tickSize: graphHeight, tickPadding: 10 }
        });

        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: [0, d3.extent(datasets, (d) => d.value)[1]],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        createBar({
            graph,
            data: datasets,
            x: (d) => xScale(d.label),
            y: yScale(0),
            color: options.colors,
            options: { width: xScale.bandwidth(), height: graphHeight - yScale(0) },
            mouseOver,
            mouseMove,
            mouseLeave
        });

        function mouseOver(_e, data) {
            tooltip
                .html(
                    `<div class="d3-tooltip-name">
                        ${data.label}
                    </div>
                    <div class="d3-tooltip-label">
                        <div class="d3-tooltip-color" style="background-color: ${options.colors}">
                            <span></span>
                        </div>
                        <span class="d3-tooltip-value">totalCount:</span>${data.value.toLocaleString()}
                    </div>`
                )
                .style('visibility', 'visible');
            d3.select(this).transition().attr('fill', 'rgba(54, 162, 235, 0.5)');
        }

        function mouseMove(event) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        }

        function mouseLeave() {
            tooltip.html(``).style('visibility', 'hidden');
            d3.select(this).transition().attr('fill', options.colors);
        }

        animateBar({
            graph: barChart.current,
            y: (d) => yScale(d.value),
            height: (d) => graphHeight - yScale(d.value)
        });
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
            ref={barChart}
            id="bar-chart-canvas"
        />
    );
}
