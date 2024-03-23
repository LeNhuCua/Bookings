addEventListener('load', (event) => {
    if (!new URLSearchParams(location.search).has('customer')) {
        return;
    }

    const createButton = document.querySelector('#hidden-create-receipt');
    const aElement = document.querySelector('a[data-bs-target="#modal-create-receipt"]');
    createButton.dispatchEvent(new Event('click'));
    createReceipt(aElement);
});

const getReceiptDebtDetails = async (modal, customerID) => {
    if (!customerID) {
        return;
    }

    const isReceivedByPartner = modal.querySelector('input[name="receivedByPartner"]').checked;
    const debtType = isReceivedByPartner ? 'ReceivedByPartnerDebt' : 'Debt';

    const response = await fetch(`/Receipts/${debtType}/${customerID}`);
    const responseText = await response.text();
    modal.querySelector('#receipt-debt').innerHTML = responseText;
    $('#receipt-debt [data-control="select2"]').select2({
        dropdownParent: modal,
    });
};

const getReceivedFromPartnerDebtDetails = async (modal, partnerID) => {
    if (!partnerID) {
        return;
    }

    const response = await fetch(`/Receipts/ReceivedFromPartnerDebt/${partnerID}`);
    const responseText = await response.text();
    modal.querySelector('#receipt-debt').innerHTML = responseText;
    $('#receipt-debt [data-control="select2"]').select2({
        dropdownParent: modal,
    });
};

const createReceipt = async (element, event) => {
    event?.preventDefault();
    const modal = document.querySelector('#modal-create-receipt');
    const modalContent = modal.querySelector('.modal-content');
    const href = element.href;
    const response = await fetch(href);
    const responseText = await response.text();
    modalContent.innerHTML = responseText;

    initTabs();

    // tinymce.init({
    //     selector: '.tinymce'
    // });
    initTinymce();

    $('#modal-create-receipt [data-control="select2"]').select2({
        dropdownParent: modal,
    });

    const customerSelectDOM = modal.querySelector('[data-items="customer"]');
    $(customerSelectDOM).on('select2:select', async (event) => {
        const customerID = event.target.value;
        getReceiptDebtDetails(modal, customerID);
    });

    const partnerSelectDOM = modal.querySelector('[data-items="partner"]');
    $(partnerSelectDOM).on('select2:select', async (event) => {
        const partnerID = event.target.value;
        getReceivedFromPartnerDebtDetails(modal, partnerID);
    });

    const receivedByPartnerCheckboxWrapperDOM = modal.querySelector('#received-by-partner');
    const receivedByPartnerCheckboxDOM = modal.querySelector('input[name="receivedByPartner"]');
    const receivedFromPartnerCheckboxDOM = modal.querySelector('input[name="receivedFromPartner"]');

    const customerTabDOM = modal.querySelector('[data-bs-target="#customer-tab"]');
    customerTabDOM.addEventListener('click', () => {
        receivedFromPartnerCheckboxDOM.checked = false;
        receivedByPartnerCheckboxWrapperDOM.classList.remove('d-none');
    });

    const partnerTabDOM = modal.querySelector('[data-bs-target="#partner-tab"]');
    partnerTabDOM.addEventListener('click', () => {
        receivedByPartnerCheckboxDOM.checked = false;
        receivedFromPartnerCheckboxDOM.checked = true;
        receivedByPartnerCheckboxWrapperDOM.classList.add('d-none');
    })

    receivedByPartnerCheckboxDOM.addEventListener('change', (event) => {
        getReceiptDebtDetails(modal, customerSelectDOM.value);
    });

    // trigger lại sự kiện onchange khi đổi qua lại giữa 2 tab khách hàng và đối tác
    modal.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', event => {
            const currentTargetButton = event.target;
            const currentTargetTab = modal.querySelector(currentTargetButton.dataset.bsTarget);
            const currentSelect = currentTargetTab.querySelector('select');
            triggerSelect2Change(currentSelect, currentSelect.value);
        });
    });

    const urlSearchParams = new URLSearchParams(location.search);
    if (new URLSearchParams(location.search).has('customer')) {
        const customerID = urlSearchParams.get('customer');
        triggerSelect2Change(customerSelectDOM, customerID);
    }
};