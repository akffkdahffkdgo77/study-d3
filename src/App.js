import BarChart from './BarChart';
import BubbleChart from './BubbleChart';
import { barData, barOptions } from "./constants/bar";
import { groupedData, groupedOptions } from "./constants/groupedBar";
import { stackedData, stackedOptions } from "./constants/stackedBar";
import GroupBarChart from './GroupedBarChart';
import LineChart from './LineChart';
import StackedBarChart from './StackedBarChart';

// https://github.com/d3/d3/blob/main/API.md#d3-api-reference
function App() {
    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: 100, paddingBottom: 100 }}>
            <h1 style={{ width: '100%', textAlign: 'center', color: '#fff', marginTop: 0 }}>
                Common Chart Clone Coding
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 50, padding: 50 }}>
                <BarChart data={barData} options={barOptions} />
                <StackedBarChart data={stackedData} options={stackedOptions} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 50, padding: 50 }}>
                <GroupBarChart data={groupedData} options={groupedOptions} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 50, padding: 50 }}>
                <LineChart />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 50, padding: 50 }}>
                <BubbleChart />
            </div>
        </div>
    );
}

export default App;
