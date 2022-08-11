import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const sampleData = [100, 10, 30, 50, 10, 70, 200, 90];

function App() {
    const lineChart = useRef();

    useEffect(() => {
        const svg = d3.select(lineChart.current);
        sampleData.forEach((data, index) => {
            svg.append('rect')
                .attr('height', data)
                .attr('width', 30)
                .attr('x', 40 * index + 100)
                .attr('y', 300 - data + 100);
        });
    }, []);

    return (
        <div>
            <h1>TEST</h1>
            <svg width="500" height="500" ref={lineChart} />
        </div>
    );
}

export default App;
