import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createAxis, createCanvas, createToolTip } from 'utils/settings';
import { tooltipMouseLeave, tooltipMouseMove, tooltipMouseOver } from 'utils/tooltip';
import { createDots } from 'utils/dot';

/*
    References :
    https://d3-graph-gallery.com/graph/bubble_tooltip.html
*/

export default function Component({ data, options }) {
    const bubbleChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }
        rendered.current = false;

        // Default 설정
        const { datasets } = data;
        const currentWidth = bubbleChart.current.clientWidth;

        const width = currentWidth + Math.floor(options.dimensions.margin[3] / 2);
        const height = options.dimensions.height;
        const graphWidth = currentWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // SVG 추가하기
        const graph = createCanvas({
            canvas: bubbleChart.current,
            options: { width, height, margin: options.dimensions.margin }
        });

        // X Axis
        const { scale: xScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'x',
            domain: d3.extent(datasets, (d) => d.x),
            range: [0, graphWidth],
            draw: true,
            options: { tickSize: graphHeight, tickPadding: 10 }
        });

        // Y Axis
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
            axisType: '',
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

        // TOOLTIP
        const tooltip = createToolTip({ tooltipOptions: options.tooltip });

        function onMouseOver(_event, d) {
            const index = datasets.indexOf(d);
            tooltipMouseOver({
                tooltip,
                html: ` <div class="d3-tooltip-name">
                            ${d?.x}
                        </div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: ${colors(index)}">
                            <span></span>
                        </div>
                            <span class="d3-tooltip-value">totalCount:</span>${d?.x.toLocaleString()}
                        </div>`
            });
        }

        function onMouseMove(event, _d) {
            tooltipMouseMove({ tooltip, event });
        }

        function onMouseLeave(_event, _d) {
            tooltipMouseLeave({ tooltip });
        }

        const sorted = datasets.sort((x, y) => d3.descending(x.z, y.z));

        createDots({
            graph,
            data: sorted,
            options: {
                class: 'bubbles',
                cx: (d) => xScale(d.x),
                cy: (d) => yScale(d.y),
                r: (d) => zScale(d.z),
                fill: (_d, i) => colors(i),
                opacity: 0.5,
                stroke: 'white',
                'stroke-width': 2
            },
            onMouseOver,
            onMouseMove,
            onMouseLeave
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
            ref={bubbleChart}
            id="bubble-chart-canvas"
        />
    );
}
