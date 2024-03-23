/**
 * @param {HTMLElement} element 
 */
const fMultiSelect = (element) => {
    if (element.select2) return;
    const { dropdownParent, closeOnSelect } = element.dataset;
    if (!element.getAttribute('class')) {
        element.setAttribute('class', '');
    }

    $(element).select2({
        closeOnSelect: closeOnSelect || false,
        multiple: true,
        allowClear: true,
        dropdownParent: document.querySelector(dropdownParent || 'body'),
        // templateResult: (value) => {
        //     if (value && !value.selected) {
        //         return $('<span>' + value.text + '</span>');
        //     }
        // },
    });

    element.select2 = $(element).data('select2');
};

/**
 * @example
 * <select data-control="multiselect">
 *     <option value="1">1</option>
 * </select>
 */
const initFMultiSelect = () => {
    document.querySelectorAll('[data-control="multiselect"]').forEach(fMultiSelect);
};

initFMultiSelect();
