const barDummy = [
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
].map((krName) => ({ krName, totalCount: Math.floor(Math.random() * (1000000 - 100)) + 100 }));

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

export const barData = {
    labels: barDummy.map((item) => item.krName),
    datasets: barDummy
};

export const barOptions = {
    colors: colors[0],
    tooltip: tooltipOptions,
    dimensions: {
        height: 600,
        margin: [50, 0, 50, 70] // [mt, mr, mb, ml]
    }
};