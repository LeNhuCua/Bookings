const createPartnerButtonDOM = document.querySelector('#create-partner-button');
createPartnerButtonDOM.addEventListener('shown', initFMultiSelect);
addEventListener('load', (event) => {
    if (!new URLSearchParams(location.search).has('booking')) {
        return;
    }

    const createButton = document.querySelector('#hidden-create-payment');
    const aElement = document.querySelector('a[data-bs-target="#modal-create-payment"]');
    createButton.dispatchEvent(new Event('click'));
    createReceipt(aElement);
});
/**
 * @param {HTMLInputElement} element 
 */
const toggleServiceTypesSelect = (element) => {
    const serviceTypesSelectDOM = element.closest('form')
        .querySelector('#service-types-select');
    serviceTypesSelectDOM.classList.toggle('d-none');
};

document.querySelectorAll('.edit-partner').forEach(element => {
    element.addEventListener('shown', initFMultiSelect);
});