'use strict';
let okrsChartDOM;
let okrsSummaryDOM;

okrsChartDOM = document.getElementById('okrs-chart');
const okrsChartDateRangePickerDOM = okrsChartDOM.querySelector('[data-control]');
let filterByDate = document.getElementById('filter-by-date');

const configFromYearToFilter = 2023;
let okrsChartOptions;
let okrsChart;

window.onload = async function () {
    await buildFilterByDate();
    await initChart();
};
function buildFilterByDate() {
    let selectInput = '';
    let years = getYears();
    years.forEach((year) => {
        selectInput += `<option selected=${year == new Date().getFullYear()} value=${JSON.stringify(year)}>Năm ${year.minDate.getFullYear()}</option>`;
    });
    filterByDate.innerHTML = selectInput;
}
function getYears() {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Create an array of years from configFromYearToFilter to the current year
    const years = [];
    for (let year = configFromYearToFilter; year <= currentYear; year++) {
        years.push(getYearMinMaxDates(year));
    }

    // Return the array of years
    return years;
}
function getYearMinMaxDates(currentYear) {
    // Create the minimum date (January 1st)
    const minDate = new Date(currentYear, 0, 1);

    // Create the maximum date (December 31st)
    const maxDate = new Date(currentYear, 11, 31);

    return {
        minDate: minDate,
        maxDate: maxDate,
    };
}
async function initChart() {
    let startDate;
    let endDate;
    startDate = moment().startOf('year');
    endDate = moment().endOf('year');

    await configChart();

    await renderOkrsChart(startDate, endDate);
}
async function configChart() {
    okrsChartOptions = {
        chart: {
            type: 'area',
            height: 250,
            foreColor: '#999',
            stacked: false,
            dropShadow: {
                enabled: true,
                enabledSeries: [0],
                top: -2,
                left: 2,
                blur: 5,
                opacity: 0.06,
            },
            height: 500,
            width: '100%',
            zoom: {
                enabled: true,
            },
        },
        colors: ['#009EF7'],
        stroke: {
            width: 5,
            curve: 'smooth',
        },
        dataLabels: {
            enabled: false,
        },
        series: [],
        colors: ['#f25a7f', '#77B6EA'],
        markers: {
            size: 0,
            strokeColor: '#fff',
            strokeWidth: 3,
            strokeOpacity: 1,
            radius: 2,
            fillOpacity: 1,
            hover: {
                size: 6,
            },
        },
        xaxis: {},
        tooltip: {
            y: {
                formatter: function (
                    value,
                    { series, seriesIndex, dataPointIndex, w }
                ) {
                    const count =
                        w.config.series[seriesIndex].data[dataPointIndex].count;
                    return `${formatCurrency(value)} VNĐ`;
                },
            },
        },
        grid: {
            padding: {
                left: -5,
                right: 5,
            },
        },
        yaxis: {
            labels: {
                offsetX: -15,
                offsetY: 1,
                formatter: formatCurrency,
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100],
            },
        },
    };

    okrsChart = new ApexCharts(
        okrsChartDOM.querySelector('[data-chart]'),
        okrsChartOptions
    );
    okrsChart.render();
}

function submitDataToServer() {
    let data = JSON.parse(filterByDate.value);
    const _startDate = data.minDate;
    const _endDate = data.maxDate;

    renderOkrsChart(_startDate, _endDate);
}

const renderOkrsChart = async (fromParam, toParam) => {
    let _from = fromParam;
    let _to = toParam;

    // nếu 2 ngày trùng nhau thì lấy thêm 2 ngày kế bên
    const isSameDate = moment(_from).isSame(_to, 'day');
    if (isSameDate) {
        _from = moment(_from).subtract(1, 'days').toDate();
        _to = moment(_to).add(1, 'days').toDate();
    }

    const okrs = await getOkrsStatistic(_from, _to); // Lấy API
    const { data, from, to } = okrs;

    okrsChart.updateSeries([
        {
            name: 'Mục tiêu',
            data: data.targetValue,
        },
        {
            name: 'Đạt được',
            data: data.currentValue,
        },
    ]);
    okrsChart.updateOptions({
        xaxis: {
            categories: ConvertToMonthString(data.name),
        },
    });
};

function ConvertToMonthString(strArray) {
    // Sử dụng phương thức map để lặp qua từng item trong array string
    const monthArray = strArray.map((str) => {
        // Kiểm tra xem chuỗi có chứa từ khóa "tháng" hay không
        if (str.includes('tháng')) {
            // Sử dụng một trong các phương thức trên để lấy tháng từ chuỗi
            getMonthFromString(str);
            return getMonthFromString(str);
        } else {
            // Trả về nguyên chuỗi
            return str;
        }
    });

    // Trả về array mới
    return monthArray;
}
function getMonthFromString(str) {
    // Vị trí bắt đầu của tháng
    const startIndex = str.indexOf('tháng') + 6;

    // Vị trí kết thúc của tháng
    const endIndex = startIndex + 2;

    // Lấy chuỗi con biểu thị tháng
    let month = str.substring(startIndex, endIndex);
    month = month.replace(/\//g, '');

    // Trả về tháng
    return `Tháng ${month}`;
}
