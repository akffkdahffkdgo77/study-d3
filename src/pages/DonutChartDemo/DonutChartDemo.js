import DonutChart from 'components/Pie/DonutChart';
import { data, options } from 'components/Pie/DonutChart/data';

export default function DonutChartDemo() {
    return <DonutChart data={data} options={options} />;
}
