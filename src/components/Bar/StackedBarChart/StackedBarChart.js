import { useEffect, useRef } from 'react';

import * as d3 from 'd3';

import { createAxis, createCanvas, createToolTip } from 'utils/settings';
import { tooltipMouseLeave, tooltipMouseMove, tooltipMouseOver } from 'utils/tooltip';

import { animateBar, createStackedBar } from '../draw';

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */

export default function StackedBarChart({ data, options }) {
    const stackedBarChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // Default 설정
        const { xLabels, category, datasets } = data;
        const currentWidth = stackedBarChart.current.clientWidth;
        const graphWidth = currentWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // SVG 추가하기
        const graph = createCanvas({
            canvas: stackedBarChart.current,
            options: {
                width: currentWidth + Math.floor(options.dimensions.margin[3] / 2),
                height: options.dimensions.height,
                margin: options.dimensions.margin
            }
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
            gridLineOptions: { graphWidth }
        });

        // Category별 색상 설정하기
        const { scale: color } = createAxis({ graph, type: 'ordinal', domain: category, range: options.colors });

        // TOOLTIP
        const tooltip = createToolTip({ tooltipOptions: options.tooltip });

        function mouseOver(_event, d) {
            const categoryName = d3.select(this.parentNode).datum().key; // 현재 선택한 데이터의 서브 그룹명
            const categoryValue = d.data[categoryName]; // 데이터 값
            tooltipMouseOver({
                tooltip,
                html: ` <div class="d3-tooltip-name">${d.data.label}</div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: ${color(categoryName)}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">${categoryName}: </span>${categoryValue.toLocaleString()}
                        </div>`
            });
            d3.select(this).attr('opacity', 1).attr('stroke', 'none').transition().duration(200);
        }

        function mouseMove(event, _d) {
            tooltipMouseMove({ tooltip, event });
        }

        function mouseLeave(_event, _d) {
            tooltipMouseLeave({ tooltip });
            d3.select(this).attr('opacity', 1).attr('stroke', 'none').transition().duration(200);
        }

        // Category별로 stack을 만듬
        const stackedData = d3.stack().keys(category)(datasets);

        createStackedBar({
            graph,
            data: stackedData,
            coords: {
                x: (d) => xScale(d.data.label),
                y: yScale(0)
            },
            options: {
                color: (d) => color(d.key),
                width: xScale.bandwidth(),
                height: graphHeight - yScale(0)
            },
            mouseOver,
            mouseMove,
            mouseLeave
        });

        animateBar({
            graph: stackedBarChart.current,
            options: {
                y: (d) => yScale(d[1]),
                height: (d) => yScale(d[0]) - yScale(d[1])
            }
        });
    }, [data, options]);

    return <div ref={stackedBarChart} className="w-full" />;
}
