const months = Array.from({ length: 12 }, (item, i) => {
    return new Date(0, i).toLocaleString('en-US', { month: 'long' })
});
const getDayArr = (arr) => {
    for (let i = 0; i < 31; i++) {
        arr.push(i + 1)
    }
    return arr;
}

const getMonthArr = (arr) => {
    let d = new Date(null);
    for (let i = 0; i < 12; i++) {
        d.setMonth(i);
        var monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format;
        arr.push(monthName(d))
    }
    return arr;
}

const getYearArr = (arr) => {
    let currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
        arr.push(i);
    }
    return arr;
}

const getDateofbirthArr = () => {
    let dayArr = [], monthArr = [], yearArr = [];
    dayArr = getDayArr(dayArr);
    monthArr = getMonthArr(monthArr);
    yearArr = getYearArr(yearArr);
    return [dayArr, monthArr, yearArr];
}

export const getMonthFromString = (mon) => {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}

export default getDateofbirthArr;