import React from 'react';
import Component from 'bar/BarChart/Component';
import { data, options } from 'bar/BarChart/data';

export default function BarChart() {
    return <Component data={data} options={options} />;
}
