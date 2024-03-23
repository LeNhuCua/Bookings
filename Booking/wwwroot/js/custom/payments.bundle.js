addEventListener('load', async () => {
    const urlSearchParams = new URLSearchParams(location.search);

    if (!urlSearchParams.has('booking') && !urlSearchParams.has('partner') && !urlSearchParams.has('selection')) {
        return;
    }

    const createButton = document.querySelector('#hidden-create-payment');
    const aElement = document.querySelector('a[data-bs-target="#modal-create-payment"]');
    createButton.dispatchEvent(new Event('click'));
    await createPayment(aElement);
});

const renderSelectionDebts = async (modal) => {
    const paymentDefaultDOM = modal.querySelector('#paymentDefault');
    paymentDefaultDOM.classList.add('d-none');

    const selection = new URLSearchParams(location.search).get('selection').split(',');
    const data = selection.map(item => {
        const [type, id] = item.split(':');
        return {
            type,
            id,
        };
    });

    const ticketCodes = data.filter(item => item.type === '1')
        .map(item => item.id);
    const bookingHotels = data.filter(item => item.type === '2')
        .map(item => item.id);
    const bookingServices = data.filter(item => item.type === '3')
        .map(item => item.id);
    
    const payload = {
        ticketCodes,
        bookingHotels,
        bookingServices,
    };

    const response = await fetch('/Payments/SelectionDebt', {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        method: 'post',
    });
    const responseText = await response.text();

    modal.querySelector('#payment-debt').innerHTML = responseText;
}

/**
 * @param {HTMLButtonElement} element - HTML element that triggered the function.
 * @param {Event} event - Event object with preventDefault method.
 */
const createPayment = async (element, event) => {
    event?.preventDefault();
    const modal = document.querySelector('#modal-create-payment');
    const modalContent = modal.querySelector('.modal-content');
    const href = element.href;
    const response = await fetch(href);
    const responseText = await response.text();
    modalContent.innerHTML = responseText;

    initTabs();
    
    const paymentGroupDOM = modal.querySelector('[data-items="paymentGroup"]');
    $(paymentGroupDOM).on('select2:select', async (event) => {
        const paymentGroupID = event.target.value;
        const response = await fetch(`/Payments/GetPaymentTypes/${paymentGroupID}`);
        const paymentTypes = await response.json();

        const paymentTypeSelectDOM = modal.querySelector('[data-items="paymentTypes"]');
        paymentTypeSelectDOM.innerHTML = `
            <option value="">Loại phiếu chi</option>
            ${paymentTypes.map(paymentType => `
                <option value="${paymentType.id}">${paymentType.name}</option>
                `).join('')}
        `;
    });

    const bookingSelectDOM = modal.querySelector('[data-items="booking"]');
    $(bookingSelectDOM).on('select2:select', async (event) => {
        const bookingID = event.target.value;
        const paymentDefaultDOM = modal.querySelector('#paymentDefault');
        bookingID === ''
            ? paymentDefaultDOM.classList.remove('d-none')
            : paymentDefaultDOM.classList.add('d-none');
            
        const response = await fetch(`/Payments/BookingDebt/${bookingID}`);
        const responseText = await response.text();
        modal.querySelector('#payment-debt').innerHTML = responseText;
    });

    const partnerSelectDOM = modal.querySelector('[data-items="partner"]');
    $(partnerSelectDOM).on('select2:select', async (event) => {
        const partnerID = event.target.value;
        const paymentDefaultDOM = modal.querySelector('#paymentDefault');
        partnerID === ''
            ? paymentDefaultDOM.classList.remove('d-none')
            : paymentDefaultDOM.classList.add('d-none');

        const response = await fetch(`/Payments/PartnerDebt/${partnerID}`);
        const responseText = await response.text();
        modal.querySelector('#payment-debt').innerHTML = responseText;
    });
    
    initTinymce();
    $('#modal-create-payment [data-control="select2"]').select2({
        dropdownParent: modal
    });
    initFMultiSelect();

    // trigger lại sự kiện onchange khi đổi qua lại giữa 2 tab theo đơn hàng và theo đối tác
    modal.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', event => {
            const currentTargetButton = event.target;
            const currentTargetTab = modal.querySelector(currentTargetButton.dataset.bsTarget);
            const currentSelect = currentTargetTab.querySelector('select');
            triggerSelect2Change(currentSelect, currentSelect.value);
        });
    });
    
    const urlSearchParams = new URLSearchParams(location.search);
    if (urlSearchParams.has('booking')) {
        const bookingID = urlSearchParams.get('booking');
        triggerSelect2Change(bookingSelectDOM, bookingID);
    } else if (urlSearchParams.has('partner')) {
        document.querySelector('[data-bs-target="#by-partner-tab"]').tab.show();
        const partnerID = urlSearchParams.get('partner');
        triggerSelect2Change(partnerSelectDOM, partnerID);
    } else if (urlSearchParams.has('selection')) {
        renderSelectionDebts(modal);
    }
};