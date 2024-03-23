/**
 * @event shown, hidden
 * @example
 *  <button data-url="/partners/create"
 *      class="btn btn-primary"
 *      data-modal tooltip="Thêm mới"
 *      id="create-partner-button"
 *  >
 *      Test
 *  </button>
 * Thêm sự kiện shown:
 * button.addEventListener('shown', myEvent)
 * @param {HTMLElement} element 
 */
const fAjaxModal = async (element) => {
    if (element.modal) {
        return;
    }

    const modalRootClass = element.dataset.rootClass || 'fade';
    const modalDialogClass = element.dataset.dialogClass || 'modal-dialog-centered mw-650px';
    const { backdrop = true, focus = true, keyboard = true } = element.dataset;

    const modalId = KTUtil.getUniqueId('modal-');
    document.body.insertAdjacentHTML(
        'beforeend',
        /* html */`
        <div data-modal-id="${modalId}" class="modal ${modalRootClass}" tabindex="-1" aria-modal="true" role="dialog">
            <div class="modal-dialog ${modalDialogClass}"></div>
        </div>
        `
    );
    const modalDOM = document.querySelector(`[data-modal-id="${modalId}"]`);
    const modal = new bootstrap.Modal(modalDOM, {
        keyboard,
        backdrop,
        focus,
    });
    modal.id = modalId;
    modal.selector = `[data-modal-id="${modalId}"]`;

    const { url } = element.dataset;
    const response = await fetch(url);
    const responseText = await response.text();
    modalDOM.querySelector('.modal-dialog').innerHTML = responseText;

    modalDOM.addEventListener('shown.bs.modal', () => {
        element.dispatchEvent(new Event('shown'));
    });
    modalDOM.addEventListener('hidden.bs.modal', () => {
        element.dispatchEvent(new Event('hidden'));
    });

    element.modal = modal;
};

const initFAjaxModal = () => {
    document.querySelectorAll('[data-modal]').forEach(element => {
        element.addEventListener('click', async () => {
            // ngăn click khi đang load
            if (element.hasAttribute('data-modal-loading')) {
                return;
            }

            if (!element.modal) {
                element.setAttribute('data-modal-loading', '');
                await fAjaxModal(element);
                element.removeAttribute('data-modal-loading');
            }
            element.modal.show();
        });
    });
};

initFAjaxModal();