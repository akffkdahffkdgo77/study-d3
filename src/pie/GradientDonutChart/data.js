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
    colors: ['linear-gradient(-90deg, rgb(27, 66, 222), hsl(200, 96%, 64%))', '#F5F5F5'],
    tooltip: tooltipOptions,
    dimensions: {
        radius: 500 / 2 - 50,
        height: 500,
        margin: [50, 50, 50, 50] // [mt, mr, mb, ml]
    }
};
