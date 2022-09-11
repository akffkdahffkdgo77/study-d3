const dummy = { 블라블라: 500, 반려동물: 100 };

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

export const data = {
    datasets: dummy
};

export const options = {
    colors: ['#9ADCFF', '#FFF89A', '#FFB2A6', '#FF8AAE'],
    tooltip: tooltipOptions,
    dimensions: {
        radius: 500 / 2 - 50,
        height: 500,
        margin: [50, 50, 50, 50] // [mt, mr, mb, ml]
    }
};
