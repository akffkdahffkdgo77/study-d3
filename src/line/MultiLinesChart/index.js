import React from 'react';
import Component from 'line/MultiLinesChart/Component';
import { data, options } from 'line/MultiLinesChart/data';

export default function MultiLinesChart() {
    return <Component data={data} options={options} />;
}
