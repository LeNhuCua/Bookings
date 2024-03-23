/**
 * Revenue chart
 */
const revenueChartDOM = document.querySelector('#revenue-chart');
const revenueSummaryDOM = revenueChartDOM.querySelector('[data-revenue-summary]');

const revenueChartOptions = {
    chart: {
        type: "area",
        height: 300,
        foreColor: "#999",
        stacked: true,
        dropShadow: {
            enabled: true,
            enabledSeries: [0],
            top: -2,
            left: 2,
            blur: 5,
            opacity: 0.06
        },
        zoom: {
            enabled: true,
        }
    },
    colors: ['#009EF7'],
    stroke: {
        curve: "smooth",
        width: 3
    },
    dataLabels: {
        enabled: false,
    },
    series: [],
    markers: {
        size: 0,
        strokeColor: "#fff",
        strokeWidth: 3,
        strokeOpacity: 1,
        fillOpacity: 1,
        hover: {
            size: 6
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            hideOverlappingLabels: true,
        }
    },
    yaxis: {
        labels: {
            offsetX: 14,
            offsetY: -5,
            formatter: formatCurrency,
        },
    },
    grid: {
        padding: {
            left: -5,
            right: 5
        }
    },
    tooltip: {
        y: {
            formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                const count = w.config.series[seriesIndex].data[dataPointIndex].count;
                return `${formatCurrency(value)} VNĐ, ${count} đơn hàng`;
            }
        },
        x: {
            formatter: formatDateTime,
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left'
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.8,
            opacityTo: 0,
            stops: [0, 90, 100]
        },
    },
};

const revenueChart = new ApexCharts(
    revenueChartDOM.querySelector('[data-chart]'), revenueChartOptions
);
revenueChart.render();

const revenueChartDateRangePickerDOM = revenueChartDOM.querySelector('[data-control]');
revenueChartDateRangePickerDOM.addEventListener('change', (event) => {
    const { startDate, endDate, oldStartDate, oldEndDate } = event.target.dateRangePicker;
    if (
        startDate.isSame(oldStartDate)
        && endDate.isSame(oldEndDate)
    ) {
        return;
    }
    const _startDate = startDate.toDate();
    const _endDate = endDate.toDate();
    renderRevenueChart(_startDate, _endDate);
    // renderBookingStatusReport(_startDate, _endDate);
    renderServiceCurrentDayStatistic();
    renderServiceNextDayStatistic();
    renderBookingTypeStatistic(_startDate, _endDate);
    renderStaffStatistic(_startDate, _endDate);
    renderSalesPolicyStatistic(_startDate, _endDate);
});

