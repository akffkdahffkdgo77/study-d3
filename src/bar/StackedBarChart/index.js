import React from 'react';
import Component from 'bar/StackedBarChart/Component';
import { data, options } from 'bar/StackedBarChart/data';

export default function StackedBarChart() {
    return <Component data={data} options={options} />;
}
