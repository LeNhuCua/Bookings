/**
 * @param {string} selector @default [selector='[data-bs-toggle="tab"]']
 */
const initTabs = (selector = '[data-bs-toggle="tab"]') => {
    document.querySelectorAll(selector).forEach(tabEl => {
        if (tabEl.tab) {
            return;
        }
        const tabTrigger = new bootstrap.Tab(tabEl);

        tabEl.addEventListener('click', event => {
            event.preventDefault();
            tabTrigger.show();
        });

        tabEl.tab = tabTrigger;
    });
};
