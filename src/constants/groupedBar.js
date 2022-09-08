const groupedDummy = ['전국', '서울', '부산', '대구', '인천'].map((label) => ({
    label,
    x: Math.floor(Math.random() * (1000000 - 100)) + 100,
    y: Math.floor(Math.random() * (1000000 - 100)) + 100,
    z: Math.floor(Math.random() * (1000000 - 100)) + 100
}));

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

export const groupedData = {
    category: ['x', 'y', 'z'],
    xLabels: groupedDummy.map((item) => item.label),
    datasets: groupedDummy
};

export const groupedOptions = {
    colors: colors,
    tooltip: tooltipOptions,
    dimensions: {
        height: 600,
        margin: [50, 0, 50, 70] // [mt, mr, mb, ml]
    }
};
