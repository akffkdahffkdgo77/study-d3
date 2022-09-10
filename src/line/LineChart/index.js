import React from 'react';
import Component from 'line/LineChart/Component';
import { data, options } from 'line/LineChart/data';

export default function LineChart() {
    return <Component data={data} options={options} />;
}
