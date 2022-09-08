// 데이터 형식 { label : '', value : '' }[]
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
].map((label) => ({ label, value: Math.floor(Math.random() * (1000000 - 100)) + 100 }));

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

export const barData = {
    xLabels: barDummy.map((item) => item.label),
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
