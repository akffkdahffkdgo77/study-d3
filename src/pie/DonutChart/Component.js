import { useEffect, useRef } from 'react';

import * as d3 from 'd3';
import { createAxis, createCanvas, createToolTip } from '../../utils/settings';
import { tooltipMouseLeave, tooltipMouseMove, tooltipMouseOver } from '../../utils/tooltip';
import { createDonut } from '../utils/draw';

// See : https://d3-graph-gallery.com/graph/donut_basic.html
export default function Component({ data, options }) {
    const donutChart = useRef(null);
    const rendered = useRef(true);

    useEffect(() => {
        if (!rendered.current) {
            return;
        }
        rendered.current = false;

        const { datasets } = data;
        const width = donutChart.current.clientWidth + Math.floor(options.dimensions.margin[3] / 2);
        const height = options.dimensions.height;

        const graph = createCanvas({
            canvas: donutChart.current,
            options: {
                width,
                height,
                margin: options.dimensions.margin,
                transform: `translate(${height / 2}, ${height / 2})`
            }
        });

        const { scale: colors } = createAxis({
            graph,
            type: 'ordinal',
            domain: Object.keys(datasets),
            range: options.colors
        });

        const tooltip = createToolTip({ tooltipOptions: options.tooltip });
        function onMouseOver(_event, d) {
            tooltipMouseOver({
                tooltip,
                html: ` <div class="d3-tooltip-name">
                            ${d.data[0]}
                        </div>
                        <div class="d3-tooltip-label">
                            <div class="d3-tooltip-color" style="background-color: ${colors(d.data[0])}">
                                <span></span>
                            </div>
                            <span class="d3-tooltip-value">게시글 수:</span>${d.data[1].toLocaleString()}
                        </div>`
            });
            d3.select(this).transition().attr('opacity', 1).attr('transform', 'scale(1.1)');
        }

        function onMouseMove(event, _d) {
            tooltipMouseMove({ tooltip, event });
        }

        function onMouseLeave(_event, _d) {
            tooltipMouseLeave({ tooltip });
            d3.select(this).transition().attr('opacity', 0.9).attr('transform', 'scale(1)');
        }

        createDonut({
            graph,
            data: datasets,
            options: {
                radius: options.dimensions.radius,
                fill: (d) => colors(d.data[0]),
                stroke: '#ffffff',
                strokeWidth: 3,
                opacity: 0.9
            },
            onMouseOver,
            onMouseMove,
            onMouseLeave
        });
    }, [data, options]);

    return (
        <div
            id="donut-chart"
            style={{
                display: 'flex',
                alitngnItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 4
            }}
            ref={donutChart}
        />
    );
}