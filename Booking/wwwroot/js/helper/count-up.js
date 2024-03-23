/**
 * @param {HTMLElement} element 
 * @param {number} value
 * @param {Record<string, unknown>} options 
 * @returns 
 */
const fCountUp = (element, value, options) => {
    const _countUp = new countUp.CountUp(
        element,
        value,
        {
            startVal: element.dataset.value || 0,
            ...options,
        }
    );
    _countUp.start(() => element.setAttribute('data-value', _countUp.endVal));
    element.countUp = _countUp;
    return _countUp;
};

/**
 * @example
 * <span data-f-count-up>0</span>
 */
const initFCountUp = () => {
    document.querySelectorAll('[data-f-count-up]').forEach(element => {
        fCountUp(element);
    });
};

initFCountUp();