const renderRevenueChart = async (fromParam, toParam) => {
    let _from = fromParam;
    let _to = toParam;

    // nếu 2 ngày trùng nhau thì lấy thêm 2 ngày kế bên
    const isSameDate = moment(_from).isSame(_to, 'day');
    if (isSameDate) {
        _from = moment(_from).subtract(1, 'days').toDate();
        _to = moment(_to).add(1, 'days').toDate();
    }

    const revenues = await getRevenueStatistic(_from, _to);
    const { data, from, to } = revenues;

    const totalRevenue = data.reduce((acc, current) => {
        // vì chọn cùng ngày (hôm nay, hôm qua) sẽ fetch thêm ngày trước và ngày sau
        // mới vẽ được chart, nên đối với những trường hợp đó chỉ tính tổng của ngày được chọn
        if (isSameDate && !moment(current.date).isSame(fromParam, 'day')) {
            return acc;
        }
        return acc + current.amount;
    }, 0);
    const revenueChartTotalRevenueDOM = revenueSummaryDOM.querySelector('[data-amount]');
    revenueChartTotalRevenueDOM.countUp.update(totalRevenue);

    const startDate = new Date(from);
    const endDate = new Date(to);

    const chartData = [];
    for (
        const currentDate = startDate;
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
    ) {
        const _currentDate = new Date(currentDate);
        const currentRevenue = data.find(
            s => new Date(s.date).toDateString() === _currentDate.toDateString()
        );

        chartData.push({
            x: _currentDate,
            y: currentRevenue?.amount || 0,
            count: currentRevenue?.count || 0,
        });
    }

    revenueChart.updateSeries([{
        name: 'Doanh thu',
        data: chartData
    }]);

    const revenuePercentageValueDOM = revenueSummaryDOM
        .querySelector('[data-growth-percentage]');
    const revenuePercentageBadgeDOM = revenueSummaryDOM.querySelector('[data-badge]');
    const revenuePercentageIconDOM = revenueSummaryDOM.querySelector('[data-icon]');
    const revenuePercentageTextDOM = revenueSummaryDOM.querySelector('[data-text]');

    const previousRevenueResult = await getPreviousRevenue();
    if (!previousRevenueResult) {
        revenuePercentageBadgeDOM.classList.add('d-none');
        revenuePercentageTextDOM.classList.add('d-none');
        return;
    } else {
        revenuePercentageBadgeDOM.classList.remove('d-none');
        revenuePercentageTextDOM.classList.remove('d-none');
    }

    const { previousRevenue, label, from: prevFrom, to: prevTo } = previousRevenueResult;

    const growthPercentage = calculateGrowthPercentage(
        totalRevenue,
        previousRevenue
    );

    if (growthPercentage < 0) {
        revenuePercentageBadgeDOM.classList.remove('badge-success');
        revenuePercentageBadgeDOM.classList.add('badge-danger');
        revenuePercentageIconDOM.classList.remove('ti', 'ti-arrow-up');
        revenuePercentageIconDOM.classList.add('ti', 'ti-arrow-down');
    } else {
        revenuePercentageBadgeDOM.classList.remove('badge-danger');
        revenuePercentageBadgeDOM.classList.add('badge-success');
        revenuePercentageIconDOM.classList.remove('ti', 'ti-arrow-down');
        revenuePercentageIconDOM.classList.add('ti', 'ti-arrow-up');
    }
    revenuePercentageTextDOM.textContent = label;
    revenuePercentageBadgeDOM.setAttribute(
        'data-bs-original-title',
        `${growthPercentage >= 0 ? '+' : ''} ${formatCurrency(totalRevenue - previousRevenue)} VNĐ`,
    );
    revenuePercentageTextDOM.setAttribute(
        'data-bs-original-title',
        `${formatDateTime(prevFrom)} - ${formatDateTime(prevTo)}`,
    )

    revenuePercentageValueDOM.countUp.options.decimalPlaces = 2;
    revenuePercentageValueDOM.countUp.update(Math.abs(growthPercentage));
};

const getPreviousRevenue = async () => {
    const dateRangePicker = revenueChartDateRangePickerDOM.dateRangePicker;
    const selectedRange = dateRangePicker.getSelectedRange();
    if (!selectedRange) return;

    const [selectedRangeKey, selectedRangeValue] = selectedRange;
    const [startDate, endDate] = selectedRangeValue;

    let label = '';
    let from = null;
    let to = null;
    switch (selectedRangeKey) {
        case 'Hôm nay':
        case 'Hôm qua':
            from = moment(startDate).subtract(1, 'days').toDate();
            to = from;
            label = 'So với hôm trước';
            break;
        case '7 ngày qua':
            from = moment(startDate).subtract(7, 'days').toDate();
            to = moment(startDate).subtract(1, 'days').toDate();
            label = 'So với 7 ngày trước';
            break;
        case '30 ngày qua':
            from = moment(startDate).subtract(30, 'days').toDate();
            to = moment(startDate).subtract(1, 'days').toDate();
            label = 'So với 30 ngày trước';
            break;
        case 'Tháng này':
        case 'Tháng trước':
            from = moment(startDate).subtract(1, 'month').toDate();
            to = moment(endDate).subtract(1, 'month').toDate();
            label = 'So với tháng trước';
            break;
        case 'Năm nay':
        case 'Năm qua':
            from = moment(startDate).subtract(1, 'year').toDate();
            to = moment(endDate).subtract(1, 'year').toDate();
            label = 'So với năm trước';
    }

    const { data } = await getRevenueStatistic(from, to);
    const previousRevenue = data.reduce((acc, current) => acc + current.amount, 0);
    return {
        previousRevenue,
        label,
        from,
        to,
    }
};

/**
 * General
 */

