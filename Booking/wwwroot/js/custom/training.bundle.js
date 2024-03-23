const CreateTrainingCategory = async () => {
    let fetchTraining = await fetch( `/Training/CreateTrainingCategory` );
    let dataTraining = fetchTraining.json();
    const parentModalDOM = document.querySelector( '#modal-create-training-category' );
    const modalBody = parentModalDOM.querySelector( '.modal-body' );
    const createFormDOM = parentModalDOM.querySelector( '#create-training-category-form' );
    const tmp = createFormDOM.children[ '__RequestVerificationToken' ];
    //createFormDOM.innerHTML = '';
    await dataTraining.then( result => {
        if ( result.isPermission === false ) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            createFormDOM.insertAdjacentHTML( 'afterbegin', createTrainingCategoryDOM( result ) );
        }
    } );
    createFormDOM.append( tmp );

    const btnSubmit = createFormDOM.querySelector( '#submit-form-create-training' );
    const btnRemove = parentModalDOM.querySelectorAll( '.remove-form' );
    let sl2 = createFormDOM.querySelectorAll( 'select[data-control="training-create-select2"]' );

    var validator = FormValidation.formValidation(
        createFormDOM,
        {
            fields: {
                'Title': {
                    validators: {
                        notEmpty: {
                            message: 'Tên loại đào tạo chưa được nhập!'
                        }
                    }
                },
            },

            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5( {
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                } )
            }
        }
    );

    btnSubmit.addEventListener( 'click', function ( e ) {
        e.preventDefault();
        if ( validator ) {
            validator.validate().then( function ( status ) {
                if ( status === 'Valid' ) {
                    createFormDOM.submit();
                }
            } );
        }
    } );
    btnRemove.forEach( e => {
        e.addEventListener( 'click', function ( e ) {
            validator.resetForm();
            sl2.forEach( e => {
                $( e ).val( '' ).trigger( 'change' );
            } );
            // createTraining()
        } );
    } );
    var elements = Array.prototype.slice.call( document.querySelectorAll( "[data-bs-stacked-modal]" ) );

    if ( elements && elements.length > 0 ) {
        elements.forEach( ( element ) => {
            if ( element.getAttribute( "data-kt-initialized" ) === "1" ) {
                return;
            }

            element.setAttribute( "data-kt-initialized", "1" );

            element.addEventListener( "click", function ( e ) {
                e.preventDefault();

                const modalEl = document.querySelector( this.getAttribute( "data-bs-stacked-modal" ) );

                if ( modalEl ) {
                    const modal = new bootstrap.Modal( modalEl );
                    modal.show();
                }
            } );
        } );
    }
};



const EditTrainingCategory = async (id) => {
    const trainingId = id;
    const response = await fetch( `/Training/EditTrainingCategory/${ trainingId }` );
    const data = await response.json();
    const parentModalDOM = document.querySelector( `#modal-edit-training-category-${ trainingId }` );
    const modalBody = parentModalDOM.querySelector( `.modal-body` );
    /** @type {HTMLFormElement} */

    const editFormDOM = parentModalDOM.querySelector(`#edit-training-category-form-${trainingId}`);
    if ( data.isPermission === false ) {
        modalBody.innerHTML = WarningTemplateDOM();
    } else {
        editFormDOM.insertAdjacentHTML("afterbegin", editTrainingCategoryDOM(data.trainingCategory, data ) );
    }
    const btnSubmit = editFormDOM.querySelector( `#submit-form-edit-training-category-${ trainingId }` );
   
    var validator = FormValidation.formValidation(
        editFormDOM,
        {
            fields: {
                'Title': {
                    validators: {
                        notEmpty: {
                            message: 'Tên loại đào tạo chưa được nhập!'
                        }
                    }
                },
            },

            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                })
            }
        }
    );

    btnSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        if (validator) {
            validator.validate().then(function (status) {
                if (status === 'Valid') {
                    editFormDOM.submit();
                }
            });
        }
    });
    const btnRemove = parentModalDOM.querySelectorAll('.remove-form');
    btnRemove.forEach(e => {
        e.addEventListener('click', function (e) {
            validator.resetForm();
        });
    });
};


//danh sách đào tạo
const CreateTraining = async () => {
    let fetchTraining = await fetch( `/Training/CreateTraining` );
    let dataTraining = fetchTraining.json();
    const parentModalDOM = document.querySelector( '#modal-create-training' );
    const modalBody = parentModalDOM.querySelector('.modal-body');
    
    const createFormDOM = parentModalDOM.querySelector( '#create-training-form' );
    const tmp = createFormDOM.children[ '__RequestVerificationToken' ];
    //createFormDOM.innerHTML = '';
    await dataTraining.then( result => {
        if ( result.isPermission === false ) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            
            createFormDOM.insertAdjacentHTML( 'afterbegin', createTrainingDOM( result ) );
            initTinymce();
            // $('[data-control="training-create-select2"]').select2({
            //     dropdownParent: parentModalDOM
            // });
        }
    });

    const btnSubmit = createFormDOM.querySelector( '#submit-form-create-training' );
    const btnRemove = parentModalDOM.querySelectorAll( '.remove-form' );

    createFormDOM.append(tmp);
    var idField = document.createElement('input');
  
    var validator = FormValidation.formValidation(
        createFormDOM,
        {
            fields: {
                'Title': {
                    validators: {
                        notEmpty: {
                            message: 'Tên đào tạo chưa được nhập!'
                        }
                    }
                },
            },

            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5( {
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                } )
            }
        }
    );

    btnSubmit.addEventListener( 'click', function ( e ) {
        e.preventDefault();
        if ( validator ) {
            validator.validate().then( function ( status ) {
                if (status === 'Valid') {
                  

                    createFormDOM.submit();
                }
            } );
        }
    } );
    
    btnRemove.forEach(e => {
        e.addEventListener( 'click', function ( e ) {
            validator.resetForm();
        } );
    } );
};


const EditTraining = async (id) => {
    const trainingId = id;
    const response = await fetch(`/Training/EditTraining/${trainingId}`);
    const data = await response.json();
    const parentModalDOM = document.querySelector(`#modal-edit-training-${trainingId}`);

    const modalBody = parentModalDOM.querySelector(`.modal-body`);

    const editFormDOM = parentModalDOM.querySelector(`#edit-training-form-${trainingId}`);

    if (data.isPermission === false) {
        modalBody.innerHTML = WarningTemplateDOM();
    } else {
        editFormDOM.insertAdjacentHTML("afterbegin", editTrainingDOM(data.training, data));
        initTinymce();
    }

    const btnSubmit = editFormDOM.querySelector(`#submit-form-edit-training-${trainingId}`);

    var validator = FormValidation.formValidation(
        editFormDOM,
        {      
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                })
            }
        }
    );

};



const ClickShowContent = ( id ) => {
    const parentDOM = document.querySelector( '#kt_content' );
    const showContentBtn = parentDOM.querySelector( `#btnShowContent-${ id }` );
    const form = parentDOM.querySelector( `#formShowContent-${ id }` );
    showContentBtn.addEventListener( 'click', ( e ) => {
        form.submit();
        window.location.href = `/Training?categoryID=${ id }`;
    } );
};