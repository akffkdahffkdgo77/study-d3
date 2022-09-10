import React from 'react';
import Component from 'bar/GroupedBarChart/Component';
import { data, options } from 'bar/GroupedBarChart/data';

export default function GroupedBarChart() {
    return <Component data={data} options={options} />;
}
