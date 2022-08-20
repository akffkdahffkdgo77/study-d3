import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { animateBar, createAxis, createBar, createCanvas } from './utils';

const width = 800;
const height = 800;
let [mt, mr, mb, ml] = [50, 0, 50, 100];

const graphWidth = width - mr - ml;
const graphHeight = height - mt - mb;

const colors = ['#FFDEE3', '#D8ECFF', '#FFF6E1', '#E0F3F2', '#E8DDFF', '#FFEDDD'];

const data = [
    '전국',
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주'
].map((krName) => ({ krName, totalCount: Math.floor(Math.random() * (1000000 - 100)) + 100 }));

const tooltipOptions = {
    position: 'absolute',
    top: 0,
    'z-index': '10',
    'min-width': '100px',
    padding: '10px',
    'border-radius': '4px',
    color: '#fff',
    background: '#252B2F',
    visibility: 'hidden'
};

// DATA Pre-Processing
const xLabels = data.map((item) => item.krName);

export default function BarChart() {
    const barChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }

        rendered.current = false;

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
            domain: [0, d3.extent(data, (d) => d.totalCount)[1]],
            range: [graphHeight, 0],
            draw: true,
            options: { graphWidth }
        });

        createBar({
            graph,
            data,
            x: (d) => xScale(d.krName),
            y: yScale(0),
            color: colors[1],
            options: { width: xScale.bandwidth(), height: graphHeight - yScale(0) },
            mouseOver,
            mouseMove,
            mouseLeave
        });

        function mouseOver(_e, data) {
            tooltip
                .html(
                    `<div class="d3-tooltip-name">
                        ${data.krName}
                    </div>
                    <br/>
                    <div class="d3-tooltip-label">
                        <div class="d3-tooltip-color">
                            <span></span>
                        </div>
                        <span class="d3-tooltip-name">totalCount:</span>${data.totalCount.toLocaleString()}
                    </div>`
                )
                .style('visibility', 'visible');
            d3.select(this).transition().attr('fill', 'rgba(54, 162, 235, 0.5)');
        }

        function mouseMove(event) {
            tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
        }

        function mouseLeave() {
            tooltip.html(``).style('visibility', 'hidden');
            d3.select(this).transition().attr('fill', colors[1]);
        }

        animateBar({
            graph: barChart.current,
            y: (d) => yScale(d.totalCount),
            height: (d) => graphHeight - yScale(d.totalCount)
        });
    }, []);

    return <div style={{ margin: 100, backgroundColor: '#fff' }} ref={barChart} id="bar-chart-canvas" />;
}
