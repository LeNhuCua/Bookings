jQuery( window ).on( 'load', function () {
    const mceElf = new tinymceElfinder( {
        // connector URL (Use elFinder Demo site's connector for this demo)
        url: '/file-manager-connector',
        // upload target folder hash for this tinyMCE
        uploadTargetHash: 'elf_v1_bWVkaWE1', // l3 MCE_Imgs on elFinder Demo site for this demo
        // elFinder dialog node id
        nodeId: 'elfinder',
    });
    $(document).on('focusin', function (e) {
        if ($(e.target).closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root").length) {
            e.stopImmediatePropagation();
        }
    });
    tinyMCE.init( {
        selector: '.tinymce',
        height: 500,
        entity_encoding: 'raw',
        plugins:
            'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking save table directionality emoticons paste',
        toolbar:
            'undo redo searchreplace | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | code preview print | forecolor backcolor emoticons charmap',
        file_picker_callback: mceElf.browser,
        relative_urls: false,
        remove_script_host: false,
        convert_urls: false,
    });
    // // Prevent Bootstrap dialog from blocking focusin
    // initTinymce();
 
});
