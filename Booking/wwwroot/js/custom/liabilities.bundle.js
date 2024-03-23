const openDebtDetails = async (element, event) => {
    event.preventDefault();
    if (element.dataset.loaded) {
        return;
    }
    element.dataset.loaded = true;
    const targetDivDOM = document.querySelector(element.dataset.bsTarget);

    const response = await fetch(element.href);
    const responseText = await response.text();
    targetDivDOM.innerHTML = responseText;
};

const paySelection = () => {
    const formDOM = document.querySelector('form[name="partner-debt"]');
    const formData = new FormData(formDOM);

    const selection = formData.getAll('selection').join(',');
    if (!selection) { 
        return;
    }
    location.href = `${formDOM.action}?selection=${selection}`;
}