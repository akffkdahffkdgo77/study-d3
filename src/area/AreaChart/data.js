const dummy = Array.from(Array(10)).map((_d, index) => ({
    label: index,
    value: Math.floor(Math.random() * (1000 - 600) + 600)
}));

const dates = Array.from(Array(10)).map((_d, index) =>
    index + 1 > 9 ? `2013-04-${index + 1}` : `2013-04-0${index + 1}`
);

const tooltipOptions = {
    position: 'absolute',
    top: 0,
    'z-index': 10,
    'min-width': '120px',
    'border-radius': '4px',
    color: '#fff',
    opacity: '0',
    overflow: 'hidden'
};

export const options = {
    colors: '#818CF8',
    tooltip: tooltipOptions,
    dimensions: {
        height: 800,
        margin: [20, 50, 50, 50] // [mt, mr, mb, ml]
    }
};

export const data = {
    datasets: dummy,
    xLabels: dates
};
