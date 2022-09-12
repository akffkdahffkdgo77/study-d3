import { useEffect, useRef } from 'react';

import * as d3 from 'd3';
import { createAxis, createCanvas, createToolTip } from 'utils/settings';
import { createArea } from 'area/utils/draw';
import { tooltipMouseLeave, tooltipMouseMove, tooltipMouseOver } from 'utils/tooltip';
import { createDots } from 'utils/dot';
import { createLine } from 'utils/line';

/**
 *  References:
 *  https://d3-graph-gallery.com/graph/area_lineDot.html
 */

export default function Component({ data, options }) {
    const areaChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }
        rendered.current = false;

        const { datasets, xLabels } = data;
        const currentWidth = areaChart.current.clientWidth;
        const graphWidth = currentWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        const graph = createCanvas({
            canvas: areaChart.current,
            options: {
                width: currentWidth + Math.floor(options.dimensions.margin[3] / 2),
                height: options.dimensions.height,
                margin: options.dimensions.margin
            }
        });

        // DOMAIN
        const xDomain = [datasets[0].label, datasets[datasets.length - 1].label];
        const yMax = d3.extent(datasets, (d) => d.value);
        const yDomain = [yMax[0], yMax[1] + 100];

        // X Axis
        const { scale: xScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'x',
            domain: xDomain,
            range: [0, graphWidth],
            draw: true,
            options: {
                ticks: datasets.length,
                tickSize: graphHeight,
                tickPadding: 10,
                tickFormat: (d) => xLabels[d]
            },
            gridLineOptions: {
                stroke: 'transparent',
                opacity: 0.1
            }
        });

        // Y Axis
        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: yDomain,
            range: [graphHeight, 0],
            draw: true,
            gridLineOptions: { graphWidth }
        });

        // Tooltip
        const tooltip = createToolTip({ tooltipOptions: options.tooltip });
        function onMouseOver(_event, d) {
            tooltipMouseOver({
                tooltip,
                html: ` <div class="d3-tooltip-name">
                            ${xLabels[d.label]}
                        </div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: ${options.colors}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">방문자:</span>${d.value.toLocaleString()}
                        </div>`
            });
        }

        function onMouseMove(event, _d) {
            tooltipMouseMove({ tooltip, event });
        }

        function onMouseLeave(_event, _d) {
            tooltipMouseLeave({ tooltip });
        }

        createArea({
            graph,
            data: datasets,
            coords: {
                x: (_d, i) => xScale(datasets[i].label),
                y0: graphHeight,
                y1: (_d, i) => yScale(datasets[i].value)
            },
            options: {
                fill: options.colors,
                fillOpacity: 0.3,
                stroke: 'none'
            }
        });

        createLine({
            graph,
            data: datasets,
            coords: {
                x: (_d, i) => xScale(datasets[i].label),
                y: (_d, i) => yScale(datasets[i].value)
            },
            options: {
                fill: 'none',
                stroke: options.colors,
                'stroke-width': 4
            }
        });

        createDots({
            graph,
            data: datasets,
            options: {
                cx: (d) => xScale(d.label),
                cy: (d) => yScale(d.value),
                r: 20,
                fill: 'transparent',
                stroke: 'none'
            },
            onMouseOver,
            onMouseMove,
            onMouseLeave
        });
    }, [data, options]);

    return (
        <div
            id="area-chart"
            style={{
                display: 'flex',
                alitngnItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 4
            }}
            ref={areaChart}
        />
    );
}
