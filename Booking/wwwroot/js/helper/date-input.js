document.querySelectorAll('[data-control="flatpickr-range"]').forEach(element => {
    const {
        fromInput,
        toInput,
        submitOnChange = 'true'
    } = element.dataset;

    const fromInputDOM = document.querySelector(fromInput);
    const toInputDOM = document.querySelector(toInput);

    const from = fromInputDOM && moment(fromInputDOM.value, 'DD-MM-YYYY').toDate();
    const to = toInputDOM && moment(toInputDOM.value, 'DD-MM-YYYY').toDate();

    const fp = flatpickr(element, {
        altInput: true,
        altFormat: 'd-m-Y',
        dateFormat: 'd-m-Y',
        mode: 'range',
        defaultDate: [from, to],
        formatDate: formatDateTime,
    });

    fp.config.onChange.push((selectedDates) => {
        if (selectedDates.length !== 2) {
            return;
        }
        const [from, to] = selectedDates;
        fromInputDOM.value = formatDateTime(from);
        toInputDOM.value = formatDateTime(to);
        submitOnChange === 'true' && element.closest('form')?.submit();
    });
});

/**
 * <input class="form-control" data-control="flatpickr-month">
 */
document.querySelectorAll('[data-control="flatpickr-month"]').forEach(element => {
    let previousSelectedMonth = null;
    const fp = flatpickr(element, {
        altInput: true,
        plugins: [
            new monthSelectPlugin({
                dateFormat: 'm-Y',
                altFormat: 'm-Y',
            }),
        ],
        onClose(date) {
            const _date = new Date(date);
            if (previousSelectedMonth && moment(_date).isSame(previousSelectedMonth, 'month')) {
                return;
            }
            element.dispatchEvent(new Event('change'));
            previousSelectedMonth = new Date(_date);
        },
    });

    fp.setDate(new Date(), true);
});

/**
 * Để lấy date range picker instance, gọi {element}.dateRangePicker
 * @param {HTMLElement} element
 */
const fDateRangePicker = (element) => {
    // Check if jQuery included
    if (typeof jQuery == 'undefined') {
        return;
    }

    // Check if daterangepicker included
    if (typeof $.fn.daterangepicker === 'undefined') {
        return;
    }

    if (element.dateRangePicker) {
        return;
    }

    const fromInput = document.querySelector(element.dataset.fromInput);
    const toInput = document.querySelector(element.dataset.toInput);
    const inputFormat = element.dataset.inputFormat || 'DD-MM-YYYY';
    const submitOnChange = element.dataset.submitOnChange;

    const initialStartDate = fromInput && moment(fromInput.value, inputFormat).toDate();
    const initialEndDate = toInput && moment(toInput.value, inputFormat).toDate();

    const start = initialStartDate || moment().startOf('month');
    const end = initialEndDate || moment().endOf('month');
    const display = element.querySelector(element.dataset.displayTarget);
    // left | right | center
    const dropdownPosition = element.dataset?.dropdownPosition || 'left';
    /**
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @returns 
     */
    const onChange = (startDate, endDate) => {
        if (!display) return;
        display.textContent = `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`;

        if (fromInput && toInput) {
            fromInput.value = formatDateTime(startDate);
            toInput.value = formatDateTime(endDate);
        }
        if (!element.dateRangePicker) {
            return;
        }
        const { oldStartDate, oldEndDate } = element.dateRangePicker;
        if (
            startDate.isSame(oldStartDate)
            && endDate.isSame(oldEndDate)
        ) {
            return;
        }
        if (submitOnChange) {
            element.closest('form')?.submit();
        }
    }

    $(element).daterangepicker({
        startDate: start,
        endDate: end,
        opens: dropdownPosition,
        ranges: {
            'Hôm nay': [moment(), moment()],
            'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '7 ngày qua': [moment().subtract(6, 'days'), moment()],
            '30 ngày qua': [moment().subtract(29, 'days'), moment()],
            'Tháng này': [moment().startOf('month'), moment().endOf('month')],
            'Tháng trước': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Năm nay': [
                moment().startOf('year'),
                moment().endOf('year')
            ],
            'Năm qua': [
                moment().subtract(1, 'year').startOf('year'),
                moment().subtract(1, 'year').endOf('year')
            ],
        }
    }, onChange);

    onChange(start, end);
    const dateRangePicker = $(element).data('daterangepicker');

    // lấy range đang được chọn, undefined nếu range là custom
    dateRangePicker.getSelectedRange = () => {
        const { ranges, startDate, endDate } = dateRangePicker;
        return Object.entries(ranges).find(([key, value]) => {
            const [start, end] = value;
            return startDate.isSame(start, 'day') && endDate.isSame(end, 'day');
        });
    };

    $(element).on('apply.daterangepicker', () => {
        element.dispatchEvent(new Event('change'));
    });

    element.dateRangePicker = dateRangePicker;
};

/**
 * @example
 * <div data-controls="jquery-date-range-picker"
 *      data-display-target="div"
 *      class="btn btn-sm btn-light d-flex align-items-center px-4"
 * >           
 *     <div class="text-gray-600 fw-bold"></div>
 *     <span class="svg-icon svg-icon-1 ms-2 me-0">
 *         icon
 *     </span>
 * </div>  
 */
const initFDateRangePicker = () => {
    document.querySelectorAll('[data-control="jquery-date-range-picker"]')
        .forEach(fDateRangePicker);
};

initFDateRangePicker();    