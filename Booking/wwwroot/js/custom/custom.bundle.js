"use strict";
let modalNodeChangeObserver = null;

const listenToDomChange = ( target, observer ) => {
    observer.observe(
        target,
        {
            childList: true,
            subtree: true,
        }
    );
};

const hideBootstrapModal = bootstrap.Modal.prototype.hide;
bootstrap.Modal.prototype.hide = function () {
    hideBootstrapModal.call( this );
    modalNodeChangeObserver?.disconnect();
};

const initSpecialInput = () => {
    $( '#modal-dialog-crud' ).find( '[data-date-time="flatpickr"]' ).each( ( _, element = new HTMLSelectElement() ) => {
        $( element ).flatpickr( {
            altInput: true,
            altFormat: "Y-m-d",
            dateFormat: "Y-m-d"
        } );
        const inputs = element.parentElement.querySelectorAll( ':scope > input' );
        const [ __, ___, duplicateInput ] = inputs;
        duplicateInput && duplicateInput.remove();
    } );
    $( '#modal-dialog-crud' ).find( '[data-control="select2"]' ).each( ( _, element = new HTMLSelectElement() ) => {
        $( element ).select2( {
            dropdownParent: $( "#placeholder-modal-crud" )
        } );
        const spans = element.parentElement.querySelectorAll( ':scope > span' );
        const [ __, duplicateSpan ] = spans;
        duplicateSpan && duplicateSpan.remove();
    } );
};

const initModal = () => {
    // Shared variables
    const modalCrudPortal = document.getElementById( 'placeholder-modal-crud' );
    const modalElement = document.getElementById( 'modal-dialog-crud' );
    let modal = null;

    document.body.addEventListener( 'click', async ( event ) => {
        const target = event.target;
        if ( !target.classList.contains( 'data-partial-view' ) ) {
            return;
        }
        event.preventDefault();
        modalNodeChangeObserver && modalNodeChangeObserver.disconnect();
        target.classList.add( 'disabled' );
        let href = target.getAttribute( 'href' );
        // backward compatibility
        let width = [ target.getAttribute( 'data-width' ), target.classList ].join( ' ' );

        if ( width.indexOf( 'fullscreen' ) > -1 ) {
            modalElement.className = 'modal-dialog modal-dialog-centered modal-fullscreen p-9';
        } else if ( width.indexOf( 'modal-xl' ) > -1 ) {
            modalElement.className = 'modal-dialog modal-dialog-centered modal-xl';
        } else if ( width.indexOf( 'mw-1000px' ) > -1 ) {
            modalElement.className = 'modal-dialog modal-dialog-centered mw-1000px';
        }
        else {
            modalElement.className = 'modal-dialog modal-dialog-centered mw-650px';
        }
        console.log( "modalElement", modalElement );
        modal = modal ?? new bootstrap.Modal( modalCrudPortal, {
            keyboard: false,
            backdrop: "static"
        } );
        const response = await fetch( href );
        if ( response.redirected ) {
            location.href = response.url;
        }
        if ( response.ok ) {
            const text = await response.text();
            modal.show();
            modalElement.innerHTML = text;
            initSpecialInput();
        }
        target.classList.remove( 'disabled' );
        const form = modalCrudPortal.querySelector( 'form' );
        bindForm( form );
        // lắng nghe sự kiện thay đổi của DOM, mỗi khi node trong modal thay đổi (thêm, xóa node)
        // thì các input select2, flatpickr sẽ được đặt lại
        modalNodeChangeObserver = new MutationObserver( ( _, observer ) => {
            observer.disconnect();
            initSpecialInput();
            listenToDomChange( modalElement, observer );
        } );
        listenToDomChange( modalElement, modalNodeChangeObserver );
    } );

    /**
     * @param {HTMLFormElement} form 
     */
    function bindForm( form ) {
        form?.addEventListener( 'submit', async ( event ) => {
            event.preventDefault();
            const submitButton = event.submitter;
            submitButton.disabled = true;
            // TODO: add data-deleted-items
            form.querySelectorAll( '.input-currency' ).forEach(
                element => {
                    element.value = parseFloat( element.value.toString().replace( /,/g, "" ) );
                }
            );
            if ( form.dataset.ajaxForm ) {
                await fetch( form.action, {
                    body: new FormData( form ),
                    method: form.method,
                } );
                return location.reload();
            }
            // FIXME: temporarily fix
            form.submit();
            // const formData = new FormData(form);
            // submitButton.classList.add('disabled');
            // const response = await fetch(form.action, {
            //     body: formData,
            //     method: form.method,
            // });
            // if (response.redirected) {
            //     location.href = response.url;
            //     return;
            // }
            // const responseText = await response.text();
            // if (response.status >= 500 || !responseText) {
            //     location.reload();
            //     return;
            // }
            // submitButton.classList.remove('disabled');
            // modalElement.innerHTML = responseText;
        } );
    }
};

// Class definition
const initForm = () => {
    const formFilter = document.querySelector( '[data-kt-search-element="form"]' );

    // const options = {
    //     selector: ".tinymce_basic",
    //     branding: false,
    //     height: 200
    // };
    // tinymce.init( options );

    if ( formFilter ) {
        const select = formFilter.querySelector( '[data-select-change="submit"]' );
        if ( select ) {
            $( select ).on( 'change', function ( e ) {
                $( this ).closest( 'form' ).submit();
            } );
        }
    }
};

initForm();
initModal();

const submitFormAJAX = async ( formElement ) => {
    const formData = new FormData( formElement );
    await fetch( formElement.action, {
        method: formElement.method,
        body: formData,
    } );
    location.reload();
};

