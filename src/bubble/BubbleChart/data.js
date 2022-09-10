const dummy = Array.from(Array(100)).map(() => ({
    x: Math.floor(Math.random() * (12000 - 100)) + 100,
    y: Math.floor(Math.random() * (500 - 100)) + 100,
    z: Math.floor(Math.random() * (50 - 10)) + 10
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

export const data = {
    datasets: dummy
};

export const options = {
    colors: colors[0],
    tooltip: tooltipOptions,
    dimensions: {
        height: 600,
        margin: [50, 20, 50, 50] // [mt, mr, mb, ml]
    }
};
