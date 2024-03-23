class TextEditor extends HTMLTextAreaElement {
    constructor() {
        super();
        initTinymce();
    }
}

customElements.define('text-editor', TextEditor, { extends: 'textarea' });
