import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { animateBar, createBar } from 'bar/utils/draw';
import { createAxis, createCanvas, createToolTip } from 'utils/settings';
import { tooltipMouseLeave, tooltipMouseMove, tooltipMouseOver } from 'utils/tooltip';

export default function Component({ data, options }) {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // Default 설정
        const { xLabels, datasets } = data;
        const currentWidth = barChart.current.clientWidth;

        const width = currentWidth + Math.floor(options.dimensions.margin[3] / 2);
        const height = options.dimensions.height;
        const graphWidth = currentWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // SVG 추가하기
        const graph = createCanvas({
            canvas: barChart.current,
            options: { width, height, margin: options.dimensions.margin }
        });

        // X Axis
        const { scale: xScale } = createAxis({
            graph,
            type: 'band',
            domain: xLabels,
            range: [0, graphWidth],
            draw: true,
            options: {
                padding: 0.25,
                tickSize: graphHeight,
                tickPadding: 10
            }
        });

        // Y Axis
        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: [0, d3.extent(datasets, (d) => d.value)[1]],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        // TOOLTIP
        const tooltip = createToolTip({ tooltipOptions: options.tooltip });

        function mouseOver(_event, d) {
            tooltipMouseOver({
                tooltip,
                html: ` <div class="d3-tooltip-name">
                            ${d.label}
                        </div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: ${options.colors}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">totalCount:</span>${d.value.toLocaleString()}
                        </div>`
            });
            d3.select(this).transition().attr('fill', 'rgba(54, 162, 235, 0.5)');
        }

        function mouseMove(event) {
            tooltipMouseMove({ tooltip, event });
        }

        function mouseLeave() {
            tooltipMouseLeave({ tooltip });
            d3.select(this).transition().attr('fill', options.colors);
        }

        createBar({
            graph,
            data: datasets,
            coords: {
                x: (d) => xScale(d.label),
                y: yScale(0)
            },
            options: {
                width: xScale.bandwidth(),
                height: graphHeight - yScale(0),
                fill: options.colors
            },
            mouseOver,
            mouseMove,
            mouseLeave
        });

        animateBar({
            graph: barChart.current,
            options: {
                y: (d) => yScale(d.value),
                height: (d) => graphHeight - yScale(d.value)
            }
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