const generalStatisticDOM = document.querySelector('#general-statistic');
const renderGeneralStatistic = async () => {
    const fromToday = moment().startOf('day').toDate();
    const toToday = moment().endOf('day').toDate();
    const { data: todayData } = await getGeneralStatistic(fromToday, toToday);

    Object.entries(todayData).forEach(([key, value]) => {
        const reportElement = generalStatisticDOM.querySelector(`[data-key="${key}"]`);

        if (!reportElement) return;
        reportElement.countUp.update(value);
    });

    // tính phần trăm doanh thu dự kiến so với hôm qua
    const fromYesterDay = moment().subtract(1, 'day').startOf('day').toDate();
    const toYesterDay = moment().subtract(1, 'day').endOf('day').toDate();
    const { data: yesterdayData } = await getGeneralStatistic(fromYesterDay, toYesterDay);
    const expectedRevenuePercentageBadgeDOM = generalStatisticDOM
        .querySelector('[data-badge]');

    const expectedRevenueGrowthPercentage = calculateGrowthPercentage(
        todayData.revenue, yesterdayData.revenue
    );

    if (expectedRevenueGrowthPercentage > 0 && todayData.expectedRevenue > 0) {
        expectedRevenuePercentageBadgeDOM.innerHTML = `
            <span class="badge badge-light-success text-success">                                
                <i class="ti ti-arrow-up text-success fs-6"></i>
                <span>${Math.abs(expectedRevenueGrowthPercentage)}</span>%
            </span>
        `;
    }
    if (expectedRevenueGrowthPercentage < 0 && todayData.expectedRevenue > 0) {
        expectedRevenuePercentageBadgeDOM.innerHTML = `
            <span class="badge badge-light-danger text-danger">                                
                <i class="ti ti-arrow-down text-danger fs-6"></i>
                <span>${Math.abs(expectedRevenueGrowthPercentage)}</span>%
            </span>
        `;
    }
};

/**
 * Booking status
 */

const bookingStatusStatisticDOM = document.querySelector('#booking-status-statistic');
const renderBookingStatusReport = async (from, to) => {
    const _from = moment(from).startOf('month').toDate();
    const _to = moment(to).endOf('month').toDate();
    const { data } = await getBookingStatusStatistic(_from, _to);
    data.forEach(statusReport => {
        const statusElement = bookingStatusStatisticDOM.querySelector(
            `[data-status="${statusReport.statusLabel}"]`
        );
        statusElement.countUp.update(statusReport.count);
    });

    const allStatusElement = bookingStatusStatisticDOM.querySelector('[data-status="ALL"]');
    const total = data.reduce((acc, current) => acc + current.count, 0);
    allStatusElement.countUp.update(total);
};

/**
 * Booking Type
 */

const bookingTypeStatisticDOM = document.querySelector('#booking-type-statistic');
const renderBookingTypeStatistic = async (from, to) => {
    const { data } = await getServiceStatistic(from, to);
    const total = data.reduce((acc, current) => acc + current.revenue, 0);
    const _total = total === 0 ? 1 : total;

    const tableBody = bookingTypeStatisticDOM.querySelector('tbody');
    tableBody.innerHTML = data.map(bookingTypeStatistic => {
        const { bookingTypeLabel, count, revenue } = bookingTypeStatistic;
        // tỷ trọng
        const percentage = (revenue / _total * 100).toFixed(2);
        return /* html */ `
            <tr class="mb-6">
                <td class="p-0">
                    <div class="d-flex align-items-center">
                        <div class="ps-3">
                            <a href="/Statistic/Service" class="text-gray-800 fw-boldest fs-5 text-hover-primary mb-1">
                                ${bookingTypeLabel}
                            </a>
                            <span class="text-gray-400 fw-bold d-block">
                                ${count} đơn hàng chốt thành công
                            </span>
                        </div>
                    </div>
                </td>
                
                <td>
                    <div class="d-flex flex-column w-100 me-2 mt-2">
                        <span class="text-gray-400 me-2 fw-boldest mb-2">${Number(percentage)}%</span>
                        <div class="progress bg-light-danger w-100 h-5px">
                            <div class="progress-bar bg-danger h-5px" role="progressbar" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </td>
                
                <td class="pe-0 text-end text-dark fw-boldest">${formatCurrency(revenue)}</td>
            </tr>
        `;
    }).join('');
};

