const getServiceStatistic = async (from, to) => {
    const response = await fetch(
        `/statistic/service?${new URLSearchParams({
            from: formatDateTime(from),
            to: formatDateTime(to),
        })}`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    return response.json();
};
const getServiceCurrentDayStatistic = async () => {
    const response = await fetch(
        `/statistic/ServiceInCurrentDay`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    return response.json();
};
const getServiceNextDayStatistic = async () => {
    const response = await fetch(
        `/statistic/ServiceInNextDay`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    return response.json();
};

const getRevenueStatistic = async (from, to) => {
    const response = await fetch(`/statistic/revenue?${new URLSearchParams({
        from: formatDateTime(from),
        to: formatDateTime(to),
    })}`);
    return response.json();
};
const getOkrsStatistic = async (from, to) => {
    const response = await fetch(`/statistic/okrs?${new URLSearchParams({
        from: formatDateTime(from),
        to: formatDateTime(to),
    })}`);
    return response.json();
};
const getSalesPolicyStatistic = async (from, to) => {
    const response = await fetch(`/statistic/salespolicy?${new URLSearchParams({
        from: formatDateTime(from),
        to: formatDateTime(to),
    })}`);
    return response.json();
};

const getBookingStatusStatistic = async (from, to) => {
    const response = await fetch(`/statistic/bookingstatus?${new URLSearchParams({
        from: formatDateTime(from),
        to: formatDateTime(to),
    })}`);
    return response.json();
};

const getStaffStatistic = async (from, to) => {
    const response = await fetch(
        `/statistic/staff?${new URLSearchParams({
            from: formatDateTime(from),
            to: formatDateTime(to),
        })}`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.json();
};

const getGeneralStatistic = async (from, to) => {
    const response = await fetch(`/statistic/general?${new URLSearchParams({
        from: formatDateTime(from),
        to: formatDateTime(to),
    })}`);
    return response.json();
};
