export const Modal = (props) => {
    // {
    //     id,
    //     title,
    //     elems, 
    //     submitLabel
    //     onSubmit
    //     onClose
    //     submitDisabled
    // }
    const modalSection = document.createElement('div');
    modalSection.classList.add('modal', 'fade');
    modalSection.id = props?.id;
    modalSection.tabIndex = "-1";
    modalSection.setAttribute('data-bs-backdrop','static');
    modalSection.setAttribute('data-bs-keyboard','false');
    modalSection.setAttribute('aria-labelledby', 'Modal');
    modalSection.setAttribute('aria-hidden', 'true');

    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal-dialog',  'modal-dialog-centered', 'modal-dialog-scrollable');
    modalSection.append(modalDiv);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalDiv.append(modalContent);

    const header = document.createElement('div');
    header.classList.add('modal-header');
    modalContent.append(header);

    const title = document.createElement('h1');
    title.classList.add('modal-title', 'fs-5');
    title.id = "modal-title";
    title.innerText = props?.title;
    header.append(title);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    props?.elems && modalBody.append(...props.elems);
    props?.elems && modalContent.append(modalBody);

    const footer = document.createElement('div');
    footer.classList.add('modal-footer');
    modalContent.append(footer);

    const btnClose = createBtn(['btn', 'btn-secondary'], "Close", props?.onClose);

    const btnSubmit = createBtn(['btn', 'btn-primary'], props?.submitLabel || "Save", props?.onSubmit, props?.submitDisabled);

    footer.append(btnClose, btnSubmit);

    // Load content to the page
    const content = document.createDocumentFragment();
    content.append(modalSection);

    return content;
};

const createBtn = (classLst = [], label, onSubmit = () => {}, disabled=false) => {
    const btnClose = document.createElement('button');
    btnClose.type = "button";
    btnClose.classList.add(...classLst);
    btnClose.innerText = label;
    btnClose.setAttribute('data-bs-dismiss', 'modal');
    btnClose.onclick = onSubmit;
    btnClose.disabled = disabled;
    return btnClose;
}
