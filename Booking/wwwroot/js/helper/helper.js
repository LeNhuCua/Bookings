KTUtil.on(document, '.input-currency', 'keyup', (e) => {
    document.querySelectorAll('.input-currency').forEach(value => new Cleave(value, {
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
    }));
});
KTUtil.on(document, '.input-phone', 'keyup', (e) => {
    document.querySelectorAll('.input-phone').forEach(value => new Cleave(value, {
        phone: true,
        phoneRegionCode: 'VN'
    }));
});
KTUtil.on(document, '.input-time', 'keyup', (e) => {
    document.querySelectorAll('.input-time').forEach(value => new Cleave(value, {
        time: true,
        timePattern: ['h', 'm']
    }));
});
KTUtil.on(document, '[data-date-time="flatpickr"]', 'click', (e) => {
    $('[data-date-time="flatpickr"]').flatpickr({
        altInput: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d"
    });
});

const buildOptions = (data = [], valueKey = '', labelKey = '', selectedValue = '', defaultOption = '', disabled = true) => {
    const _disabled = disabled ? 'disabled' : '';
    let defaultOptionHtml = '';
    if (defaultOption !== '') {
        defaultOptionHtml = `<option value="" selected ${_disabled}>${defaultOption}</option>`;
    }
    const optionHtml = data.map((item) => {
        return `<option ${selectedValue === item[valueKey] && 'selected'} value="${item[valueKey]}">${item[labelKey]}</option>`;
    }).join('');
    return defaultOptionHtml + optionHtml;
};


function buildOptionsTwoLevelInTraining(data, valueKey = '', labelKey = '', selectedValue = '') {
    const groupByParentCategory = Object.groupBy(data, ({ parentCategoryId }) => parentCategoryId)
    const categoriesLevel1 = {};
    const arrParentCategory = data.filter(item => !item.parentCategoryId);
    return arrParentCategory.map(item => {
        if(groupByParentCategory[item.id]) {
            return `
                <optgroup label="${item.title}">
                ${
                    groupByParentCategory[item.id].map(subItem => {
                        return `
                            <option ${selectedValue === subItem[valueKey] && 'selected'} value="${subItem[valueKey]}">
                            ${subItem[labelKey]}
                            </option>
                        `
                    }).join('')
                }
                </optgroup>
            `
        } else {
            return `<option ${selectedValue === item[valueKey] && 'selected'} value="${item[valueKey]}">${item[labelKey]}</option>`;
        }
    }).join('')

    // const level1Options = data
    //     .filter(item => !item.parentCategoryId)
    //     .map(item => {
    //         categoriesLevel1[item[valueKey]] = item[labelKey];
    //         return `<option value="${item[valueKey]}">${item[labelKey]}</option>`;
    //     })
    //     .join('');
    //
    // const level2Options = data
    //     .filter(item => item.parentCategoryId)
    //     .map(item => `
    //         <optgroup label="${categoriesLevel1[item.parentCategoryId]}">
    //             <option ${selectedValue === item[valueKey] && 'selected'} value="${item[valueKey]}">
    //                 ${categoriesLevel1[item.parentCategoryId]} - ${item[labelKey]}
    //             </option>
    //         </optgroup>
    //     `)
    //     .join('');
    //
    // const selectHtml = `
    //     ${level1Options}
    //     ${level2Options}
    // `;
    //
    // return selectHtml;
}


const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/** DD-MM-YYYY */
/**
 * @param {Date | string} date
 * @returns
 */
const formatDateTime = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('vi-VN', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        formatMatcher: "best fit"
    }).format(new Date(date)).replaceAll("/", "-");
};

/** YYYY-MM-DD */
const formatDateTimeV2 = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-CA', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        formatMatcher: "best fit"
    }).format(new Date(date)).replaceAll("/", "-");
}

// returns duration object with the duration between from and to
const countBetweenDay = (from, to) => {
    if (!from || !to) return;
    const _from = moment(from);
    const _to = moment(to);
    const duration = _to.diff(_from, "days")
    return duration === 0 ? 1 : duration;
};

const triggerSelect2Change = (selectElement = new HTMLSelectElement(), value = '') => {
    if (!selectElement.querySelector(`option[value="${value}"]`) || value === '') {
        return;
    }

    selectElement.value = value;
    $(selectElement).trigger({
        type: 'select2:select',
        params: {
            data: selectElement.value
        },
    });
    selectElement.dispatchEvent(new Event('change'));
};

// get total days in month
const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
}

/**
 * Tính phầm trăm tăng trưởng
 * @param {number} value
 * @param {number} prevValue
 * @returns
 */
const calculateGrowthPercentage = (value, prevValue) => {
    const result = prevValue > 0
        ? Number( // dùng number để bỏ .00
            (
                (value - prevValue)
                / prevValue * 100
            ).toFixed(2)
        )
        : 100;

    if (result === 100 && value === 0) {
        return 0;
    }

    return result;
};

const RandomString = (length, type) => {
    let result = '';
    let characters = ''
    switch (type) {
        case 'uppercase':
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break;
        case 'lowercase':
            characters = 'abcdefghijklmnopqrstuvwxyz';
            break
        case 'number':
            characters = '0123456789';
            break;
        default:
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function RandomGender(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const initTinymce = () => {
    tinymce.activeEditor?.destroy();
    const mceElf = new tinymceElfinder({
        // connector URL (Use elFinder Demo site's connector for this demo)
        url: '/file-manager-connector',
        // upload target folder hash for this tinyMCE
        uploadTargetHash: 'elf_v1_bWVkaWE1', // l3 MCE_Imgs on elFinder Demo site for this demo
        // elFinder dialog node id
        nodeId: 'elfinder',
    });
    // Prevent Bootstrap dialog from blocking focusin
    document.addEventListener('focusin', (e) => {
        if (e.target.classList.contains('tox-textfield') || e.target.classList.contains('tox-textarea')) {
            e.stopImmediatePropagation();
        }
    }, {
        capture: true,
    });
    tinyMCE.init({
        selector: '.tinymce',
        height: 500,
        entity_encoding: 'raw',
        plugins:
            'advlist autolink link image lists charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking save table directionality emoticons paste',
        toolbar:
            'undo redo searchreplace | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | code preview print | forecolor backcolor emoticons charmap',
        file_picker_callback: mceElf.browser,
        relative_urls: true,
        remove_script_host: false,
        convert_urls: false,
        ui_mode: 'split',
    });
}
