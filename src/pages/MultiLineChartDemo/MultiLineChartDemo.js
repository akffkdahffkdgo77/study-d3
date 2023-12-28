import MultiLineChart from 'components/Line/MultiLineChart';
import { data, options } from 'components/Line/MultiLineChart/data';

export default function MultiLineChartDemo() {
    return <MultiLineChart data={data} options={options} />;
}
