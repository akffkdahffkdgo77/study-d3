import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createLines } from '../utils/draw';
import { createAxis, createCanvas, createToolTip } from '../../utils/settings';

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/connectedscatter_multi.html
 */

export default function Component({ data, options }) {
    const lineChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        // React.18 Strict Mode
        // Prevent Render twice
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // Default 설정
        const { category, datasets } = data;
        const currentWidth = lineChart.current.clientWidth;
        const graphWidth = currentWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // Data 형식 맞추기
        const chartData = category.map((category) => ({
            name: category,
            values: datasets.map((d) => ({ label: d.label, value: d[category] }))
        }));

        // SVG 추가하기
        const graph = createCanvas({
            canvas: lineChart.current,
            options: {
                width: currentWidth + Math.floor(options.dimensions.margin[3] / 2),
                height: options.dimensions.height,
                margin: options.dimensions.margin
            }
        });

        // X축, Y축 설정하기
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

        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: [
                0,
                d3.max(
                    (function () {
                        return category.map((category) => d3.max(datasets, (d) => d[category]));
                    })()
                )
            ],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        const { scale: colors } = createAxis({ graph, type: 'ordinal', domain: category, range: options.colors });

        const tooltip = createToolTip({ tooltipOptions: options.tooltip });
        // See : https://d3-graph-gallery.com/graph/connectedscatter_tooltip.html
        function onMouseOver(_event, d) {
            const category = d3.select(this.parentNode).datum(); // 현재 선택한 데이터의 카테고리명 찾기
            tooltip
                .html(
                    `<div class="d3-tooltip-name">
                        ${category.name}
                    </div>
                    <div class="d3-tooltip-label">
                        <div class="d3-tooltip-color" style="background-color: ${colors(category.name)}">
                            <span></span>
                        </div>
                        <span class="d3-tooltip-value">${d.label}:</span>${d.value.toLocaleString()}
                    </div>`
                )
                .style('opacity', '1');
        }

        function onMouseMove(event, _d) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        }

        function onMouseLeave(_event, _d) {
            tooltip.style('opacity', '0');
        }

        // 라인 그리기
        const line = d3
            .line()
            .x((d) => xScale(d.label))
            .y((d) => yScale(d.value));

        createLines({
            graph,
            data: chartData,
            x: (d) => xScale(d.label),
            y: (d) => yScale(d.value),
            d: (d) => line(d.values),
            fill: (d) => colors(d.name),
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
            ref={lineChart}
            id="multi-line-chart-canvas"
        />
    );
}
