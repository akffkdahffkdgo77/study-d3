import React from 'react';
import Component from 'pie/DonutChart/Component';
import { data, options } from 'pie/DonutChart/data';

export default function DonutChart() {
    return <Component data={data} options={options} />;
}
