const CreateSalesPolicy = async () => {
    let fetchSalesPolicy = await fetch(`/SalesPolicies/Create`);
    let dataSalesPolicy = fetchSalesPolicy.json();
    const parentModalDOM = document.querySelector('#modal-create-sale-policy');
    const modalBody = parentModalDOM.querySelector('.modal-body');
    
    
    const createFormDOM = parentModalDOM.querySelector('#create-sale-policy-form');
    const tmp = createFormDOM.children[ '__RequestVerificationToken' ];
    await dataSalesPolicy.then(result => {
        if(result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            createFormDOM.insertAdjacentHTML("afterbegin", createSalesPolicyDOM(result));
            initTinymce();
            $('[data-control="select2"]').select2({
                dropdownParent: parentModalDOM
            });
        }
    })

    const btnSubmit = createFormDOM.querySelector( '#submit-form-create-sale-policy' );
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
                            message: 'Tiêu đề chính sách chưa được nhập!'
                        },
                        stringLength: {
                            max: 65,
                            message: 'Tiêu đề không vượt quá 65 ký tự!'
                        }
                    }
                },
                'SubTitle': {
                    validators: {
                        notEmpty: {
                            message: 'Tiêu đề phụ chưa được nhập!'
                        },
                        stringLength: {
                            max: 250,
                            message: 'Tiêu đề không vượt quá 65 ký tự!'
                        }
                    }
                },
                'FromDate': {
                    validators: {
                        notEmpty: {
                            message: 'Thời gian bắt đầu chưa được chọn!'
                        }
                    }
                },
                'ToDate': {
                    validators: {
                        notEmpty: {
                            message: 'Thời gian kết thúc chưa được chọn!'
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
}

const EditSalesPolicy = async (id) => {
    const salesPolicyId = id;
    let fetchSalesPolicy = await fetch(`/SalesPolicies/Edit/${salesPolicyId}`);
    let dataSalesPolicy = fetchSalesPolicy.json();
    const parentModalDOM = document.querySelector(`#modal-edit-sale-policy_${salesPolicyId}`);
    const modalBody = parentModalDOM.querySelector('.modal-body');

    const createFormDOM = parentModalDOM.querySelector(`#edit-sale-policy-form_${salesPolicyId}`);
    const tmp = createFormDOM.children[ '__RequestVerificationToken' ];
    await dataSalesPolicy.then(result => {
        if(result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            createFormDOM.insertAdjacentHTML("afterbegin", editSalesPolicyDOM(result.currentSalesPolicy));
            initTinymce();
            $('[data-control="select2"]').select2({
                dropdownParent: parentModalDOM,
            });
                selectOnClose: true
        }
    })

    
    const btnSubmit = createFormDOM.querySelector( '#submit-form-edit-sale-policy_' + salesPolicyId + '' );
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
                            message: 'Tiêu đề chính sách chưa được nhập!'
                        },
                        stringLength: {
                            max: 65,
                            message: 'Tiêu đề không vượt quá 65 ký tự!'
                        }
                    }
                },
                'SubTitle': {
                    validators: {
                        notEmpty: {
                            message: 'Tiêu đề phụ chưa được nhập!'
                        },
                        stringLength: {
                            max: 250,
                            message: 'Tiêu đề không vượt quá 65 ký tự!'
                        }
                    }
                },
                'FromDate': {
                    validators: {
                        notEmpty: {
                            message: 'Thời gian bắt đầu chưa được chọn!'
                        }
                    }
                },
                'ToDate': {
                    validators: {
                        notEmpty: {
                            message: 'Thời gian kết thúc chưa được chọn!'
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
}