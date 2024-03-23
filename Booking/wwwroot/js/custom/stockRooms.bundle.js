"use strict";
var hotelsFunction = function () {
    var initHotel = () => {
        KTUtil.on(document, '[data-items="destination"]', 'change', function (e) {
            const val = e.target.value;
            const selectHotels = document.querySelector('[data-items="hotel"]');
            $.ajax({
                url: "/Hotels/GetHotels",
                method: "get",
                data: { "destinationID": val },
                success: function (result) {
                    $(selectHotels).empty();
                    var html = '<option value="00000000-0000-0000-0000-000000000000">Chọn khách sạn</option>';
                    if (result.length != 0) {
                        for (var i = 0; i < result.length; i++) {
                            html += '<option value="' + result[i].id + '">' + result[i].name + '</option>';
                        }
                    }
                    selectHotels.innerHTML = html;
                    $(selectHotels).select2({
                        dropdownParent: $("#modal-dialog-crud")
                    });
                }
            });
        });

        KTUtil.on(document, '[data-items="hotel"]', 'change', function (e) {
            const val = e.target.value;
            const listRooms = document.querySelector('#data-update-room-avaiable');

            const selectPeriods = document.querySelector('[data-items="periods"]');
            $.ajax({
                url: "/Hotels/GetPeriods",
                method: "Post",
                data: { "hotelID": val },
                success: function (result) {
                    $(selectPeriods).empty();
                    var html = '<option value="00000000-0000-0000-0000-000000000000">Chọn giai đoạn giá</option>';
                    if (result.length != 0) {
                        for (var i = 0; i < result.length; i++) {
                            html += '<option value="' + result[i].id + '">' + result[i].name + '</option>';
                        }
                    }
                    selectPeriods.innerHTML = html;
                }
            });
            $.ajax({
                url: "/RoomTypes/GetRooms",
                method: "get",
                data: { "hotelID": val },
                success: function (result) {
                    var html = '';
                    if (result.length != 0) {
                        for (var i = 0; i < result.length; i++) {
                            html += '<tr>';
                            html += '<td>';
                            html += '<div class="d-flex align-items-center">';
                            html += '<div class="symbol symbol-50px">';
                            html += '<span class="symbol-label border border-gray-300 border-dashed rounded" style="background-image:url(/media/blank-image.svg);"></span>';
                            html += '</div>';
                            html += '<div class="ms-5">';
                            html += '<div class="text-gray-800 text-hover-primary fs-5 fw-bolder">' + result[i].name + '</div>';
                            html += '<div class="fw-bold fs-7">';
                            html += 'Hướng/View phòng: <span>' + result[i].viewType.name + '</span>';
                            html += '</div>';
                            html += '<div class="text-muted fs-7">Bữa ăn: ' + result[i].meal + ' | Giường: ' + result[i].bed + '</div>';
                            html += '</div>';
                            html += '</div>';
                            html += '</td>';
                            html += '<td>';
                            html += '<input class="form-control" autocomplete="off" type="number" value="0" name="Quantity" placeholder="Số tồn">';
                            html += '</td>';
                            html += '<td>';
                            html += '<input class="form-control" autocomplete="off" type="number" value="0" name="CostPrice" placeholder="Giá vốn">';
                            html += '</td>';
                            html += '<td class="text-end pe-5">';
                            html += '<input class="form-control" autocomplete="off" type="number" value="0" name="Price" placeholder="Giá bán">';
                            html += '<input type="hidden" name="RoomTypeID" value="' + result[i].id + '">';
                            html += '</td>';
                            html += '</tr>';
                        }
                    }
                    listRooms.innerHTML = html;
                }
            });
        });
    }

    return {
        // Public functions
        init: function () {
            initHotel();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    hotelsFunction.init();
});