const bookingCurrentDayStatisticDOM = document.querySelector('#booking-current-day-statistic');
const renderServiceCurrentDayStatistic = async () => {
    let data = await getServiceCurrentDayStatistic();
    await renderServiceInADay (bookingCurrentDayStatisticDOM, data)


};
const bookingNextDayStatisticDOM = document.querySelector('#booking-next-day-statistic');
const renderServiceNextDayStatistic = async () => {
    let data = await getServiceNextDayStatistic();
    await renderServiceInADay (bookingNextDayStatisticDOM, data)
};
renderServiceDetailModel = (fullName, phone, serviceName, data, Id) => {
    let currentModel = `
    <!-- Modal -->
    <div class="modal fade" id="Model_${Id}" tabindex="-1" aria-labelledby="ModalLabel_${Id}" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="ModalLabel_${Id}">Thông tin đơn hàng</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <span class="fw-bold d-block">
                - Họ và tên: ${fullName}
            </span>
            <span class="fw-bold d-block">
                - Điện thoại: ${phone}
            </span>
            <span class="fw-bold d-block">
                - Dịch vụ: ${serviceName}
            </span>
            <span class="fw-bold d-block">
                - Số lượng: ${data.adult} người lớn, ${data.child} trẻ em
            </span>
            <span class="fw-bold d-block">
                - Thanh toán: ${formatCurrency(data.payment)}
            </span>
            <span class="fw-bold d-block">
                - Đối tác thu hộ: ${formatCurrency(data.payment)}
            </span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>`
    return currentModel;
}
renderServiceInADay = async (element, data) => {
    const tableBody = element.querySelector('tbody');
    textHtml =``;
    data.map(data => {
        const { getCustommer, getBookingServives, getBookingHotels, getBookingTickets }  = data;

            let textHtmlBuilding = ``;
            let textHtmlHotelRow = ``;
            let textHtmlServiceRow = ``;
            let textHtmlTicketRow = ``;
            let textHtmlBaseColumn = 
            `<td class="p-0">
                <div class="d-flex align-items-center">
                    <div class="ps-0">
                        <span class="text-gray-800 fw-boldest fs-5 mb-1">
                            ${getCustommer.fullName}
                        </span>
                        <span class="text-gray-400 fw-bold d-block">
                            - ${getCustommer.phone}
                        </span>
                    </div>
                </div>
            </td>`
            getBookingHotels.map(hotel => {
                textHtmlHotelRow += `
                <tr class="mb-6">
                    ${textHtmlBaseColumn}
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="ps-0">
                                <span class="text-gray-800 fw-boldest fs-5 mb-1">
                                    ${hotel.name}
                                </span>
                                <span class="text-gray-400 fw-bold d-block">
                                    - ${hotel.roomType}
                                </span>
                            </div>
                        </div>
                    </td>
                    
                    <td class="pe-0 text-end text-dark fw-boldest">${formatCurrency(hotel.payment)}</td>
                </tr>`
            })
            getBookingServives.map(service => {
                textHtmlServiceRow += `
                ${renderServiceDetailModel(getCustommer.fullName, getCustommer.phone, service.name, service, service.id)}
                <tr class="mb-6">
                    ${textHtmlBaseColumn}
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="ps-0">
                                <span class="text-gray-800 fw-boldest fs-5 mb-1">
                                    ${service.name}
                                </span>
                                <span class="text-gray-400 fw-bold d-block">
                                   - ${service.adult} NL, ${service.child} TE
                                </span>
                            </div>
                        </div>
                    </td>
                    
                    <td class="pe-0 text-end text-dark fw-boldest">${formatCurrency(service.payment)}</td>
                    <td class="pe-0 text-end text-dark fw-boldest">
                        <div class="d-flex align-items-center">
                            <div class="d-flex flex-center">
                                <a class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-25px h-25px" type="button" data-bs-toggle="modal" data-bs-target="#Model_${service.id}">
                                    <span class="svg-icon svg-icon-5 svg-icon-gray-700">
                                        <i class="ti ti-arrow-narrow-right"></i>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </td>
                </tr>`
            })
            getBookingTickets.map(ticket => {
                textHtmlTicketRow  += `
                <tr class="mb-6">
                    ${textHtmlBaseColumn}
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="ps-0">
                                <span class="text-gray-800 fw-boldest fs-5 mb-1">
                                    Mã: ${ticket.code}
                                </span>
                                <span class="text-gray-400 fw-bold d-block">
                                    - Chặng bay: ${ticket.nameFlight}
                                </span>
                                <span class="text-gray-400 fw-bold d-block">
                                    - Hạng vé: ${ticket.nameFlightClass}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td class="pe-0 text-end text-dark fw-boldest">${formatCurrency(ticket.payment)}</td>
                </tr>
                `
            })
            textHtmlBuilding = textHtmlHotelRow + textHtmlServiceRow + textHtmlTicketRow;
            textHtml += textHtmlBuilding;
        })
        tableBody.innerHTML = textHtml;
}

