const dummy = [
    { label: '2022-05-01T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-02T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-03T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-04T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-05T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-06T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-07T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-08T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-09T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 },
    { label: '2022-05-10T00:00:00.000Z', value: Math.floor(Math.random() * (1000000 - 100)) + 100 }
];

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

const colors = ['#D8ECFF', '#FFDEE3', '#FFF6E1', '#E0F3F2', '#E8DDFF', '#FFEDDD'];

export const data = {
    xLabels: dummy.map((d) => new Date(d.label)),
    yLabels: dummy.map((d) => d.value),
    datasets: dummy
};

export const options = {
    colors: colors[0],
    dimensions: {
        height: 600,
        margin: [50, 0, 50, 70] // [mt, mr, mb, ml]
    },
    tooltip: tooltipOptions
};
