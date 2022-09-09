import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { animateBar, createGroupedBar } from '../utils/draw';
import { createAxis, createCanvas, createToolTip } from '../../utils/settings';
import { tooltipMouseLeave, tooltipMouseMove, tooltipMouseOver } from '../../utils/tooltip';

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */

export default function Component({ data, options }) {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // Default 설정
        const { xLabels, category, datasets } = data;
        const currentWidth = barChart.current.clientWidth;
        const graphWidth = currentWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // Canvas + Graph 설정
        const graph = createCanvas({
            canvas: barChart.current,
            options: {
                width: currentWidth + Math.floor(options.dimensions.margin[3] / 2),
                height: options.dimensions.height,
                margin: options.dimensions.margin
            }
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
            domain: [0, d3.max(datasets.map((d) => d3.max(category.map((category) => d[category]))))],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        const { scale: xSubGroupScale } = createAxis({
            graph,
            type: 'band',
            domain: category,
            range: [0, xScale.bandwidth()],
            draw: false,
            options: { padding: 0.5, tickSize: 0, tickPadding: 0 }
        });

        // Category별 색상 설정하기
        const { scale: color } = createAxis({ graph, type: 'ordinal', domain: category, range: options.colors });

        const tooltip = createToolTip({ tooltipOptions: options.tooltip });

        function mouseOver(_event, d) {
            const category = d3.select(this.parentNode).datum(); // 현재 선택한 데이터의 카테고리명
            tooltipMouseOver({
                tooltip,
                html: ` <div class="d3-tooltip-name">${category.label}</div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: ${color(d.key)}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">${d.key}: </span>${d.value.toLocaleString()}
                        </div>`
            });
        }

        function mouseMove(event, _d) {
            tooltipMouseMove({ tooltip, event });
        }

        function mouseLeave(_event, _d) {
            tooltipMouseLeave({ tooltip });
        }

        // Grouped Bar Graph 그리기
        createGroupedBar({
            graph,
            data: datasets,
            x: (d) => xSubGroupScale(d.key),
            y: yScale(0),
            category,
            options: {
                width: xSubGroupScale.bandwidth(),
                height: graphHeight - yScale(0),
                fill: (d) => color(d.key),
                transform: (d) => `translate(${xScale(d.label)}, 0)`
            },
            mouseOver,
            mouseMove,
            mouseLeave
        });

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
            id="grouped-bar-chart-canvas"
        />
    );
}
