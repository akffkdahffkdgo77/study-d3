import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createAxis, createLine, createLineCanvas, createLineGraph, createLineTooltip } from '../utils';

/**
 *  References :
 *  https://observablehq.com/@kellytall/day-one-a-line-chart
 *  https://observablehq.com/@d3/line-with-tooltip
 */

export default function LineChart({ data, options }) {
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
        const { xLabels, yLabels, datasets } = data;
        const width = lineChart.current.clientWidth + Math.floor(options.dimensions.margin[3] / 2);
        const height = options.dimensions.height;
        const graphWidth = lineChart.current.clientWidth - options.dimensions.margin[1] - options.dimensions.margin[3];
        const graphHeight = options.dimensions.height - options.dimensions.margin[0] - options.dimensions.margin[2];

        // 사용할 데이터
        const xData = xLabels;
        const yData = yLabels;
        const singleData = d3.map(datasets, (d) => d);
        const indexData = d3.map(datasets, (_, i) => i);

        const svg = createLineCanvas({ canvas: lineChart.current, width, height });
        const graph = createLineGraph({ svg, width, height, margin: options.dimensions.margin });

        // X축, Y축 설정하기
        const { scale: xScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'x',
            domain: d3.extent(indexData, (d) => d), // 실제 Date 형식의 데이터가 아닌 0,1,2,.. 정수로 이루어진 데이터를 넘겨주기
            range: [0, graphWidth],
            draw: true,
            options: {
                ticks: datasets.length,
                tickSize: graphHeight,
                tickPadding: 10,
                tickFormat: (_d, i) => datasets[i].label.split('T')[0]
            }
        });
        const { scale: yScale } = createAxis({
            graph,
            type: 'linear',
            axisType: 'y',
            domain: d3.extent(yData, (d) => d),
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        createLineTooltip({
            svg,
            yData,
            singleData,
            indexData,
            x: xScale,
            y: yScale,
            total: datasets.length,
            toolTipText: (i) => `${xData[i]}\n${yData[i].toLocaleString()}` // 툴팁에 표시될 데이터 형식 설정하기
        });

        // 라인 그리기
        const line = d3
            .line()
            .defined((d) => !isNaN(d.value))
            .x((_d, i) => xScale(i))
            .y((d) => yScale(d.value));

        createLine({ graph, d: line(datasets) });
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
            id="line-chart-canvas"
        />
    );
}
