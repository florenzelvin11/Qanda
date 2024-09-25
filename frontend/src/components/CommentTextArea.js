import { apiCall } from "../helpers.js";
import { generateGlobalAlert } from "./Alert.js";
import { ShowThread } from "./Thread.js";

export const CommentTextArea = (props) => {
    const parentContainer = document.createElement('div');
    parentContainer.id = 'first-comment-section';
    parentContainer.classList.add('first-comment-section');

    const header = document.createElement('h3');
    header.textContent = "Your Comment";
    parentContainer.append(header);

    const form = document.createElement('form');
    form.id = "first-comment-form";
    form.setAttribute('thread-id', props.threadId);
    form.onsubmit = handleCmtSubmit;
    parentContainer.append(form);

    const textArea = document.createElement('textarea');
    textArea.classList.add('form-control', 'mb-3')
    textArea.id = "first-comment-textarea";
    textArea.setAttribute('rows', '6');
    form.append(textArea);

    const div = document.createElement('div');
    form.append(div);
    const postBtn = document.createElement('button');
    postBtn.type = "submit";
    postBtn.classList.add('btn', 'btn-primary', 'mb-3');
    postBtn.textContent = "Post";

    const cancelBtn = document.createElement('button');
    cancelBtn.type = "button";
    cancelBtn.classList.add('btn', 'btn-secondary', 'mb-3');
    cancelBtn.textContent = "Cancel"
    cancelBtn.onclick = clearTextArea;
    div.append(cancelBtn, postBtn);

    return parentContainer;
};

const handleCmtSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const threadId = form.getAttribute('thread-id');

    const contentElem = form['first-comment-textarea'];
    const content = contentElem.value;

    if (content === "") {
        contentElem.classList.add('is-invalid');
        return;
    } else {
        contentElem.classList.remove('is-invalid');
        contentElem.classList.add('is-valid');
    }
    const request = {
        content,
        threadId,
        parentCommentId: null,
    }

    apiCall('POST', '/comment', request)
        .then(() => {
            const parentContainer = document.getElementById('thread');
            const firstCmt = document.getElementById('first-comment-section');
            parentContainer.removeChild(firstCmt);

            console.log(threadId);
            ShowThread({ threadId });
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });
}

const clearTextArea = (event) => {
    event.preventDefault();

    const form = event.target.closest('form');
    const textArea = form['first-comment-textarea'];
    textArea.value = "";
}
