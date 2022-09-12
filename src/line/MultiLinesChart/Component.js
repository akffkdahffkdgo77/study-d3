import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createLines } from 'line/utils/draw';
import { createAxis, createCanvas, createToolTip } from 'utils/settings';
import { createDots } from 'utils/dot';
import { tooltipMouseLeave, tooltipMouseMove, tooltipMouseOver } from 'utils/tooltip';

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/connectedscatter_multi.html
 *  https://d3-graph-gallery.com/graph/connectedscatter_tooltip.html
 */

export default function Component({ data, options }) {
    const multiLineChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }
        rendered.current = false;

        // Default 설정
        const { category, datasets } = data;
        const currentWidth = multiLineChart.current.clientWidth;
        const graphWidth = currentWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // Data 형식 맞추기
        const chartData = category.map((category) => ({
            name: category,
            values: datasets.map((d) => ({ label: d.label, value: d[category] }))
        }));

        // SVG 추가하기
        const graph = createCanvas({
            canvas: multiLineChart.current,
            options: {
                width: currentWidth + Math.floor(options.dimensions.margin[3] / 2),
                height: options.dimensions.height,
                margin: options.dimensions.margin
            }
        });

        // X Axis
        const { scale: xScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'x',
            domain: d3.extent(datasets, (d) => d.label),
            range: [0, graphWidth],
            draw: true,
            options: {
                ticks: datasets.length,
                tickSize: graphHeight,
                tickPadding: 10
            }
        });

        // Y Axis
        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: [0, d3.max(category.map((category) => d3.max(datasets, (d) => d[category])))],
            range: [graphHeight, 0],
            draw: true,
            gridLineOptions: { graphWidth }
        });

        // Colors
        const { scale: colors } = createAxis({ graph, type: 'ordinal', domain: category, range: options.colors });

        // TOOLTIP
        const tooltip = createToolTip({ tooltipOptions: options.tooltip });

        function onMouseOver(_event, d) {
            const category = d3.select(this.parentNode).datum(); // 현재 선택한 데이터의 카테고리명 찾기
            tooltipMouseOver({
                tooltip,
                html: ` <div class="d3-tooltip-name">
                            ${category.name}
                        </div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: ${colors(category.name)}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">${d.label}:</span>${d.value.toLocaleString()}
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
        createLines({
            graph,
            data: chartData,
            coords: {
                x: (d) => xScale(d.label),
                y: (d) => yScale(d.value)
            },
            options: {
                fill: 'none',
                stroke: (d) => colors(d.name),
                'stroke-width': 4
            }
        });

        // Point 추가가 추가될 group을 category별로 생성
        const dotG = graph
            .selectAll()
            .data(chartData)
            .join('g')
            .style('fill', (d) => colors(d.name));

        // CIRCLE
        createDots({
            graph: dotG,
            data: (d) => d.values,
            options: {
                cx: (d) => xScale(d.label),
                cy: (d) => yScale(d.value),
                r: 5,
                stroke: 'white'
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
            ref={multiLineChart}
            id="multi-line-chart-canvas"
        />
    );
}
