const CreateBooking = async () => {
    let fetchBooking = await fetch(`/Bookings/Create`);
    let dataBooking = fetchBooking.json();
    const parentModalDOM = document.querySelector('#modal-create-booking');
    const modalBody = parentModalDOM.querySelector('.modal-body');
    const createFormDOM = parentModalDOM.querySelector('#create-booking-form');
    const tmp = createFormDOM.children['__RequestVerificationToken'];
    createFormDOM.innerHTML = '';
    await dataBooking.then(result => {
        console.log("result", result)
        if (result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            createFormDOM.innerHTML = createBookingDOM(result);
            $('[data-control="booking-create-select2"]').select2({
                dropdownParent: parentModalDOM
            });
        }
    })
    createFormDOM.append(tmp);

    const btnSubmit = createFormDOM.querySelector('#submit-form-create-booking');
    const btnRemove = parentModalDOM.querySelectorAll('.remove-form');
    let sl2 = createFormDOM.querySelectorAll('select[data-control="booking-create-select2"]');

    var validator = FormValidation.formValidation(
        createFormDOM,
        {
            fields: {
                'CustomerID': {
                    validators: {
                        notEmpty: {
                            message: 'Khách hàng chưa được chọn!'
                        }
                    }
                },
                'BookingType': {
                    validators: {
                        notEmpty: {
                            message: 'Loại đơn hàng chưa được chọn!'
                        }
                    }
                },
                'DestinationID': {
                    validators: {
                        notEmpty: {
                            message: 'Điểm đến chưa được chọn!'
                        }
                    }
                },
                'DepartureDay': {
                    validators: {
                        notEmpty: {
                            message: 'Ngày khởi hành chưa được chọn!'
                        }
                    }
                },
                'EndDate': {
                    validators: {
                        notEmpty: {
                            message: 'Ngày khởi hành chưa được chọn!'
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
    // $(createFormDOM.querySelector('[name="CustomerID"]')).on('change', function () {
    //     // Revalidate the field when an option is chosen
    //     validator.revalidateField('CustomerID');
    // });
    // $(createFormDOM.querySelector('[name="BookingType"]')).on('change', function () {
    //     // Revalidate the field when an option is chosen
    //     validator.revalidateField('BookingType');
    // });
    // $(createFormDOM.querySelector('[name="DestinationID"]')).on('change', function () {
    //     // Revalidate the field when an option is chosen
    //     validator.revalidateField('DestinationID');
    // });
    btnSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        if (validator) {
            validator.validate().then(function (status) {
                if (status === 'Valid') {
                    createFormDOM.submit();
                }
            });
        }
    })
    btnRemove.forEach(e => {
        e.addEventListener('click', function (e) {
            validator.resetForm();
            sl2.forEach(e => {
                $(e).val('').trigger('change');
            })
            // createBooking()
        })
    });
    var elements = Array.prototype.slice.call(document.querySelectorAll("[data-bs-stacked-modal]"));

    if (elements && elements.length > 0) {
        elements.forEach((element) => {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            element.setAttribute("data-kt-initialized", "1");

            element.addEventListener("click", function (e) {
                e.preventDefault();

                const modalEl = document.querySelector(this.getAttribute("data-bs-stacked-modal"));

                if (modalEl) {
                    const modal = new bootstrap.Modal(modalEl);
                    modal.show();
                }
            });
        });
    }
};

const EditBooking = async (id) => {
    const bookingId = id;
    const response = await fetch(`/Bookings/Edit/${bookingId}`);
    const data = await response.json();

    const parentModalDOM = document.querySelector(`#modal-edit-booking-${bookingId}`);
    const modalBody = parentModalDOM.querySelector(`.modal-body`);
    /** @type {HTMLFormElement} */
    const editFormDOM = parentModalDOM.querySelector(`#edit-booking-form-${bookingId}`);

    if (data.isPermission === false) {
        modalBody.innerHTML = WarningTemplateDOM();
    } else {
        editFormDOM.insertAdjacentHTML("afterbegin", editBookingDOM(data.booking, data, bookingId));
        $('[data-control="booking-edit-select2"]').select2({
            dropdownParent: parentModalDOM
        });
    }

    const btnSubmit = editFormDOM.querySelector(`#submit-form-edit-booking-${bookingId}`);

    var validator = FormValidation.formValidation(
        editFormDOM,
        {
            fields: {
                'CustomerID': {
                    validators: {
                        notEmpty: {
                            message: 'Khách hàng chưa được chọn!'
                        }
                    }
                },
                'BookingType': {
                    validators: {
                        notEmpty: {
                            message: 'Loại đơn hàng chưa được chọn!'
                        }
                    }
                },
                'DestinationID': {
                    validators: {
                        notEmpty: {
                            message: 'Điểm đến chưa được chọn!'
                        }
                    }
                },
                'DepartureDay': {
                    validators: {
                        notEmpty: {
                            message: 'Ngày khởi hành chưa được chọn!'
                        }
                    }
                },
                'EndDate': {
                    validators: {
                        notEmpty: {
                            message: 'Ngày khởi hành chưa được chọn!'
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

    editFormDOM.addEventListener('submit', async (event) => {
        event.preventDefault();
        btnSubmit.disabled = true;
        const status = await validator.validate();
        if (status !== 'Valid') {
            return;
        }

        await fetch(editFormDOM.action, {
            body: new FormData(editFormDOM),
            method: editFormDOM.method,
        });
        location.reload();
    });
}

function uuidv4() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

const CreateCustomerBooking = async () => {
    let fetchCustomer = await fetch('/Customers/Create')
    let dataCustomer = fetchCustomer.json();
    const parentModalDOM = document.querySelector('#modal-create-customer');
    const modalBody = parentModalDOM.querySelector(`.modal-body`);
    const createFormDOM = parentModalDOM.querySelector('#create-customer-form');
    const tmp = createFormDOM.children['__RequestVerificationToken'];
    createFormDOM.innerHTML = '';
    createFormDOM.append(tmp);
    await dataCustomer.then(result => {
        console.log('perm', result);
        if (result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            const vocatives = [];
            for (const key in result.vocatives) {
                vocatives.push({ id: key, name: result.vocatives[key] });
            };
            createFormDOM.insertAdjacentHTML('afterbegin', createCustomerBookingDOM(result));
            $('[name="Gender"]').on('select2:select', e => {
                const genderId = e.params.data.id;
                const voca = createFormDOM.querySelector('[name="Vocative"]');
                if(genderId == 1) {
                    voca.innerHTML = buildOptions(vocatives, 'id', 'name', "Anh")
                } else {
                    voca.innerHTML = buildOptions(vocatives, 'id', 'name', "Chị")
                }
            });
            $('[data-control="select2"]').select2({
                dropdownParent: parentModalDOM
            });
        }
    })

    const btnSubmit = createFormDOM.querySelector('#submit-form-create-customer-booking');
    const btnRemove = parentModalDOM.querySelectorAll('.remove-form');

    var validator = FormValidation.formValidation(
        createFormDOM,
        {
            fields: {
                'FirstMidName': {
                    validators: {
                        notEmpty: {
                            message: 'Họ và tên đệm của khách hàng không được để trống!'
                        }
                    }
                },
                'LastName': {
                    validators: {
                        notEmpty: {
                            message: 'Tên của khách hàng không được để trống!'
                        }
                    }
                },
                'Phone': {
                    validators: {
                        notEmpty: {
                            message: 'Số điện thoại của khách hàng không được để trống!'
                        }
                    }
                },
                'Vocative': {
                    validators: {
                        notEmpty: {
                            message: 'Danh xưng chưa được chọn!'
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
                'ProvinceID': {
                    validators: {
                        notEmpty: {
                            message: 'Tỉnh/Thành phố chưa được chọn!'
                        }
                    }
                },
                'CustomerTypeID': {
                    validators: {
                        notEmpty: {
                            message: 'Loại khách hàng chưa được chọn!'
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
        var formData = new FormData(createFormDOM);
        if (validator) {
            validator.validate().then(function (status) {
                if (status === 'Valid') {
                    $.ajax({
                        type: 'POST',
                        url: '/Customers/Create',
                        contentType: false,
                        processData: false,
                        cache: false,
                        data: formData,
                        success: function (data) {
                            createFormDOM.reset();
                            $('#modal-create-customer').modal('hide');
                            CreateBooking()
                        },
                        error: function (e) {
                            console.log('eror', e)
                        }
                    });
                }
            });
        }
    });

    let sl2 = createFormDOM.querySelectorAll('select[data-control="select2"]');

    btnRemove.forEach(e => {
        e.addEventListener('click', function (e) {
            validator.resetForm();
            sl2.forEach(e => {
                $(e).val('').trigger('change');
            })
            // CreateBooking()
        })
    });
}

const AddTicket = async (id) => {
    const bookingId = id;
    let fetchBookingTicket = await fetch(`/Bookings/AddTicket/${bookingId}`);

    let dataBookingTicket = await fetchBookingTicket.json();

    const parentModalDOM = document.querySelector(`#modal-booking-ticket-${bookingId}`);
    const ticketCodeFormDOM = parentModalDOM.querySelector(`#add-ticket-form-${bookingId}`);
    const ticketCodeListDOM = ticketCodeFormDOM.querySelector(`#ticket-code-list-${bookingId}`);
    const bookingPersonTicket = ticketCodeFormDOM.querySelector(`#booking-person-ticket-${bookingId}`);

    // const navDOM = ticketCodeFormDOM.querySelector(`#nav-booking-${bookingId}`);


    // dataBookingTicket.ages.forEach((e,index) => {
    //    
    //     console.log(e.bookingPersons.filter(b => b.bookingID === bookingId))
    // })

    bookingPersonTicket.insertAdjacentHTML("afterbegin", dataBookingTicket.ticketCodes.map((ticketCode, index) => bookingTicketPersonDOM(ticketCode.id, dataBookingTicket, bookingId, index)).join(''));
    ticketCodeListDOM.insertAdjacentHTML("afterbegin", dataBookingTicket.ticketCodes.map(ticketCode => bookingTicketDOM(ticketCode, dataBookingTicket, bookingId)).join(''));
    $('[data-control="booking-addticket-select2"]').select2({
        dropdownParent: $(`#modal-booking-ticket-${bookingId}`)
    });


    $('[data-items="airlines"]').on('select2:select', function (e) {
        const ticketCodeParent = $(this).parent().parent().parent().parent().attr('id');
        let parentDOM = ticketCodeListDOM.querySelector(`#${ticketCodeParent}`);
        let selectFlightClass = parentDOM.querySelector('[data-items="flight-class"]');
        $.ajax({
            url: "/FlightClasses/GetFlightClassesByArlineId",
            method: "Get",
            data: { "airlineId": e.params.data.id },
            success: function (result) {
                $(selectFlightClass).empty();
                // let html = '<option value="">Chọn hãng vé</option>';
                if (result.length !== 0) {
                    $(selectFlightClass).append(new Option("Chọn hãng vé", "", false, false));
                    for (let i = 0; i < result.length; i++) {
                        // html += '<option value="' + result[i].id + '">' + result[i].name + '</option>';
                        $(selectFlightClass).append(new Option(result[i].name, result[i].id, false, false));
                    }
                } else {
                    $(selectFlightClass).append(new Option("Chọn hãng vé", "", false, false));
                }

                $(selectFlightClass).select2();
            }
        });
    })

    // const btnSubmit = ticketCodeFormDOM.querySelector(`#submit-form-addticket-${bookingId}`);
    // let validator = FormValidation.formValidation(
    //     ticketCodeFormDOM,
    //     {
    //         fields: {
    //             'TicketTypeID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Khách hàng chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'Code': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Loại đơn hàng chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'AirlineID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Điểm đến chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'FlightID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Ngày khởi hành chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'FlightClassID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Ngày khởi hành chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'PartnerID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Ngày khởi hành chưa được chọn!'
    //                     }
    //                 }
    //             },
    //         },
    //
    //         plugins: {
    //             trigger: new FormValidation.plugins.Trigger(),
    //             bootstrap: new FormValidation.plugins.Bootstrap5({
    //                 rowSelector: '.fv-row',
    //                 eleInvalidClass: '',
    //                 eleValidClass: ''
    //             })
    //         }
    //     }
    // );
    //
    // btnSubmit.addEventListener('click', function (e) {
    //     e.preventDefault();
    //     if (validator) {
    //         validator.validate().then(function (status) {
    //             if (status === 'Valid') {
    //                 ticketCodeFormDOM.submit();
    //             }
    //         });
    //     }
    // });

    const btnRemove = parentModalDOM.querySelectorAll('.remove-form');

    btnRemove.forEach(e => {
        e.addEventListener('click', function (e) {
            // const mtp = ticketCodeListDOM.querySelectorAll('.new');
            // mtp.forEach(a => {
            //     ticketCodeListDOM.removeChild(a)
            // });
            window.location.reload();
            // bookingPersonTicket.children.forEach(e => {
            //     if(e.dataset.id === id) {
            //         if(e.className.includes("d-none")) {
            //             e.classList.remove("d-none")
            //         }
            //         else e.classList.add("d-none")
            //     } else {
            //         if(!e.className.includes("d-none")) e.classList.add("d-none")
            //     }
            // })
        })
    });
}

const AddNewTicket = async (params) => {
    const bookingId = params.bookingId;
    let fetchBookingTicket = await fetch(`/Bookings/AddTicket/${bookingId}`);

    let dataBookingTicket = await fetchBookingTicket.json();
    const parentModalDOM = document.querySelector(`#modal-booking-ticket-${bookingId}`);
    const ticketCodeFormDOM = parentModalDOM.querySelector(`#add-ticket-form-${bookingId}`);
    const ticketCodeListDOM = ticketCodeFormDOM.querySelector(`#ticket-code-list-${bookingId}`);
    const bookingPersonTicket = ticketCodeFormDOM.querySelector(`#booking-person-ticket-${bookingId}`);


    // const navDOM = ticketCodeFormDOM.querySelector(`#nav-booking-${bookingId}`);

    const newId = uuidv4();

    // dataBookingTicket.ages.forEach((e,index) => {
    //    
    //     console.log(e.bookingPersons.filter(b => b.bookingID === bookingId))
    // })
    // navDOM.innerHTML = dataBookingTicket.ticketCodes.map(ticketCode => bookingTicketPersonDOM(ticketCode, dataBookingTicket, bookingId)).join('');
    // navDOM.append($(bookingTicketPersonDOM(newId,dataBookingTicket,bookingId,index)))
    bookingPersonTicket.insertAdjacentHTML("afterbegin", bookingTicketPersonDOM(newId, dataBookingTicket, bookingId));
    let htmlObject = $(bookingTicketTemplate(dataBookingTicket, newId, bookingId));
    ticketCodeListDOM.append(htmlObject[0]);
    $('[data-control="booking-addticket-select2"]').select2({
        dropdownParent: parentModalDOM
    });

    $('[data-items="airlines"]').on('select2:select', function (e) {
        const ticketCodeParent = $(this).parent().parent().parent().parent().attr('id');
        let parentDOM = ticketCodeListDOM.querySelector(`#${ticketCodeParent}`);
        let selectFlightClass = parentDOM.querySelector('[data-items="flight-class"]');
        $.ajax({
            url: "/FlightClasses/GetFlightClassesByArlineId",
            method: "Get",
            data: { "airlineId": e.params.data.id },
            success: function (result) {
                console.log(result)
                $(selectFlightClass).empty();
                // let html = '<option value="">Chọn hãng vé</option>';
                if (result.length !== 0) {
                    $(selectFlightClass).append(new Option("Chọn hãng vé", "", false, false));
                    for (let i = 0; i < result.length; i++) {
                        // html += '<option value="' + result[i].id + '">' + result[i].name + '</option>';
                        $(selectFlightClass).append(new Option(result[i].name, result[i].id, false, false));
                    }
                } else {
                    $(selectFlightClass).append(new Option("Chọn hãng vé", "", false, false));
                }

                $(selectFlightClass).select2();
            }
        });
    })
    // const btnSubmit = ticketCodeFormDOM.querySelector(`#submit-form-addticket-${bookingId}`);
    // let validator = FormValidation.formValidation(
    //     ticketCodeFormDOM,
    //     {
    //         fields: {
    //             'TicketTypeID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Khách hàng chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'Code': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Loại đơn hàng chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'AirlineID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Điểm đến chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'FlightID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Ngày khởi hành chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'FlightClassID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Ngày khởi hành chưa được chọn!'
    //                     }
    //                 }
    //             },
    //             'PartnerID': {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Ngày khởi hành chưa được chọn!'
    //                     }
    //                 }
    //             },
    //         },
    //
    //         plugins: {
    //             trigger: new FormValidation.plugins.Trigger(),
    //             bootstrap: new FormValidation.plugins.Bootstrap5({
    //                 rowSelector: '.fv-row',
    //                 eleInvalidClass: '',
    //                 eleValidClass: ''
    //             })
    //         }
    //     }
    // );
    //
    // btnSubmit.addEventListener('click', function (e) {
    //     e.preventDefault();
    //     if (validator) {
    //         validator.validate().then(function (status) {
    //             if (status === 'Valid') {
    //                 ticketCodeFormDOM.submit();
    //             }
    //         });
    //     }
    // });
}

const DeleteTicketCode = async (bookingId, id) => {
    const parentModalDOM = document.querySelector(`#modal-booking-ticket-${bookingId}`);
    const ticketCodeFormDOM = parentModalDOM.querySelector(`#add-ticket-form-${bookingId}`);
    const ticketCodeListDOM = ticketCodeFormDOM.querySelector(`#ticket-code-list-${bookingId}`);
    const ticketCodeDOM = ticketCodeListDOM.querySelector(`#ticket-code-${id}`);
    const btnDelete = ticketCodeDOM.querySelector(`#btn-delete-ticketcode-${id}`);
    const isTemplate = $(btnDelete).attr('data-template');

    if (isTemplate === 'true') {
        $(ticketCodeDOM).remove();
    }
    else {
        Swal.fire({
            title: 'Xóa vé máy bay!',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: "Hủy",
            backdrop: true,
            text: "Bạn có chắc chắn muốn xóa?",
            icon: 'error'
        }).then((result) => {
            if (result.isConfirmed) {
                const deletedTicketCodeInputDOM = ticketCodeFormDOM.querySelector('input[name="deleted-ticket-code"]');
                deletedTicketCodeInputDOM.value = [...deletedTicketCodeInputDOM.value.split(','), id].join((','));
                $(ticketCodeDOM).remove();
            }
        })
    }
}

const viewPersonTicket = async (bookingId, id) => {
    let fetchBookingTicket = await fetch(`/Bookings/AddTicket/${bookingId}`);
    let dataBookingTicket = await fetchBookingTicket.json();
    const parentModalDOM = document.querySelector(`#modal-booking-ticket-${bookingId}`);
    const ticketCodeFormDOM = parentModalDOM.querySelector(`#add-ticket-form-${bookingId}`);
    const ticketCodeListDOM = ticketCodeFormDOM.querySelector(`#ticket-code-list-${bookingId}`);
    const bookingPersonTicket = ticketCodeFormDOM.querySelector(`#booking-person-ticket-${bookingId}`);

    bookingPersonTicket.children.forEach(e => {
        if (e.dataset.id === id) {
            if (e.className.includes("d-none")) {
                e.classList.remove("d-none")
            }
            else e.classList.add("d-none")
        } else {
            if (!e.className.includes("d-none")) e.classList.add("d-none")
        }
    })

    const navDOM = ticketCodeFormDOM.querySelector(`#nav-booking-${id}`);
    navDOM.innerHTML = dataBookingTicket.ages.map(age => navPersonTicket(age, bookingId, id)).join("");
    const listPersonOfTicket = ticketCodeFormDOM.querySelector(`#ticket-persons-${id}`)
    listPersonOfTicket.innerHTML = dataBookingTicket.ages.map(age => panePersonTicket(age, dataBookingTicket, bookingId, id)).join("");
}

const fetchDataCustomer = async (id) => {
    const customerId = id;
    let fetchCustomer = await fetch(`Customers/Details/${customerId}`);
    let dataCustomer = await fetchCustomer.json();
    const parentModalDOM = document.querySelector(`#modal-customer-info-${customerId}`);
    const modalBody = parentModalDOM.querySelector(`.modal-body`);
    const bodyModalDOM = parentModalDOM.querySelector(`#modal-body-${customerId}`);
    if (dataCustomer.isPermission === false) {
        modalBody.innerHTML = WarningTemplateDOM();
    } else {
        bodyModalDOM.querySelector('[data-item="firstMidName"]').innerHTML = dataCustomer.customer.firstMidName || "";
        bodyModalDOM.querySelector('[data-item="lastName"]').innerHTML = dataCustomer.customer.lastName || "";
        bodyModalDOM.querySelector('[data-item="phone"]').innerHTML = dataCustomer.customer.phone || "";
        bodyModalDOM.querySelector('[data-item="email"]').innerHTML = dataCustomer.customer.email || "";
        bodyModalDOM.querySelector('[data-item="address"]').innerHTML = dataCustomer.customer.address || "";

        const customerBookingInfoDOM = bodyModalDOM.querySelector(`#info-customer-booking-${customerId}`);
        customerBookingInfoDOM.innerHTML = await dataCustomer.customer.bookings.map(b => bookingOfCustomerTemplate(b)).join('');
    }
}

const AddPerson = async (bookingId) => {
    let fetchAddPerson = await fetch(`/Bookings/Addperson/${bookingId}`);
    const dataAddPerson = fetchAddPerson.json();
    const parentModalDOM = document.querySelector(`#modal-addperson-${bookingId}`);
    const modalBody = parentModalDOM.querySelector(`.modal-body`);
    const navDOM = parentModalDOM.querySelector('.nav');
    const addPersonFormDOM = parentModalDOM.querySelector(`#add-person-form-${bookingId}`);
    const panePersonDOM = addPersonFormDOM.querySelector(`#panel-age-content-${bookingId}`);
    await dataAddPerson.then(result => {
        console.log('a', result.isPermission)
        if (result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            navDOM.insertAdjacentHTML("afterbegin", result.ages.map((e, index) => navAddPerson(e, bookingId, index)).join(""));
            panePersonDOM.insertAdjacentHTML("afterbegin", result.ages.map((e, index) => paneAddPerson(e, result, bookingId, index)).join(""));
        }
    })
    const btnRemove = parentModalDOM.querySelectorAll('.remove-form');

    btnRemove.forEach(e => {
        e.addEventListener('click', e => {
            // const a = addPersonFormDOM.querySelectorAll(".new");
            // a.forEach(e => {
            //     e.remove();
            // })
            // parentModalDOM.querySelectorAll('[data-template="true"]').forEach(e => {
            //     $(e).parent().remove()
            // })
            window.location.reload();
            // addPersonFormDOM.reset()
        })
    })
}

const AddNewPerson = async (bookingId, itemId) => {
    let fetchAddPerson = await fetch(`/Bookings/Addperson/${bookingId}`);
    const dataAddPerson = fetchAddPerson.json();
    const parentModalDOM = document.querySelector(`#modal-addperson-${bookingId}`);
    const navDOM = parentModalDOM.querySelector('.nav');
    const addPersonFormDOM = parentModalDOM.querySelector(`#add-person-form-${bookingId}`);
    const panePersonDOM = addPersonFormDOM.querySelector(`#panel-age-content-${bookingId}`);
    const paneAddAgeDOM = panePersonDOM.querySelector(`#panel-add-age-${bookingId}-${itemId} tbody`)
    let quantity = navDOM.querySelector(`#quantity-add-person-${itemId}`);
    const bookingPersonId = uuidv4();
    dataAddPerson.then(result => {
        paneAddAgeDOM.insertAdjacentHTML("beforeend", addNewPersonDOM(itemId, result, bookingId, bookingPersonId));
        quantity.value = +quantity.value + 1;
    })
}

const DeletePerson = async (bookingId, ageId, itemId) => {
    const parentModalDOM = document.querySelector(`#modal-addperson-${bookingId}`);
    const navDOM = parentModalDOM.querySelector('.nav');
    const addPersonFormDOM = parentModalDOM.querySelector(`#add-person-form-${bookingId}`);
    const panePersonDOM = addPersonFormDOM.querySelector(`#panel-age-content-${bookingId}`);
    const paneAddAgeDOM = panePersonDOM.querySelector(`#panel-add-age-${bookingId}-${ageId} tbody`)
    let quantity = navDOM.querySelector(`#quantity-add-person-${ageId}`);
    const btnDeletePerson = paneAddAgeDOM.querySelector(`#btn-delete-person-${itemId}`);
    const isTemplate = $(btnDeletePerson).attr('data-template');

    const personInfo = paneAddAgeDOM.querySelector(`#person-info-${itemId}`)

    if (isTemplate === 'true') {
        $(personInfo).remove();
        quantity.value = +quantity.value - 1;
    }
    else {
        Swal.fire({
            title: 'Xóa người trong danh sách chuyến đi!',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: "Hủy",
            backdrop: true,
            text: "Bạn có chắc chắn muốn xóa?",
            icon: 'error'
        }).then((result) => {
            if (result.isConfirmed) {
                const deletedPersonInputDOM = addPersonFormDOM.querySelector('input[name="deleted-person"]');
                deletedPersonInputDOM.value = [...deletedPersonInputDOM.value.split(','), itemId].join((','));
                $(personInfo).remove();
                quantity.value = +quantity.value - 1;
            }
        });
    }
};

const onBookingHotelDateChange = (event) => {
    const trDOM = event.target.closest('tr');
    console.log(trDOM)

    const checkInDateDOM = trDOM.querySelector('[name="CheckIn"]');
    const checkInDate = checkInDateDOM.value;

    const checkOutDateDOM = trDOM.querySelector('[name="CheckOut"]');
    const checkOutDate = checkOutDateDOM.value;
    // checkInDateDOM._flatpickr.set('maxDate', checkOutDate);
    // checkOutDateDOM._flatpickr.set('minDate', checkInDate);

    const dateDiffDOM = trDOM.querySelector('[name="QuantityDay"]');
    dateDiffDOM.value = countBetweenDay(checkInDate, checkOutDate);
    // console.log(countBetweenDay(checkInDate, checkOutDate))
};

const AddHotel = async (bookingId) => {
    let fetchAddHotel = await fetch(`Bookings/AddHotel/${bookingId}`);
    const dataAddHotel = await fetchAddHotel.json();
    const parentModalDOM = document.querySelector(`#modal-add-hotel-${bookingId}`);
    const modalBody = parentModalDOM.querySelector(`.modal-body`);
    const formDOM = parentModalDOM.querySelector(`#add-booking-hotel-form-${bookingId}`);
    const formAction = formDOM.querySelector(`#booking-hotel-action-${bookingId}`);
    const formInfo = formDOM.querySelector(`#booking-hotel-info-${bookingId}`);
    if (dataAddHotel.isPermission === false) {
        modalBody.innerHTML = WarningTemplateDOM();
    } else {
        formAction.innerHTML = AddHotelActionDOM(dataAddHotel, bookingId);
        formInfo.insertAdjacentHTML("afterbegin", dataAddHotel.bookingHotels.map(e => AddHotelInfoDOM(e, dataAddHotel, bookingId)).join(""))
        $('[data-control="booking-hotel-select2"]').select2({
            dropdownParent: parentModalDOM
        });

        $('[data-date-time="flatpickr"]', formInfo).flatpickr({
            altInput: true,
            altFormat: "Y-m-d",
            dateFormat: "Y-m-d"
        });
        const destinationNhaTrangId = $('[data-items="destination"]').val();
        const selectHotels = formAction.querySelector('[data-items="hotel"]');
        const selectRooms = formAction.querySelector('[data-items="room-type"]');
        const response = await fetch(`/Hotels/GetHotels?destinationId=${destinationNhaTrangId}`);
        const hotels = await response.json();
        selectHotels.innerHTML = buildOptions(hotels, 'id', 'name', '', 'Chọn khách sạn');
        selectRooms.innerHTML = buildOptions([{ id: '', name: 'Chọn loại phòng' }], 'id', 'name');
        $('[data-items="destination"]').on('select2:select', async e => {
            const destinationId = e.params.data.id;
            // const selectHotels = formAction.querySelector('[data-items="hotel"]');
            // const selectRooms = formAction.querySelector('[data-items="room-type"]');
            const response = await fetch(`/Hotels/GetHotels?destinationId=${destinationId}`);
            const hotels = await response.json();
            selectHotels.innerHTML = buildOptions(hotels, 'id', 'name', '', 'Chọn khách sạn');
            selectRooms.innerHTML = buildOptions([{ id: '', name: 'Chọn loại phòng' }], 'id', 'name');
        });

        $('[data-items="hotel"]').on('select2:select', async e => {
            const hotelId = e.params.data.id;
            const selectRooms = formAction.querySelector('[data-items="room-type"]');
            const response = await fetch(`/RoomTypes/GetRooms?hotelId=${hotelId}`);
            const roomTypes = await response.json();
            selectRooms.innerHTML = buildOptions(roomTypes, 'id', 'name', '', 'Chọn loại phòng');
        });

        $('[data-items="room-type"]').on('select2:select', e => {
            const roomTypeId = e.params.data.id;
            const btnAddRoom = formAction.querySelector('[data-action="add-room"]');
            btnAddRoom.disabled = roomTypeId === '';
        });

        const btnRemove = parentModalDOM.querySelectorAll('.remove-form');

        btnRemove.forEach(e => {
            e.addEventListener('click', e => {
                window.location.reload();
            });
        });
    }
}

const AddNewHotel = async (bookingId) => {
    const parentModalDOM = document.querySelector(`#modal-add-hotel-${bookingId}`);
    const formDOM = parentModalDOM.querySelector(`#add-booking-hotel-form-${bookingId}`);
    const formAction = formDOM.querySelector(`#booking-hotel-action-${bookingId}`);
    const formInfo = formDOM.querySelector(`#booking-hotel-info-${bookingId}`);
    let newId = uuidv4();
    let obj = {
        hotel: {
            id: "", name: ""
        },
        roomType: {
            id: "", name: ""
        },
        partner: {
            id: "", name: ""
        }
    }
    let hotel = $(formAction.querySelector(`[data-items="hotel"]`)).find(':selected');
    let roomType = $(formAction.querySelector(`[data-items="room-type"]`)).find(':selected');
    let partner = $(formAction.querySelector(`[data-items="partners"]`)).find(':selected');

    if (hotel.val() && roomType.val()) {
        obj.hotel.id = hotel.val();
        obj.hotel.name = hotel.text();
        obj.roomType.id = roomType.val();
        obj.roomType.name = roomType.text();
        obj.partner.id = partner.val();
        obj.partner.name = partner.text();
        formInfo.insertAdjacentHTML("beforeend", AddHotelInfoNewDOM(newId, bookingId, obj));
        $('[data-date-time="flatpickr"]', formInfo).flatpickr({
            altInput: true,
            altFormat: "Y-m-d",
            dateFormat: "Y-m-d"
        });
    }


}

const DeleteAddHotel = (bookingId, id, checkTemplate) => {
    const parentModalDOM = document.querySelector(`#modal-add-hotel-${bookingId}`);
    const formDOM = parentModalDOM.querySelector(`#add-booking-hotel-form-${bookingId}`);
    const formInfo = formDOM.querySelector(`#booking-hotel-info-${bookingId}`);
    const element = formInfo.querySelector(`#booking-hotel-${id}`)
    const idForSurcharge = "surcharge_"+id;

    if (checkTemplate === 'true') {
        $(element).remove();
        displaySurcharge(`${idForSurcharge}`,true)
    } else {
        Swal.fire({
            title: 'Xóa khách sạn của đơn hàng hiện tại!',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: "Hủy",
            backdrop: true,
            text: "Bạn có chắc chắn muốn xóa?",
            icon: 'error'
        }).then((result) => {
            if (result.isConfirmed) {
                displaySurcharge(`${idForSurcharge}`,true)
                const deletedBookingHotelInputDOM = parentModalDOM.querySelector('input[name="deleted-bookings-hotel"]');
                deletedBookingHotelInputDOM.value = [...deletedBookingHotelInputDOM.value.split(','), id].join((','));
                $(element).remove();
            }
        })
    }
}

const ShowQuote = async (bookingId) => {
    const fetchQuote = await fetch(`Bookings/Quote/${bookingId}`);
    const dataQuote = await fetchQuote.json();
    const modalParentDOM = document.querySelector(`#modal-show-quote-${bookingId}`);
    const modalBody = modalParentDOM.querySelector(`.modal-body`);
    const reId = modalParentDOM.querySelector(`#btnDownload-${bookingId}`);
    const btnShowPaymentSchedule = modalParentDOM.querySelector(`#btn-payment-schedule-${bookingId}`);
    const contentDOM = modalParentDOM.querySelector(`#quote-info-${bookingId}`);
    if (dataQuote.isPermission === false) {
        modalBody.innerHTML = WarningTemplateDOM();
        reId.hidden = true;
        btnShowPaymentSchedule.hidden = true;
    } else {
        contentDOM.innerHTML = ShowQuoteDOM(bookingId, dataQuote);
        var elements = Array.prototype.slice.call(document.querySelectorAll("[data-bs-stacked-modal]"));

        if (elements && elements.length > 0) {
            elements.forEach((element) => {
                if (element.getAttribute("data-kt-initialized") === "1") {
                    return;
                }

                element.setAttribute("data-kt-initialized", "1");

                element.addEventListener("click", function (e) {
                    e.preventDefault();

                    const modalEl = document.querySelector(this.getAttribute("data-bs-stacked-modal"));

                    if (modalEl) {
                        const modal = new bootstrap.Modal(modalEl);
                        modal.show();
                    }
                });
            });
        }

        reId.addEventListener('click', e => {
            printJS({
                printable: `receipt-${bookingId}`,
                type: 'html',
                maxWidth: 800,
                css: ['/css/plugins.bundle.css', '/css/style.bundle.css', '/css/custom.bundle.css', '/css/main.css'],
                header: '<div class="d-flex flex-stack pb-10"><img alt="Logo" width="100%" src="media/Baogia-forword-head.jpg"></div>',
                style: `
                    #quote-info-${bookingId} {flex-direction: column !important;}
                    #quote-time-${bookingId} {flex-direction: row !important;}
                    #payment-info-${bookingId} {display: flex;flex-direction: row !important;justify-content: space-between; background-color: #f5f8fa80 !important;}
                    .payment-info-col1 {flex: 0 0 auto;width: 50%;}
                    .payment-info-col2 {flex: 0 0 auto;width: 50%;}
                `,
                targetStyles: ['*']
            })
        })
    }
}

const ShowPaymentSchedule = async (bookingId) => {
    let fetchPaymentSchedule = await fetch(`/Bookings/PaymentSchedule/${bookingId}`);
    let dataPaymentSchedule = await fetchPaymentSchedule.json();
    const modalParentDOM = document.querySelector(`#modal-add-payment-schedule-${bookingId}`);
    const modalBody = modalParentDOM.querySelector(`.modal-body`);
    const formDOM = modalParentDOM.querySelector(`#add-payment-schedule-form-${bookingId}`);
    formDOM.reset();
    const list = formDOM.querySelector(`#payment-schedule-list-${bookingId}`);
    console.log(dataPaymentSchedule);
    if (dataPaymentSchedule.isPermission == false) {
        modalBody.innerHTML = WarningTemplateDOM();
    } else {
        list.insertAdjacentHTML("afterbegin", dataPaymentSchedule.payments.map(e => PaymentScheduleDOM(bookingId, e)).join(""));

        $('[data-date-time="flatpickr"]', formDOM).flatpickr({
            altInput: true,
            altFormat: "Y-m-d",
            dateFormat: "Y-m-d"
        });


        $('[name="Percent"]').on('keyup', e => {
            const id = e.target.parentElement.parentElement.parentElement.id;
            const value = e.target.value;
            const item = list.querySelector(`#${id}`);
            const inpAmount = item.querySelector('[name="Amount"]');
            const modalParentDOM = document.querySelector(`#modal-show-quote-${bookingId}`);
            const contentDOM = modalParentDOM.querySelector(`#quote-info-${bookingId}`);
            const total = contentDOM.querySelector(`#total-payment-${bookingId}`).innerHTML.replace(" VNĐ", '').replaceAll(',', '');
            inpAmount.value = formatCurrency((+total * value) / 100);
        })

        const btnSubmit = formDOM.querySelector(`#submit-form-payment-schedule-${bookingId}`);
        const btnRemove = modalParentDOM.querySelectorAll('.remove-form');
    }

    // btnSubmit.addEventListener('click', function (e) {
    //     e.preventDefault();
    //     let formData2 = new FormData(formDOM);
    //     $.ajax({
    //         type: 'POST',
    //         url: '/Bookings/PaymentSchedule',
    //         contentType: false,
    //         processData: false,
    //         cache: false,
    //         data: formData2,
    //         success: function (data) {
    //             $(modalParentDOM).modal('hide');
    //             ShowQuote(bookingId);
    //         },
    //         error: function (e) {
    //             console.log('eror', e)
    //         }
    //     });
    // });

}

const AddNewPaymentSchedule = async (bookingId) => {
    let fetchPaymentSchedule = await fetch(`/Bookings/PaymentSchedule/${bookingId}`);
    let dataPaymentSchedule = await fetchPaymentSchedule.json();
    const modalParentDOM = document.querySelector(`#modal-add-payment-schedule-${bookingId}`);
    const formDOM = modalParentDOM.querySelector(`#add-payment-schedule-form-${bookingId}`);
    const list = formDOM.querySelector(`#payment-schedule-list-${bookingId}`);
    const newId = uuidv4();
    list.insertAdjacentHTML("beforeend", NewPaymentScheduleDOM(bookingId, newId));
    $('[data-date-time="flatpickr"]', formDOM).flatpickr({
        altInput: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d"
    });
    const item = list.querySelector(`#payment-schedule-item-${newId}`);

    const inpPercent = item.querySelector('[name="Percent"]');
    const inpAmount = item.querySelector('[name="Amount"]');
    inpPercent.addEventListener('keyup', e => {
        let value = e.target.value;
        const modalParentDOM = document.querySelector(`#modal-show-quote-${bookingId}`);
        const contentDOM = modalParentDOM.querySelector(`#quote-info-${bookingId}`);
        const total = contentDOM.querySelector(`#total-payment-${bookingId}`).innerHTML.replace(" VNĐ", '').replaceAll(',', '');
        inpAmount.value = formatCurrency((+total * value) / 100);
    })

    const btnSubmit = formDOM.querySelector(`#submit-form-payment-schedule-${bookingId}`);
    const btnRemove = modalParentDOM.querySelectorAll('.remove-form');

    btnSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        let formData2 = new FormData(formDOM);
        $.ajax({
            type: 'POST',
            url: '/Bookings/PaymentSchedule',
            contentType: false,
            processData: false,
            cache: false,
            data: formData2,
            success: function (data) {
                $(modalParentDOM).modal('hide');
                ShowQuote(bookingId);
            },
            error: function (e) {
                console.log('eror', e)
            }
        });
    });
}

const DeletePaymentSchedule = async (bookingId, id) => {
    const modalParentDOM = document.querySelector(`#modal-add-payment-schedule-${bookingId}`);
    const formDOM = modalParentDOM.querySelector(`#add-payment-schedule-form-${bookingId}`);
    const list = formDOM.querySelector(`#payment-schedule-list-${bookingId}`);
    const item = list.querySelector(`#payment-schedule-item-${id}`);
    const btnDelete = item.querySelector(`#btn-delete-payment-schedule-${id}`);
    const isTemplate = $(btnDelete).attr('data-template');

    // if (isTemplate === 'true') {
    //     $(item).remove();
    // }
    // else {
    Swal.fire({
        title: 'Xóa lịch thanh toán!',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: "Hủy",
        backdrop: true,
        text: "Bạn có chắc chắn muốn xóa?",
        icon: 'error'
    }).then((result) => {
        if (result.isConfirmed) {
            const deletedPaymentScheduleInputDOM = formDOM.querySelector('input[name="deleted-payment-schedule"]');
            deletedPaymentScheduleInputDOM.value = [...deletedPaymentScheduleInputDOM.value.split(','), id].join((','));
            $(item).remove();
            // $.ajax({
            //     type: 'POST',
            //     url: `/Bookings/DeletePaymentScheduleConfirmed/${id}`,
            //     contentType: false,
            //     processData: false,
            //     cache: false,
            //     success: function (data) {
            //         $(item).remove();
            //         ShowQuote(bookingId);
            //     },
            //     error: function (e) {
            //         console.log('eror', e)
            //     }
            // });
        }
    })
    // }
    //
    const btnSubmit = formDOM.querySelector(`#submit-form-payment-schedule-${bookingId}`);
    // btnSubmit.addEventListener('click', function (e) {
    //     e.preventDefault();
    //     submitPaymentSchedule({bookingId: bookingId});
    // });
    btnSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        let formData2 = new FormData(formDOM);
        const paymentIds = formData2.get('deleted-payment-schedule').split(',').filter(Boolean);

        $.ajax({
            type: 'POST',
            url: '/Bookings/PaymentSchedule',
            contentType: false,
            processData: false,
            cache: false,
            data: formData2,
            success: function (data) {
                if (paymentIds) {
                    const deletePaymentSchedulesPromises = paymentIds.map((id) => fetch(
                        `/Bookings/DeletePaymentScheduleConfirmed/${id}`,
                        {
                            method: 'POST',
                        }
                    ));
                    Promise.all(deletePaymentSchedulesPromises);
                }
                $(modalParentDOM).modal('hide');
                modalParentDOM.reset();
                ShowQuote(bookingId);
            },
            error: function (e) {
                console.log('eror', e)
            }
        });
    });
}

let bookingFunction = function () {
    const modal = document.querySelector('#placeholder-modal-crud');
    let initBooking = () => {

        KTUtil.on(modal, '[data-items="service-type"]', 'change', function (e) {
            const val = e.target.value;
            const selectServices = modal.querySelector('[data-items="services"]');
            const selectPartners = modal.querySelector('[data-items="partners"]');

            if (!val) {
                selectServices.disabled = true;
                selectPartners.disabled = true;
                return;
            }
    
            selectServices.disabled = false;
            selectPartners.disabled = false;
            $.ajax({
                url: "/Services/GetServicesByType",
                method: "Get",
                data: { "serviceTypeID": val },
                success: function (result) {
                    console.log(result)
                    $(selectServices).empty();
                    let html = '<option value="">Chọn dịch vụ</option>';
                    if (result.length != 0) {
                        for (let i = 0; i < result.length; i++) {
                            html += '<option value="' + result[i].id + '" data-price-adult="' + result[i].priceAdult + '" data-price-child="' + result[i].priceChildren + '"  data-price-common="' + result[i].priceCommon + '">' + result[i].name + '</option>';
                        }
                    }
                    selectServices.innerHTML = html;
                    $(selectServices).select({
                        dropdownParent: $("#modal-dialog-crud")
                    });
                }
            });

            $.ajax({
                url: "/Partners/GetPartnersByType",
                method: "GET",
                data: { "serviceTypeID": val },
                success: function (result) {
                    $(selectPartners).empty();
                    let html = '<option value="">Chọn đối tác</option>';
                    if (result.length != 0) {
                        for (let i = 0; i < result.length; i++) {
                            html += '<option value="' + result[i].partner.id + '">' + result[i].partner.name + '</option>';
                        }
                    }
                    selectPartners.innerHTML = html;
                    $(selectPartners).select({
                        dropdownParent: $("#modal-dialog-crud")
                    });
                }
            });
        });

        KTUtil.on(modal, '[data-items="partners"]', 'change', (e) => {
            const val = e.target.value;
            const btnAddService = modal.querySelector('[data-action="add-service"]');
            btnAddService.disabled = val !== "" ? false : true;
        })

        KTUtil.on(modal, '[data-items="CheckPriceCommon"]', "change", (e) => {
            const btnIsCommonPriceChecked = modal.querySelector('[data-items="CheckPriceCommon"]');
            btnIsCommonPriceChecked.value = e.target.checked === true ? true : false;
        });

        KTUtil.on(modal, '[data-action="add-service"]', 'click', function (e) {
            const selectServices = modal.querySelector('[data-items="services"]');
            const selectPartners = modal.querySelector('[data-items="partners"]');
            const price = selectServices.options[selectServices.selectedIndex];
            let serviceId = selectServices.value;
            let partnerId = selectPartners.value;
            var priceAdult = price.getAttribute('data-price-adult');
            var priceChild = price.getAttribute('data-price-child');
            var priceCommon = price.getAttribute('data-price-common');
            let serviceText = selectServices.options[selectServices.selectedIndex].text;
            let partnerText = selectPartners.options[selectPartners.selectedIndex].text;
            let currentDate = new Date().toLocaleDateString("en-CA");
            const bookingID = modal.querySelector('#BookingID');
            const listServices = document.querySelector('#data-update-services');
            let checkPriceCommon = document.querySelector('.check-price-common:checked')
            const btnIsCommonPriceChecked = modal.querySelector('[data-items="CheckPriceCommon"]').value;
            // const id = e.target.dataset.id
            const id = Math.floor(Math.random() * 1000000000)
            const idForSurcharge = "surcharge_"+id
            let html = '';
            html += '<tr>';
            html += `<td>
                <div data-bs-toggle="collapse" role="button" aria-expanded="false" class="btn text-danger fw-boldest fs-5 ps-5 p-0 collapsed rotate collapsible" href="#surcharge_${id}">
                    <span class="ms-2 rotate-90">
                        <i class="fa fa-chevron-right"></i>
                    </span>
                </div>
            </td>`;
            html += '<td>';
            html += '<input class="form-control" data-date-time="flatpickr" type="text" readonly="readonly" value="' + currentDate + '" name="ServiceDate">';
            html += '</td>';
            html += '<td>';
            html += '<input type="hidden" name="BookingID" value="' + bookingID.value + '">';
            html += '<input type="hidden" name="BookingServiceID" value="00000000-0000-0000-0000-000000000000">';
            html += '<input type="hidden" name="IsCommonPrice" value="' + btnIsCommonPriceChecked + '">';
            html += '<input type="hidden" name="ServiceID" value="' + serviceId + '">';
            html += '<input type="hidden" name="PartnerID" value="' + partnerId + '">';
            html += '<div class="text-gray-800 text-hover-primary fs-5 fw-bolder">' + serviceText + ' ' + '(' + partnerText + ')' + '</div>';
            html += '</td>';
            html += '<td>';
            html += '<input type="number" name="Adult" class="form-control" min="0" value="0">';
            html += '</td>';
            html += '<td>';
            html += '<input type="number" name="Child" class="form-control" min="0" value="0">';
            html += '</td>';
            if (checkPriceCommon) {
                html += '<td>';
                html += '<input name="PriceAdult" class="form-control input-currency pe-none" min="0" value="' + formatCurrency(priceAdult) + '">';
                html += '</td>';
                html += '<td>';
                html += '<input name="PriceChild" class="form-control input-currency pe-none" min="0" value="' + formatCurrency(priceChild) + '">';
                html += '</td>';
                html += '<td>';
                html += '<input name="PriceCommon" class="form-control" min="0" value="' + formatCurrency(priceCommon) + '">';
                html += '</td>';
            }
            else {
                html += '<td>';
                html += '<input name="PriceAdult" class="form-control input-currency" min="0" value="' + formatCurrency(priceAdult) + '">';
                html += '</td>';
                html += '<td>';
                html += '<input name="PriceChild" class="form-control input-currency" min="0" value="' + formatCurrency(priceChild) + '">';
                html += '</td>';
                html += '<td>';
                html += '<input name="PriceCommon" class="form-control input-currency pe-none" min="0" value="' + formatCurrency(priceCommon) + '">';
                html += '</td>';
            }
            html += '<td>';
            html += `<a onclick="removeItemSurcharge('${idForSurcharge}')" class="btn btn-sm btn-icon btn-light-danger" data-id="00000000-0000-0000-0000-000000000000" data-action="data-delete-service" data-template="true"><i class="fa fa-times"></i></a>`;
            html += '</td>';
            html += '</tr>';

            // model title
            html += `<tr>
                        <td colspan="12">
                            <div id="surcharge_${id}" class="border-between collapse surcharge">
                                <div class="form fv-plugins-bootstrap5 fv-plugins-framework">`
                                if(checkPriceCommon)
                                {
                                        html += `<div class="row mb-7">
                                            <div class="col-xl-2">
                                                <label class="control-label fs-6 fw-bold mb-2">Đối tác phụ thu</label> 
                                                <input name="Surcharge" class="form-control input-currency mb-5" min="0" value="0">
                                                <label class="control-label fs-6 fw-bold mb-2">Số lượng phụ thu</label> 
                                                <input type="number" name="QuantitySurcharge" class="form-control input-currency mb-3 mb-lg-0" min="0" value="0">
                                            </div>
                                            <div class="col-xl-10">
                                                <label class="control-label fs-6 fw-bold mb-2">Lý do phụ thu</label> 
                                                <textarea type="text" name="AboutSurcharge" class="form-control mb-3 mb-lg-0" rows="5" value=""></textarea>
                                            </div>
                                        </div>`
                                }
                                else
                                {
                                    html += `<div class="row mb-7">
                                        <div class="col-xl-2">
                                            <label class="control-label fs-6 fw-bold mb-2">Đối tác phụ thu</label> 
                                            <input name="Surcharge" class="form-control input-currency mb-5" min="0" value="0">
                                            <label class="control-label fs-6 fw-bold mb-2">SL phụ thu</label> 
                                            <input type="number" name="QuantitySurcharge" class="form-control input-currency mb-3 mb-lg-0" min="0" value="0">
                                        </div>
                                        <div class="col-xl-10">
                                            <label class="control-label fs-6 fw-bold mb-2">Lý do phụ thu</label> 
                                            <textarea type="text" name="AboutSurcharge" class="form-control mb-3 mb-lg-0" rows="5" value=""></textarea>
                                        </div>
                                    </div>`
                                }
                    html += `</div>
                    </div>
                </td>
            </tr>`

            let available = true;
            const trRows = this.querySelectorAll('tr');
            if (trRows.length > 0) {
                for (let row of trRows) {
                    let id = row.attr("id").value;
                    if (id == serviceId) {
                        available = false;
                        break;
                    }
                }
            }

            if (available) {
                $(listServices).append(html);
            }
        });

        KTUtil.on(modal, '[data-action="data-delete-service"]', 'click', function (e) {
            let bookingServiceId = $(this).attr('data-id');
            let checkTemplate = $(this).attr('data-template');
            if (checkTemplate === 'true') {
                $(this).closest('tr').remove();
            } else {
                Swal.fire({
                    title: 'Xóa dịch vụ của đơn hàng hiện tại!',
                    showCancelButton: true,
                    confirmButtonText: 'Xóa',
                    cancelButtonText: "Hủy",
                    backdrop: true,
                    text: "Bạn có chắc chắn muốn xóa?",
                    icon: 'error'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const deletedBookingServiceInputDOM = document
                            .querySelector('#add-booking-service-form')
                            .querySelector('input[name="delete-booking-services"]');
                        deletedBookingServiceInputDOM.value = [...deletedBookingServiceInputDOM.value.split(','), bookingServiceId].join((','));
                        $(this).closest('tr').remove();
                    }
                })
            }
        });

        KTUtil.on(modal, '[name="IsRoundTrip"]', 'click', function (e) {
            const elementBody = modal.querySelector('#ticket-code');
            const htmlFirst = modal.querySelector('#tecketTemplate').innerHTML;
            let guid = newGuid();

            let elementFirst = document.createElement('div');
            elementFirst.innerHTML = htmlFirst;
            const elementId = elementFirst.querySelector("#ticket-code-00000000-0000-0000-0000-000000000000");
            elementId.id = "ticket-code-" + guid;
            let deleteCode = elementFirst.querySelector('[data-action="data-delete-ticket-code"]');
            deleteCode.setAttribute("data-id", guid);
            let viewCode = elementFirst.querySelector('[data-action="data-view-ticket-code"]');
            viewCode.setAttribute("data-id", guid);
            let ticketCodeID = elementFirst.querySelector('[name="CodeID"]');
            ticketCodeID.value = guid;
            $(elementBody).append(elementFirst.innerHTML);
        });

        KTUtil.on(modal, '[data-age-commission="commission"], [data-age-quantity="quantity"], [data-age-price="price"], [data-surcharge-price="price"], [data-surcharge-quantity="quantity"]', 'keyup', function (e) {
            const table = modal.querySelector('#table-age-price');
            const rows = table.querySelectorAll('tbody tr');
            let totalPrice = modal.querySelector('#total-price-inp').value;
            let totalPriceSurcharge = modal.querySelector('#total-price-surcharge-inp').value;
            let totalProfit = 0;
            let totalPayment = 0;
            let totalCommission = 0;
            let priceSurcharge = modal.querySelector('[data-surcharge-price="price"]').value;
            let quantitySurcharge = modal.querySelector('[data-surcharge-quantity="quantity"]').value;
            let valueQuantitySurcharge = parseFloat(quantitySurcharge.toString().replace(/,/g, ""));
            let valuePriceSurcharge = parseFloat(priceSurcharge.toString().replace(/,/g, ""));

            let totalSurcharge = modal.querySelector('[data-surcharge-total="total"]');
            totalSurcharge.innerHTML = Number((valuePriceSurcharge * valueQuantitySurcharge).toFixed(2)).toLocaleString() + " VNĐ";
            totalPriceSurcharge = valuePriceSurcharge * valueQuantitySurcharge;
            for (let row of rows) {
                let quantity = row.querySelector('[data-age-quantity="quantity"]').value;
                let price = row.querySelector('[data-age-price="price"]').value;
                let commission = row.querySelector('[data-age-commission="commission"]').value;
                let valuePrice = parseFloat(price.toString().replace(/,/g, ""));
                let valueCommission = parseFloat(commission.toString().replace(/,/g, ""));
                row.querySelector('td:last-child').innerHTML = Number((quantity * valuePrice).toFixed(2)).toLocaleString() + " VNĐ";
                totalPayment += quantity * valuePrice;
                totalCommission += quantity * valueCommission;
                totalProfit = totalPayment - totalPrice - totalCommission;
            }

            totalProfitCalculator(totalProfit);
            let tmp = totalPayment + totalPriceSurcharge;
            priceCalculator(tmp);
            commissionCalculator(totalCommission);
        });

        function newGuid() {
            return crypto.randomUUID();
        }

        function priceCalculator(totalPayment) {
            const totalAgePrice = modal.querySelector('#total-age-price');
            totalAgePrice.innerHTML = Number((totalPayment).toFixed(2)).toLocaleString() + " VNĐ";
        }
        function commissionCalculator(totalCommission) {
            const totalCommissionPrice = modal.querySelector('#total-commission-price');
            totalCommissionPrice.innerHTML = Number((totalCommission).toFixed(2)).toLocaleString() + " VNĐ";
        }
        function totalProfitCalculator(totalProfit) {
            const totalProfitPrice = modal.querySelector('#total-profit');
            totalProfitPrice.innerHTML = Number((totalProfit).toFixed(2)).toLocaleString() + " VNĐ";
        }
    }

    return {
        // Public functions
        init: function () {
            initBooking();
        }
    };
}();

const ShowReceipt = async (bookingId) => {
    const fetchReceipt = await fetch(`/Bookings/Receipts/${bookingId}`);
    let dataReceipt = fetchReceipt.json();
    const parentModalDOM = document.querySelector(`#modal-show-receipt-${bookingId}`);
    const modalBody = parentModalDOM.querySelector('.modal-body');
    const infoDOM = modalBody.querySelector(`#info-booking-receipt-${bookingId}`);
    await dataReceipt.then(result => {
        if (result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            infoDOM.insertAdjacentHTML("afterbegin", result.receiptDetails.map((receiptDetail) => ShowReceiptDOM(bookingId, receiptDetail)).join(''));
        }
    })
    var elements = Array.prototype.slice.call(document.querySelectorAll("[data-bs-stacked-modal]"));

    if (elements && elements.length > 0) {
        elements.forEach((element) => {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            element.setAttribute("data-kt-initialized", "1");

            element.addEventListener("click", function (e) {
                e.preventDefault();

                const modalEl = document.querySelector(this.getAttribute("data-bs-stacked-modal"));

                if (modalEl) {
                    const modal = new bootstrap.Modal(modalEl);
                    modal.show();
                }
            });
        });
    }
}

const ShowReceiptDetail = async (bookingId, receiptId) => {
    const fetchReceiptDetail = await fetch(`/Receipts/DetailsModal/${receiptId}`);
    let dataReceiptDetail = fetchReceiptDetail.json();
    const parentModalDOM = document.querySelector(`#modal-${bookingId}-receipt-detail`);
    const receiptTitleDOM = parentModalDOM.querySelector(`#receipt-title-${bookingId}`);
    const modalBody = parentModalDOM.querySelector('.modal-body');


    await dataReceiptDetail.then(result => {
        if (result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            receiptTitleDOM.innerHTML = result.receipt.code;
            modalBody.innerHTML = ShowReceiptDetailDOM(bookingId, receiptId, result.receipt);
        }
    })
}

const ShowPayment = async (bookingId) => {
    const fetchPayment = await fetch(`/Bookings/Payments/${bookingId}`);
    let dataPayment = fetchPayment.json();
    console.log('data',dataPayment);
    const parentModalDOM = document.querySelector(`#modal-show-payments-${bookingId}`);
    const modalBody = parentModalDOM.querySelector('.modal-body');
    const infoDOM = modalBody.querySelector(`#info-booking-payments-${bookingId}`);
    await dataPayment.then(result => {
        if (result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            infoDOM.insertAdjacentHTML("afterbegin", result.paymentDetails.map((paymentDetail) => ShowPaymentDOM(bookingId, paymentDetail)).join(''));
            infoDOM.insertAdjacentHTML("afterbegin", result.receiptDetails.map((receiptDetail) => ShowReceiptDOM(bookingId, receiptDetail)).join(''));
        }
    })
    
    var elements = Array.prototype.slice.call(document.querySelectorAll("[data-bs-stacked-modal]"));

    if (elements && elements.length > 0) {
        elements.forEach((element) => {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            element.setAttribute("data-kt-initialized", "1");

            element.addEventListener("click", function (e) {
                e.preventDefault();

                const modalEl = document.querySelector(this.getAttribute("data-bs-stacked-modal"));

                if (modalEl) {
                    const modal = new bootstrap.Modal(modalEl);
                    modal.show();
                }
            });
        });
    }
}

const ShowPaymentDetail = async (bookingId, paymentId) => {
    const fetchPaymentDetail = await fetch(`/Payments/DetailsModal/${paymentId}`);
    let dataPaymentDetail = fetchPaymentDetail.json();
    const parentModalDOM = document.querySelector(`#modal-${bookingId}-payment-detail`);
    const paymentTitleDOM = parentModalDOM.querySelector(`#payment-title-${bookingId}`);
    const modalBody = parentModalDOM.querySelector('.modal-body');
    
    await dataPaymentDetail.then(result => {
        if (result.isPermission === false) {
            modalBody.innerHTML = WarningTemplateDOM();
        } else {
            paymentTitleDOM.innerHTML = result.payment.code;
            modalBody.innerHTML = ShowPaymentDetailDOM(bookingId, paymentId, result);
        }
    })
}


// On document ready
KTUtil.onDOMContentLoaded(function () {
    bookingFunction.init();
});

const submitAddTicket = async (formElement) => {
    const formData = new FormData(formElement);
    const ticketIds = formData.get('deleted-ticket-code').split(',').filter(Boolean);
    const deleteTicketsPromises = ticketIds.map((id) => fetch(
        `/Bookings/DeleteTicketConfirmed/${id}`,
        {
            method: 'POST',
        }
    ));
    await Promise.all(deleteTicketsPromises);
    await fetch(formElement.action, {
        body: formData,
        method: formElement.method,
    });
    location.reload();
};

/**
 * @param {HTMLFormElement} formElement 
 */
const submitAddPerson = async (formElement) => {
    const formData = new FormData(formElement);
    const personIds = formData.get('deleted-person').split(',').filter(Boolean);
    const deletePersonsPromises = personIds.map((id) => fetch(
        `/Bookings/DeletePersonConfirmed/${id}`,
        {
            method: 'POST',
        }
    ));
    await Promise.all(deletePersonsPromises);
    await fetch(formElement.action, {
        body: formData,
        method: formElement.method,
    });
    location.reload();
};

/**
 * @param {HTMLFormElement} formElement 
 */
const submitAddServices = async (formElement) => {
    const formData = new FormData(formElement);
    const serviceIds = formData.get('delete-booking-services').split(',').filter(Boolean);
    const deleteBookingServicesPromises = serviceIds.map((id) => fetch(
        `/Bookings/DeleteServiceConfirmed/${id}`,
        {
            method: 'POST',
        }
    ));
    await Promise.all(deleteBookingServicesPromises);
};

/**
 * @param {HTMLFormElement} formElement 
 */
const submitAddHotels = async (formElement) => {
    const formData = new FormData(formElement);
    const hotelIds = formData.get('deleted-bookings-hotel').split(',').filter(Boolean);
    const deleteBookingHotelsPromises = hotelIds.map((id) => fetch(
        `/Bookings/DeleteHotelConfirmed/${id}`,
        {
            method: 'POST',
        }
    ));
    await Promise.all(deleteBookingHotelsPromises);
    formElement.querySelectorAll('.input-currency').forEach(
        element => {
            element.value = parseFloat(element.value.toString().replace(/,/g, ""));
        }
    );
    await fetch(formElement.action, {
        body: formData,
        method: formElement.method,
    });
    location.reload();
}

/**
 * @param {HTMLFormElement} formElement 
 */
const submitPaymentSchedule = async (formElement) => {
    const formData = new FormData(formElement);
    const paymentIds = formData.get('deleted-payment-schedule').split(',').filter(Boolean);
    console.log(paymentIds)
    const deletePaymentSchedulesPromises = paymentIds.map((id) => fetch(
        `/Bookings/DeletePaymentScheduleConfirmed/${id}`,
        {
            method: 'POST',
        }
    ));
    await Promise.all(deletePaymentSchedulesPromises);
    formElement.querySelectorAll('.input-currency').forEach(
        element => {
            element.value = parseFloat(element.value.toString().replace(/,/g, ""));
        }
    );
    await fetch(formElement.action, {
        body: formData,
        method: formElement.method,
    });
    location.reload();
}

/**
 * @param {HTMLSelectElement} selectElement 
 */
const onBookingStatusChange = (selectElement) => {
    const noteDOM = document.querySelector('#booking-note');
    if (selectElement.value === '1' || selectElement.value === '3') {
        noteDOM.classList.remove('d-none');
    } else {
        noteDOM.classList.add('d-none');
    }
};
let displaySurcharge = function (id, isRemoveItem = false)
{
    const surchargeElement = document.getElementById(id)
    const isSurchargeVisible = surchargeElement.classList.contains('d-none');
    if(isRemoveItem && isSurchargeVisible)
    {
        surchargeElement.classList.add('d-none')
    }
    else
    {
        if(isSurchargeVisible == false)
        {
            surchargeElement.classList.add('d-none')
        }
        else{
            surchargeElement.classList.remove('d-none');
        }
    }
}
let removeItemSurcharge = function (id)
{
    const surchargeElement = document.getElementById(id)
    const isSurchargeVisible = surchargeElement.classList.contains('show');
    if(isSurchargeVisible)
    {
        surchargeElement.classList.remove('show');
    }
}