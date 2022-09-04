import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { animateBar, createAxis, createCanvas, createGroupedBar } from '../utils';

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */
export default function GroupBarChart({ data, options }) {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // Default 설정
        const { xLabels, category, datasets } = data;
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
            domain: [
                0,
                d3.extent(datasets, function (d) {
                    let total = 0;
                    category.forEach((category) => (total += d[category]));
                    return total;
                })[1]
            ],
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
        const { scale: color } = createAxis({ graph, type: 'color', domain: category, range: options.colors });

        // Grouped Bar Graph 그리기
        createGroupedBar({
            graph,
            data: datasets,
            x: xScale,
            xSubGroup: (d) => xSubGroupScale(d.key),
            y: yScale(0),
            category,
            color: (d) => color(d.key),
            options: { width: xSubGroupScale.bandwidth(), height: graphHeight - yScale(0) },
            mouseOver,
            mouseMove,
            mouseLeave
        });

        function mouseOver(_event, d) {
            const category = d3.select(this.parentNode).datum(); // 현재 선택한 데이터의 카테고리명
            tooltip
                .html(
                    `<div class="d3-tooltip-name">${category.label}</div>
                    <div class="d3-tooltip-label">
                        <div class="d3-tooltip-color" style="background-color: ${color(d.key)}">
                            <span></span>
                        </div>
                        <span class="d3-tooltip-value">${d.key}: </span>${d.value.toLocaleString()}
                    </div>`
                )
                .style('visibility', 'visible');
        }

        function mouseMove(event, _d) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        }

        function mouseLeave(_event, _d) {
            tooltip.html(``).style('visibility', 'hidden');
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
            id="grouped-bar-chart-canvas"
        />
    );
}
