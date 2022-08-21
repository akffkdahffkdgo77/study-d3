import * as d3 from 'd3';

export const stackedDummy = [
    '전국',
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주'
].map((krName) => ({
    krName,
    x: Math.floor(Math.random() * (1000000 - 100)) + 100,
    y: Math.floor(Math.random() * (1000000 - 100)) + 100,
    z: Math.floor(Math.random() * (1000000 - 100)) + 100
}));

const tooltipOptions = {
    position: 'absolute',
    top: 0,
    'z-index': 10,
    'min-width': 100,
    padding: 10,
    'border-radius': 4,
    color: '#fff',
    background: '#252B2F',
    visibility: 'hidden'
};

const colors = ['#D8ECFF', '#FFDEE3', '#FFF6E1', '#E0F3F2', '#E8DDFF', '#FFEDDD'];


export const stackedData = {
    category: ['x', 'y', 'z'],
    xLabels: stackedDummy.map((item) => item.krName),
    yLabels: d3.extent(stackedDummy, (d) => d.x + d.y + d.z),
    datasets: stackedDummy
};

export const stackedOptions = {
    colors: colors,
    tooltip: tooltipOptions,
    dimensions: {
        height: 600,
        margin: [50, 0, 50, 70] // [mt, mr, mb, ml]
    }
};