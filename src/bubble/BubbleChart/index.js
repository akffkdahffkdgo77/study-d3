import React from 'react';
import Component from 'bubble/BubbleChart/Component';
import { data, options } from 'bubble/BubbleChart/data';
import 'bubble/styles/index.css';

export default function BubbleChart() {
    return <Component data={data} options={options} />;
}
