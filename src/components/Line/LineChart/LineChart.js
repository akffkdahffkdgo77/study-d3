import { useEffect, useRef } from 'react';

import * as d3 from 'd3';

import { createDots } from 'utils/dot';
import { createLine } from 'utils/line';
import { createAxis, createCanvas, createToolTip } from 'utils/settings';
import { tooltipMouseLeave, tooltipMouseMove, tooltipMouseOver } from 'utils/tooltip';

/**
 *  References :
 *  https://observablehq.com/@kellytall/day-one-a-line-chart
 *  https://observablehq.com/@d3/line-with-tooltip
 *  https://d3-graph-gallery.com/graph/connectedscatter_tooltip.html
 */

export default function LineChart({ data, options }) {
    const lineChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }
        rendered.current = false;

        // Default 설정
        const { xLabels, yLabels, datasets } = data;
        const currentWidth = lineChart.current.clientWidth;

        const width = currentWidth + Math.floor(options.dimensions.margin[3] / 2);
        const height = options.dimensions.height;
        const graphWidth = currentWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // SVG 추가하기
        const graph = createCanvas({
            canvas: lineChart.current,
            options: { width, height, margin: options.dimensions.margin }
        });

        // X Axis
        const { scale: xScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'x',
            domain: d3.extent(datasets, (_d, i) => i),
            range: [0, graphWidth],
            draw: true,
            options: {
                ticks: datasets.length,
                tickSize: graphHeight,
                tickPadding: 10,
                tickFormat: (_d, i) => datasets[i].label.split('T')[0]
            }
        });

        // Y Axis
        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: d3.extent(yLabels, (d) => d),
            range: [graphHeight, 0],
            draw: true,
            gridLineOptions: { graphWidth }
        });

        // TOOLTIP
        const tooltip = createToolTip({ tooltipOptions: options.tooltip });

        function onMouseOver(_event, d) {
            const i = datasets.indexOf(d);
            tooltipMouseOver({
                tooltip,
                html: ` <div class="d3-tooltip-name">
                            ${xLabels[i]}
                        </div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: rgba(54, 162, 235, 1)">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">${xLabels[i]}:</span>${d.value.toLocaleString()}
                        </div>`
            });
        }

        function onMouseMove(event, _d) {
            tooltipMouseMove({ tooltip, event });
        }

        function onMouseLeave(_event, _d) {
            tooltipMouseLeave({ tooltip });
        }

        // LINE
        createLine({
            graph,
            data: datasets,
            coords: {
                x: (_d, i) => xScale(i),
                y: (d) => yScale(d.value)
            },
            options: {
                fill: 'none',
                stroke: 'rgba(54, 162, 235, 0.2)',
                'stroke-width': 3
            }
        });

        // CIRCLE
        createDots({
            graph,
            data: datasets,
            options: {
                cx: (_d, i) => xScale(i),
                cy: (d) => yScale(d.value),
                r: 5,
                fill: 'rgba(54, 162, 235, 0.5)',
                stroke: 'white'
            },
            onMouseOver,
            onMouseMove,
            onMouseLeave
        });
    }, [data, options]);

    return <div ref={lineChart} className="w-full" />;
}
