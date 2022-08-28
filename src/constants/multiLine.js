const lineDummy = Array.from(Array(21)).map((_, i) => ({
    label: i,
    x: Math.floor(Math.random() * (1000 - 500)) + 500,
    y: Math.floor(Math.random() * (500 - 100)) + 100,
    z: Math.floor(Math.random() * (1500 - 1000)) + 1000
}));

const tooltipOptions = {
    position: 'absolute',
    top: 0,
    'z-index': 10,
    'min-width': '100px',
    padding: '10px',
    'border-radius': '4px',
    color: '#fff',
    background: '#252B2F',
    visibility: 'hidden'
};

const colors = ['#D8ECFF', '#FFDEE3', '#FFF6E1', '#E0F3F2', '#E8DDFF', '#FFEDDD'];

export const multiLineData = {
    xLabels: [],
    yLabels: [],
    category: ['x', 'y', 'z'],
    datasets: lineDummy
};

export const multiLineOptions = {
    colors,
    tooltip: tooltipOptions,
    dimensions: {
        height: 600,
        margin: [50, 20, 50, 70] // [mt, mr, mb, ml]
    }
};
