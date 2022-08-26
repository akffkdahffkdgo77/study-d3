import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { animateBar, createAxis, createCanvas, createStackedBar } from '../utils';

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */
export default function StackedBarChart({ data, options }) {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        const { xLabels, yLabels, category, datasets } = data;
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
            options: {
                padding: 0.25,
                tickSize: graphHeight,
                tickPadding: 10
            }
        });
        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: [0, yLabels[1]],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        // Sub Group별 색상 설정하기
        const { scale: color } = createAxis({
            graph,
            type: 'color',
            domain: category,
            range: options.colors
        });

        // Sub Group별로 stack을 만듬
        const stackedData = d3.stack().keys(category)(datasets);

        // Stacked Bar Graph 그리기
        createStackedBar({
            graph,
            data: stackedData,
            x: (d) => xScale(d.data.krName),
            y: yScale(0),
            color: (d) => color(d.key),
            options: { width: xScale.bandwidth(), height: graphHeight - yScale(0) },
            mouseOver,
            mouseMove,
            mouseLeave
        });

        function mouseOver(_event, d) {
            const categoryName = d3.select(this.parentNode).datum().key; // 현재 선택한 데이터의 서브 그룹명
            const categoryValue = d.data[categoryName]; // 데이터 값
            tooltip
                .html(
                    `<div class="d3-tooltip-name">${d.data.krName}</div>
                        <br/>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color-${categoryName}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-name">${categoryName}: </span>${categoryValue.toLocaleString()}
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
            y: (d) => yScale(d[1]),
            height: (d) => yScale(d[0]) - yScale(d[1])
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
            id="stacked-bar-chart-canvas"
        />
    );
}
