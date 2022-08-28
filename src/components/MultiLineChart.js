import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createAxis, createCanvas, createLines } from '../utils';

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/connectedscatter_multi.html
 */

export default function MultiLineChart({ data, options }) {
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
        const graphWidth = lineChart.current.clientWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // Data 형식 맞추기
        const chartData = category.map((category) => ({
            name: category,
            values: datasets.map((d) => ({ label: d.label, value: d[category] }))
        }));

        // SVG 추가하기
        const { graph, tooltip } = createCanvas({
            canvas: lineChart.current,
            width: lineChart.current.clientWidth + Math.floor(options.dimensions.margin[3] / 2),
            height: options.dimensions.height,
            margin: options.dimensions.margin,
            tooltipOptions: options.tooltip
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
                        return category.map((category) => {
                            console.log(d3.max(datasets, (d) => d[category]));
                            return d3.max(datasets, (d) => d[category]);
                        });
                    })()
                )
            ],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        const { scale: colors } = createAxis({ graph, type: 'color', domain: category, range: options.colors });

        // See : https://d3-graph-gallery.com/graph/connectedscatter_tooltip.html
        function onMouseOver(_event, d) {
            const category = d3.select(this.parentNode).datum(); // 현재 선택한 데이터의 카테고리명 찾기
            tooltip
                .html(
                    `<div class="d3-tooltip-name">
                    ${category.name}
                </div>
                <br/>
                <div class="d3-tooltip-label">
                    <div class="d3-tooltip-color-${category.name}">
                        <span></span>
                    </div>
                    <span class="d3-tooltip-name">${d.label}:</span>${d.value.toLocaleString()}
                </div>`
                )
                .style('visibility', 'visible');
        }

        function onMouseMove(event, _d) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        }

        function onMouseLeave(_event, _d) {
            tooltip.style('visibility', 'hidden');
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
