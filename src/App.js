import BarChart from './BarChart';
import LineChart from './LineChart';

// https://github.com/d3/d3/blob/main/API.md#d3-api-reference
function App() {
    return (
        <div style={{ backgroundColor: '#000', height: '100vh' }}>
            <h1 style={{ width: '100%', textAlign: 'center', color: '#fff', marginTop: 0 }}>
                Common Chart Clone Coding
            </h1>
            <BarChart />
            <LineChart />
        </div>
    );
}

export default App;
