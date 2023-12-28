import React from 'react';
import BubbleChart from 'components/BubbleChart';
import { data, options } from 'components/BubbleChart/data';
import 'components/BubbleChart/index.css';

export default function BubbleChartDemo() {
    return <BubbleChart data={data} options={options} />;
}
