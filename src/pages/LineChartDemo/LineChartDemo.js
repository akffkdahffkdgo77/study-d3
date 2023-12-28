import LineChart from 'components/Line/LineChart';
import { data, options } from 'components/Line/LineChart/data';

export default function LineChartDemo() {
    return <LineChart data={data} options={options} />;
}
