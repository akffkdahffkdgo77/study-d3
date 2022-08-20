import BarChart from './BarChart';
import BubbleChart from './BubbleChart';
import LineChart from './LineChart';
import StackedBarChart from './StackedBarChart';

// https://github.com/d3/d3/blob/main/API.md#d3-api-reference
function App() {
    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: 100, paddingBottom: 100 }}>
            <h1 style={{ width: '100%', textAlign: 'center', color: '#fff', marginTop: 0 }}>
                Common Chart Clone Coding
            </h1>
            <BarChart />
            <StackedBarChart />
            <LineChart />
            <BubbleChart />
        </div>
    );
}

export default App;
