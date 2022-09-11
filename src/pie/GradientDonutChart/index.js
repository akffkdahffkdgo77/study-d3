import React from 'react';
import Component from 'pie/GradientDonutChart/Component';
import { data, options } from 'pie/GradientDonutChart/data';

export default function GradientDonutChart() {
    return <Component data={data} options={options} />;
}
