import { apiCall, navigateTo } from "../helpers.js";
import { generateGlobalAlert } from "./Alert.js";
import { Modal } from "./Modal.js";


export const ThreadForm = (props) => {
    // {
    //     threadId,
    //     formTitle,
    //     title,
    //     content,
    //     isPublic,
    // }


    // ========================= HTML ============================= //

    // Components
    const section = document.createElement('section');
    section.classList.add('container');
    section.id = "thread-form-section";

    // Page title
    const formTitle = document.createElement('h1');
    formTitle.classList.add('mt-4', 'mb-3');
    formTitle.textContent = props?.formTitle || "Create Thread";
    section.append(formTitle);

    // Form
    const form = document.createElement('form');
    form.id = "thread-form";
    props?.isEdit && form.setAttribute('is-edit', props.isEdit);
    form.setAttribute('thread-id', props?.threadId);
    section.append(form);

    // Helper Div
    let div;
    const divRow = (...items) => {
        const div = document.createElement('div');
        div.classList.add('row', 'mb-3')
        div.append(...items);
        return div;
    };

    // Title Label
    const titleLabel = document.createElement('label');
    titleLabel.for = "title";
    titleLabel.classList.add('col-sm-1', 'col-form-label', 'col-form-label-lg');
    titleLabel.innerText = "Title";

    // Input Title
    div = document.createElement('div');
    div.classList.add('col-md-11');
    const inputTitle = document.createElement('input');
    inputTitle.type = "text";
    inputTitle.classList.add('form-control', 'form-control-lg');
    inputTitle.id = "title";
    inputTitle.value = props?.title || "";
    div.append(inputTitle);
    form.append(divRow(titleLabel, div));

    // Input Content
    div = document.createElement('div');
    div.classList.add('col-md-12');
    const textArea = document.createElement('textarea');
    textArea.classList.add('form-control');
    textArea.id = "content-text-area";
    textArea.rows = "10";
    textArea.placeholder = "Write about something...";
    textArea.value = props?.content || "";
    div.append(textArea);
    form.append(divRow(div));

    // Checkbox
    div = document.createElement('div');
    div.classList.add('col-sm-12');
    const checkBox = document.createElement('input');
    checkBox.classList.add('form-check-input', 'check-section');
    checkBox.type = 'checkbox';
    checkBox.id = 'private-check';
    checkBox.checked = props?.isPublic ? false : true;
    const checkLabel = document.createElement('label');
    checkLabel.classList.add('form-check-label', 'check-section');
    checkLabel.for = "private-check";
    const privLabel = document.createElement('div');
    privLabel.classList.add('private-check-label');
    privLabel.innerText = "Private";
    const privSubLabel = document.createElement('div');
    privSubLabel.classList.add('private-check-sub-label');
    privSubLabel.innerText = "Only visible to you";
    checkLabel.append(privLabel, privSubLabel);
    div.append(checkBox, checkLabel);
    form.append(divRow(div));

    // Button
    const btnSection = document.createElement('div');
    btnSection.classList.add('btn-section');
    const button = (label) => {
        const btn = document.createElement('div');
        btn.innerText = label;
        return btn;
    }
    const cancelBtn = button('Cancel');
    cancelBtn.classList.add('btn', 'btn-secondary', 'mb-3');
    cancelBtn.setAttribute('data-bs-toggle', 'modal');
    cancelBtn.setAttribute('data-bs-target', '#cancelModal');

    // 
    const postBtn = button(props?.threadId && 'Save'|| 'Post');
    postBtn.classList.add('btn', 'btn-primary', 'mb-3');
    postBtn.onclick = handleSubmit;
    btnSection.append(cancelBtn, postBtn);
    form.append(divRow(btnSection));

    // Modal
    const modal = Modal({
        id: "cancelModal",
        title: "Are you sure you want to continue?",
        elems: [textDiv],
        submitLabel: "Discard",
        onSubmit: props?.onCancel || handleModalCancel,
    });

    section.append(modal);

    // Load content to the page
    const content = document.createDocumentFragment();
    content.append(section);

    return content;
}

const textDiv = document.createTextNode('You have not posted your thread. It will be lost if you proceed');

const handleModalCancel = (event) => {
    event.preventDefault();

    navigateTo("#dashboard");
};

const handleSubmit = (event) => {
    event.preventDefault();

    const form = document.getElementById('thread-form');
    const isEdit = form.getAttribute('is-edit');
    const id = form.getAttribute('thread-id');
    const titleElem = form['title'];
    const contentElem = form['content-text-area'];
    const isPublicElem = form['private-check'];
    
    // values
    const title = titleElem.value;
    const content = contentElem.value;
    const isPublic = !isPublicElem.checked;
    // Input validation

    if (title === "") {
        titleElem.classList.add('is-invalid');
        return;
    } else {
        titleElem.classList.remove('is-invalid');
        titleElem.classList.add('is-valid');
    }

    if (content === "") {
        contentElem.classList.add('is-invalid');
        return;
    } else {
        contentElem.classList.remove('is-invalid');
        contentElem.classList.add('is-valid');
    }

    if (!isEdit) {
        const request = {
            title,
            isPublic,
            content,
        };

        apiCall('POST', '/thread', request)
            .then((data) => {
                console.log(data);
                navigateTo(`#thread=${data.id}`);
            })
            .catch((err) => {
                console.log(err);
                generateGlobalAlert({ alertType: 'alert-warning', alertText: err });
            })
    } else {
        const request = {
            id,
            title,
            isPublic,
            lock: false,
            content,
        };

        console.log("Editted")
    
        apiCall('PUT', '/thread', request)
            .then(() => {
                navigateTo(`#thread=${id}`);
            })
            .catch((err) => {
                console.log(err);
                generateGlobalAlert({ alertType: 'alert-warning', alertText: err });
            })
    }

}