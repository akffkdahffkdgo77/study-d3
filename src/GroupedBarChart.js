import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { animateBar, createAxis, createCanvas, createGroupedBar } from './utils';

const width = 1200;
const height = 800;
const [mt, mr, mb, ml] = [50, 0, 50, 100];

const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const colors = ['#FFDEE3', '#D8ECFF', '#FFF6E1', '#E0F3F2', '#E8DDFF', '#FFEDDD'];

const data = [
    '전국',
    '서울',
    '부산',
    '대구',
    '인천'
    // '광주',
    // '대전',
    // '울산',
    // '세종',
    // '경기',
    // '강원',
    // '충북',
    // '충남',
    // '전북',
    // '전남',
    // '경북',
    // '경남',
    // '제주'
].map((krName) => ({
    krName,
    x: Math.floor(Math.random() * (1000000 - 100)) + 100,
    y: Math.floor(Math.random() * (1000000 - 100)) + 100,
    z: Math.floor(Math.random() * (1000000 - 100)) + 100
}));

const tooltipOptions = {
    position: 'absolute',
    'z-index': '10',
    'min-width': '100px',
    padding: '10px',
    'border-radius': '4px',
    color: '#fff',
    background: '#252B2F',
    visibility: 'hidden'
};

/**
 *  References :
 *  https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
 *  https://d3-graph-gallery.com/graph/barplot_stacked_hover.html
 */
export default function GroupBarChart() {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

        // DATA Pre-processing
        const subGroup = ['x', 'y', 'z'];
        const xLabels = data.map((item) => item.krName);
        const yLabels = d3.extent(data, (d) => d.x + d.y + d.z);

        // Canvas + Graph 설정
        const { graph, tooltip } = createCanvas({
            canvas: barChart.current,
            width,
            height,
            margin: [mt, mr, mb, ml],
            tooltipOptions
        });

        // X축, Y축 설정하기
        const { scale: xScale } = createAxis({
            graph,
            type: 'x',
            domain: xLabels,
            range: [0, graphWidth],
            draw: true,
            options: { padding: 0.25, tickSize: graphHeight, tickPadding: 10 }
        });
        const { scale: yScale } = createAxis({
            graph,
            type: 'y',
            domain: [0, yLabels[1]],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        const { scale: xSubGroupScale } = createAxis({
            graph,
            type: 'x',
            domain: subGroup,
            range: [0, xScale.bandwidth()],
            draw: false,
            options: { padding: 0.5, tickSize: 0, tickPadding: 0 }
        });

        // Sub Group별 색상 설정하기
        const { scale: color } = createAxis({ graph, type: 'color', domain: subGroup, range: colors.slice(0, 3) });

        // Grouped Bar Graph 그리기
        createGroupedBar({
            graph,
            data: data,
            x: xScale,
            xSubGroup: (d) => xSubGroupScale(d.key),
            y: yScale(0),
            subGroup,
            color: (d) => color(d.key),
            options: { width: xSubGroupScale.bandwidth(), height: graphHeight - yScale(0) },
            mouseOver,
            mouseMove,
            mouseLeave
        });

        function mouseOver(_event, d) {
            const category = d3.select(this.parentNode).datum(); // 현재 선택한 데이터의 서브 그룹명
            tooltip
                .html(
                    `<div class="d3-tooltip-name">${category.krName}</div>
                    <br/>
                    <div class="d3-tooltip-label">
                        <div class="d3-tooltip-color-${d.key}">
                            <span></span>
                        </div>
                        <span class="d3-tooltip-name">${d.key}: </span>${d.value.toLocaleString()}
                    </div>`
                )
                .style('visibility', 'visible');
        }

        function mouseMove(event, _d) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        }

        function mouseLeave(_event, d) {
            tooltip.html(``).style('visibility', 'hidden');
        }

        animateBar({
            graph: barChart.current,
            y: (d) => yScale(d.value),
            height: (d) => graphHeight - yScale(d.value)
        });
    }, []);

    return <div style={{ margin: 100, backgroundColor: '#fff' }} ref={barChart} id="grouped-bar-chart-canvas" />;
}
