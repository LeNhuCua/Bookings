$(document).ready(() => {
    $('#ckhAllCtrl').on('click', function (e) {
        if (!$('#ckhAllCtrl').is(":checked")) {
            $('table td input[type=checkbox]').prop("checked", false);
        } else {
            $('table td input[type=checkbox]').prop("checked", true);
        }
    });
    $('.parentCtrl').on('click', function (e) {
        if (!$(this).is(":checked")) {
            $(this).prop("checked", false);
            let parent = $(this).val();
            $('table td input[type="checkbox"][data-parent="' + parent + '"]').each(function () {
                $('table td input[type="checkbox"][data-parent="' + parent + '"]').prop("checked", false);

                let id = $(this).val();
                $('#list-action-' + id + ' input[type="checkbox"]').each(function () {
                    $('#list-action-' + id + ' input[type="checkbox"]').prop("checked", false);
                });
            });
        } else {
            $(this).prop("checked", true);
            let parent = $(this).val();
            $('table td input[type="checkbox"][data-parent="' + parent + '"]').each(function () {
                $('table td input[type="checkbox"][data-parent="' + parent + '"]').prop("checked", true);

                let id = $(this).val();
                $('#list-action-' + id + ' input[type="checkbox"]').each(function () {
                    $('#list-action-' + id + ' input[type="checkbox"]').prop("checked", true);
                });
            });
        }
    });

    $('.ckhCtrl').on('click', function (e) {
        if (!$(this).is(":checked")) {
            $(this).prop("checked", false);
            let id = $(this).val();
            $('#list-action-' + id + ' input[type="checkbox"]').each(function () {
                $('#list-action-' + id + ' input[type="checkbox"]').prop("checked", false);
            });
        } else {
            $(this).prop("checked", true);
            let id = $(this).val();
            $('#list-action-' + id + ' input[type="checkbox"]').each(function () {
                $('#list-action-' + id + ' input[type="checkbox"]').prop("checked", true);
            });
        }
    });


    $('.ckhItemAct').on('click', function (e) {
        if (!$(this).is(":checked")) {
            $(this).prop("checked", false);
        } else {
            $(this).prop("checked", true);
            let parent = $(this).parent().parent().parent().attr("id").replace("list-action-", "");;
            $('table td input[type="checkbox"][value="' + parent + '"]').prop("checked", true);
        }
    });
})