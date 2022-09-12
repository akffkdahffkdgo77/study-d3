import AreaChart from 'area/AreaChart';
import BarChart from 'bar/BarChart';
import GroupedBarChart from 'bar/GroupedBarChart';
import StackedBarChart from 'bar/StackedBarChart';
import BubbleChart from 'bubble/BubbleChart';
import LineChart from 'line/LineChart';
import MultiLinesChart from 'line/MultiLinesChart';
import ScatterLineChart from 'mixed/ScatterLineChart';
import DonutChart from 'pie/DonutChart';
import GradientDonutChart from 'pie/GradientDonutChart';

function App() {
    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: 100 }}>
            <h1 style={{ width: '100%', textAlign: 'center', color: '#fff', marginTop: 0 }}>
                Common Chart Clone Coding
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 50, padding: 50 }}>
                <DonutChart />
                <GradientDonutChart />
            </div>
            <div style={{ padding: 50 }}>
                <AreaChart />
            </div>
            <div style={{ padding: 50 }}>
                <ScatterLineChart />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 50, padding: 50 }}>
                <BarChart />
                <StackedBarChart />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 50, padding: 50 }}>
                <GroupedBarChart />
                <BubbleChart />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 50, padding: 50 }}>
                <LineChart />
                <MultiLinesChart />
            </div>
        </div>
    );
}

export default App;
