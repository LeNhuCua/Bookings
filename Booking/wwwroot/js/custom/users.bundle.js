"use strict";
const createUser = async () => {
    let fetchUser = await fetch('/Users/Create')
    let dataUser = fetchUser.json();
    const parentModalDOM = document.querySelector('#modal-create-user');
    const modalBody = parentModalDOM.querySelector('.modal-body');
    const createFormDOM = parentModalDOM.querySelector('#create-user-form');

    await dataUser.then(result => {
        if(result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            createFormDOM.insertAdjacentHTML("afterbegin", createUserDOM(result));
            $('[data-control="select2"]').select2({
                dropdownParent: parentModalDOM
            });
        }
    })

    const btnSubmit = createFormDOM.querySelector('#submit-form-create-user');
    const btnRemove = parentModalDOM.querySelectorAll('.remove-form');

    var validator = FormValidation.formValidation(
        createFormDOM,
        {
            fields: {
                'FirstMidName': {
                    validators: {
                        notEmpty: {
                            message: 'Họ và tên đệm của người dùng không được để trống!'
                        }
                    }
                },
                'LastName': {
                    validators: {
                        notEmpty: {
                            message: 'Tên của người dùng không được để trống!'
                        }
                    }
                },
                'Phone': {
                    validators: {
                        notEmpty: {
                            message: 'Số điện thoại của người dùng không được để trống!'
                        }
                    }
                },
                'Email': {
                    validators: {
                        notEmpty: {
                            message: 'Email không được để trống!'
                        }
                    }
                },
                'Gender': {
                    validators: {
                        notEmpty: {
                            message: 'Giới tính chưa được chọn!'
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
                    createFormDOM.submit();
                }
            });
        }
    });
    btnRemove.forEach(e => {
        e.addEventListener('click', function(e) {
            validator.resetForm();
        })
    });
}

const editUser = async (id) => {
    const userId = id;
    let fetchUser = await fetch(`/Users/Edit/${userId}`)
    let dataUser = fetchUser.json();
    const parentModalDOM = document.querySelector(`#modal-edit-user-${userId}`);
    const modalBody = parentModalDOM.querySelector('.modal-body');
    const editFormDOM = parentModalDOM.querySelector(`#edit-user-form-${userId}`);
    const btnSubmit = editFormDOM.querySelector(`#submit-form-edit-user-${userId}`);
    const btnRemove = parentModalDOM.querySelectorAll('.remove-form');
    dataUser.then(result => {
        if(result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            editFormDOM.insertAdjacentHTML("afterbegin", editUserDOM(result.user, result, userId));
            $('[data-control="select2"]').select2({
                dropdownParent: parentModalDOM
            });
        }
    })
    // btnSubmit.addEventListener('click', (e) => {
    //     // e.preventDefault()
    //     let a = editFormDOM.querySelector('[name="Birthday"]');
    //    
    //     let v = a.value;
    //     console.log(a.value)
    //     a.value = new Date(v).toLocaleString();
    //     console.log(a.value)
    // })
    var validator = FormValidation.formValidation(
        editFormDOM,
        {
            fields: {
                'FirstMidName': {
                    validators: {
                        notEmpty: {
                            message: 'Họ và tên đệm của người dùng không được để trống!'
                        }
                    }
                },
                'LastName': {
                    validators: {
                        notEmpty: {
                            message: 'Tên của người dùng không được để trống!'
                        }
                    }
                },
                'Phone': {
                    validators: {
                        notEmpty: {
                            message: 'Số điện thoại của người dùng không được để trống!'
                        }
                    }
                },
                'Email': {
                    validators: {
                        notEmpty: {
                            message: 'Email không được để trống!'
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
    btnRemove.forEach(e => {
        e.addEventListener('click', function(e) {
            validator.resetForm();
        })
    });
}