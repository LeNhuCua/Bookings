"use strict";
const createCustomer = async () => {
  let fetchCustomer = await fetch( '/Customers/Create' );
  let dataCustomer = fetchCustomer.json();
  const parentModalDOM = document.querySelector( '#modal-create-customer' );
  const modalBody = parentModalDOM.querySelector( '.modal-body' );
  const createFormDOM = parentModalDOM.querySelector( '#create-customer-form' );

  await dataCustomer.then( result => {
    {
      const vocatives = [];
      for ( const key in result.vocatives ) {
        vocatives.push( { id: key, name: result.vocatives[ key ] } );
      };
      createFormDOM.insertAdjacentHTML( "afterbegin", createCustomerDOM( result ) );
      $( '[name="Gender"]' ).on( 'select2:select', e => {
        const genderId = e.params.data.id;
        const voca = createFormDOM.querySelector( '[name="Vocative"]' );
        if ( genderId == 1 ) {
          voca.innerHTML = buildOptions( vocatives, 'id', 'name', "Anh" );
        } else {
          voca.innerHTML = buildOptions( vocatives, 'id', 'name', "Chị" );
        }
      } );
      $( '[data-control="select2"]' ).select2( {
        dropdownParent: parentModalDOM
      } );

    }
  } );

  const btnSubmit = createFormDOM.querySelector( '#submit-form-create-customer' );
  const btnRemove = parentModalDOM.querySelectorAll( '.remove-form' );

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
        bootstrap: new FormValidation.plugins.Bootstrap5( {
          rowSelector: '.fv-row',
          eleInvalidClass: '',
          eleValidClass: ''
        } )
      }
    }
  );
  $( createFormDOM.querySelector( '[name="Vocative"]' ) ).on( 'change', function () {
    // Revalidate the field when an option is chosen
    validator.revalidateField( 'Vocative' );
  } );
  $( createFormDOM.querySelector( '[name="Gender"]' ) ).on( 'change', function () {
    // Revalidate the field when an option is chosen
    validator.revalidateField( 'Gender' );
  } );
  $( createFormDOM.querySelector( '[name="ProvinceID"]' ) ).on( 'change', function () {
    // Revalidate the field when an option is chosen
    validator.revalidateField( 'ProvinceID' );
  } );
  $( createFormDOM.querySelector( '[name="CustomerTypeID"]' ) ).on( 'change', function () {
    // Revalidate the field when an option is chosen
    validator.revalidateField( 'CustomerTypeID' );
  } );
  btnSubmit.addEventListener( 'click', function ( e ) {

    if ( validator ) {
      validator.validate().then( function ( status ) {
        if ( status === 'Valid' ) {

          createFormDOM.addEventListener("submit", function ( event ) {
            event.preventDefault();
            console.log( "Valid" );
            createFormDOM.submit();
          } );





        } else {
          createFormDOM.addEventListener("submit", function ( event ) {
            event.preventDefault();
            console.log( "sdfsbdh Valid" );
            // createFormDOM.submit();
          } );

        }
      } );
    }
  } );
  btnRemove.forEach( e => {
    e.addEventListener( 'click', function ( e ) {
      validator.resetForm();
    } );
  } );
};

const editCustomer = async ( id ) => {
  const customerId = id;
  let fetchCustomer = await fetch( `/Customers/Edit/${ customerId }` );
  let dataCustomer = fetchCustomer.json();
  const parentModalDOM = document.querySelector( `#modal-edit-customer-${ customerId }` );
  const modalBody = parentModalDOM.querySelector( '.modal-body' );
  const editFormDOM = parentModalDOM.querySelector( `#edit-customer-form-${ customerId }` );
  const btnSubmit = editFormDOM.querySelector( `#submit-form-edit-customer-${ customerId }` );
  const btnRemove = parentModalDOM.querySelectorAll( '.remove-form' );
  dataCustomer.then( result => {
    {
      editFormDOM.insertAdjacentHTML( "afterbegin", editCustomerDOM( result.customer, result, customerId ) );
      $( '[data-control="select2"]' ).select2( {
        dropdownParent: parentModalDOM
      } );
    }
  } );
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
        bootstrap: new FormValidation.plugins.Bootstrap5( {
          rowSelector: '.fv-row',
          eleInvalidClass: '',
          eleValidClass: ''
        } )
      }
    }
  );
  $( editFormDOM.querySelector( '[name="Vocative"]' ) ).on( 'change', function () {
    // Revalidate the field when an option is chosen
    validator.revalidateField( 'Vocative' );
  } );
  $( editFormDOM.querySelector( '[name="Gender"]' ) ).on( 'change', function () {
    // Revalidate the field when an option is chosen
    validator.revalidateField( 'Gender' );
  } );
  $( editFormDOM.querySelector( '[name="ProvinceID"]' ) ).on( 'change', function () {
    // Revalidate the field when an option is chosen
    validator.revalidateField( 'ProvinceID' );
  } );
  $( editFormDOM.querySelector( '[name="CustomerTypeID"]' ) ).on( 'change', function () {
    // Revalidate the field when an option is chosen
    validator.revalidateField( 'CustomerTypeID' );
  } );
  btnSubmit.addEventListener( 'click', function ( e ) {
    e.preventDefault();
    if ( validator ) {
      validator.validate().then( function ( status ) {
        if ( status === 'Valid' ) {
          editFormDOM.submit();
        }
      } );
    }
  } );
  btnRemove.forEach( e => {
    e.addEventListener( 'click', function ( e ) {
      validator.resetForm();
    } );
  } );
};

const CustomerBookings = async ( id ) => {
  console.log("sdfbshdj")
  const customerId = id;
  console.log("customerId",customerId)

  let fetchListBookings = await fetch( `/Customers/ListBookings/${ customerId }` );
  let dataListBookings = fetchListBookings.json();

  console.log("dataListBookings",dataListBookings)


  const parentModalDOM = document.querySelector( `#modal-customer-bookings-${ customerId }` );
  const modalBody = parentModalDOM.querySelector( '.modal-body' );
  const contentForm = parentModalDOM.querySelector( `#customer-bookings-form-${ customerId }` );
  dataListBookings.then( result => {
    {
      contentForm.insertAdjacentHTML( "afterbegin", result.bookings.map( item => customerBookingsDOM( item ) ).join( '' ) );
    }
  } );
};