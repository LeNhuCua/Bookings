/**
 * @example
 * <input 
 *     type="file"
 *     onchange="fImageInput(this, event)"
 *     data-preview-target="#avatar-preview"
 * />
 * <div>
 *     <img src="" alt="" id="avatar-preview" />
 * </div>
 * @param {HTMLInputElement} inputElement 
 */
const fImageInput = (inputElement) => {
    const { previewTarget } = inputElement.dataset;
    const previewTargetDOM = document.querySelector(previewTarget);
    const [file] = inputElement.files;
    const previewUrl = URL.createObjectURL(file);
    previewTargetDOM.src = previewUrl;
};

/**
 * @param {HTMLElement} element 
 */
const fDropzone = (element) => {
    const entityID = element.dataset.entityId;
    const uploadPath = element.dataset.uploadPath;
    const previewPath = element.dataset.previewPath;
    const targetInput = element.dataset.targetInput;
    const targetInputDOM = document.querySelector(`input[name="${targetInput}"]`);

    if (!entityID) throw Error('Entity id is not provided');
    if (!uploadPath) throw Error('Upload path is not provided');
    if (!previewPath) throw Error('Preview path is not provided');
    if (!targetInput) throw Error('Target input is not provided');
    if (!targetInputDOM) throw Error('Target input DOM does not exist');

    const dropzone = new Dropzone(element, {
        url: `/upload/singleimage?path=${uploadPath}&entityID=${entityID}`,
        paramName: () => 'file',
        maxFiles: 16,
        maxFilesize: 64,
        addRemoveLinks: true,
        //uploadMultiple: true,
        //parallelUploads: 5,
        acceptedFiles: '.jpg,.png,.jpeg,.svg',
    });

    dropzone.on('success', (file, response) => {
        file.id = response.url;
        file._removeLink.dataset.url = response.url;
        targetInputDOM.value = [
            ...targetInputDOM.value.split(',').filter(Boolean),
            response.url
        ].join(',');
    });

    // dropzone.on('successmultiple', (files, responseUrls) => {
    //     targetInputDOM.value = [
    //         ...targetInputDOM.value.split(',').filter(Boolean),
    //         ...responseUrls
    //     ].join(',');
    // });

    dropzone.on('removedfile', (file) => {
        const removedUrl = file.id;
        targetInputDOM.value = targetInputDOM.value.split(',')
            .filter(url => url !== removedUrl)
            .filter(Boolean)
            .join(',');
    });

    // hiển thị những image đã có sẵn khi chỉnh sửa dữ liệu
    const currentImages = targetInputDOM.value.split(',').filter(Boolean).map(url => ({
        name: url,
        id: url,
    }));

    for (const image of currentImages) {
        dropzone.files.push(image);
        dropzone.displayExistingFile(image, `${previewPath}/${image.id}`);
    }
}


/**
 * @example
 * <div class="dropzone" 
 *      data-control="dropzone" 
 *      data-target-input="Gallery" 
 *      data-upload-path="my-upload-path" 
 *      data-entity-id="1234"
 *      data-preview-path="/media/my-upload-path/1234"
 * >
 *     <div class="dz-message needsclick">
 *         <div class="ms-4">
 *             <h3 class="fs-5 fw-bold text-gray-900">Drop files here or click to upload.</h3>
 *         </div>
 *     </div>
 * </div>
 * <input type="hidden" name="Gallery">
 */
const initFDropzone = () => {
    document.querySelectorAll('[data-control="dropzone"]').forEach(dropzoneElement => {

    });
};

initFDropzone();