/**
 * Staff
 */

const staffStatisticDOM = document.querySelector('#staff-statistic');
const renderStaffStatistic = async (from, to) => {
    const { data } = await getStaffStatistic(from, to);
    staffStatisticDOM.innerHTML = data.map(staffStatistic => {
        const { staff, count, revenue } = staffStatistic;
        return /* html */ `
            <div class="d-flex align-items-sm-center mb-7">
                <div class="symbol symbol-circle symbol-50px me-5">
                    <span class="symbol-label">
                        <img src="${staff.avatarUrl}" class="h-50 align-self-center" alt="${staff.fullName}">
                    </span>
                </div>
                <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                    <div class="flex-grow-1 me-2">
                        <a href="/Statistic/Staff" class="text-gray-800 text-hover-primary fs-6 fw-bolder">${staff.fullName}</a>
                        <span class="text-muted fw-bold d-block fs-7">${count} đơn hàng chốt thành công</span>
                    </div>
                    <span class="badge badge-light fw-bolder my-2 fs-4">${formatCurrency(revenue)}</span>
                </div>
            </div>
        `;
    }).join('');
}

const salesPolicyStatisticDOM = document.querySelector('#salesPolicy-type-statistic');
const renderSalesPolicyStatistic = async (from, to) => {
    const { data } = await getSalesPolicyStatistic(from, to);

    const getStatus = (tagStatus) => {
        switch (tagStatus) {
            case 0:
                return /* html */ `<span class="badge badge-light-danger">Kết thúc</span>`;
            case 1:
                return /* html */ `<span class="badge badge-light-warning">Hủy</span>`;
            case 2:
                return /* html */ `<span class="badge badge-light-primary">Đang chuẩn bị</span>`;
            case 3:
                return /* html */ `<span class="badge badge-light-success">Đang chạy</span>`;
            default:
                return ''
        };
    }

    const tableBody = salesPolicyStatisticDOM.querySelector('tbody');
    tableBody.innerHTML = data.map(salesPolicyStatistic => {
        return /* html */ `
            <tr class="mb-6">
                <td class="p-0">
                    <div class="d-flex align-items-center">
                        <div class="ps-3">
                            <a href="#" class="text-gray-800 fw-boldest fs-5 text-hover-primary mb-1">
                                ${salesPolicyStatistic.title}
                            </a>
                            <span class="text-gray-400 fw-bold d-block">
                                ${salesPolicyStatistic.subTitle}
                            </span>
                        </div>
                    </div>
                </td>
                <td class="p-0">
                    <div class="d-flex align-items-center">
                        <div class="ps-3">
                            ${getStatus(salesPolicyStatistic.tagStatus)}
                        </div>
                    </div>
                </td>
                <td class="p-0">
                    <div class="d-flex align-items-center">
                        <div class="ps-3">
                            <span class="text-gray-600 fw-bold d-block">
                                ${salesPolicyStatistic.fromDate.slice(0, -9)} -:- ${salesPolicyStatistic.toDate.slice(0, -9)}
                            </span>
                        </div>
                    </div>
                </td>
                
                <td>
                    <div class="d-flex align-items-center">
                        <div class="d-flex flex-center">
                            <a
                                data-bs-toggle="modal" data-bs-target="#salesPolicyModal_${salesPolicyStatistic.id}"
                                class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-25px h-25px"
                            >
                                <span class="svg-icon svg-icon-5 svg-icon-gray-700">
                                    <i class="ti ti-arrow-narrow-right"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </td>
            </tr>
            <div class="modal fade" id="salesPolicyModal_${salesPolicyStatistic.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Nội dung chính sách - ${salesPolicyStatistic.title}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${salesPolicyStatistic.description || 'N/A'}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

/**
 * Init
 */

const initDashboard = () => {
    const revenueChartDateRangePickerData = revenueChartDateRangePickerDOM.dateRangePicker;
    const startDate = revenueChartDateRangePickerData.startDate.toDate();
    const endDate = revenueChartDateRangePickerData.endDate.toDate();
    renderRevenueChart(startDate, endDate);
    // renderBookingStatusReport(startDate, endDate);
    renderServiceCurrentDayStatistic();
    renderServiceNextDayStatistic();
    renderBookingTypeStatistic(startDate, endDate);
    renderStaffStatistic(startDate, endDate);
    renderSalesPolicyStatistic(startDate, endDate);
    renderGeneralStatistic();
};

initDashboard();
