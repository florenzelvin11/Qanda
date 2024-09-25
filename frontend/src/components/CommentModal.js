import { apiCall } from "../helpers.js";
import { generateGlobalAlert } from "./Alert.js";
import { Button } from "./Button.js";
import { Modal } from "./Modal.js";
import { ShowThread } from "./Thread.js";

export const CommentModal = () => {
    const cmtModal = Modal({
        id: "comment-modal",
        title: "Add a comment",
        elems: [
            commentModalBody()
        ],
        submitLabel: "Comment",
        onSubmit: handleCommentSubmit,
        onClose: handleCommentClose,
        submitDisabled: true,
    })

    return cmtModal;
}

const commentModalBody = () => {
    const textArea = document.createElement('textarea');
    textArea.classList.add('form-control', 'mb-3')
    textArea.id = "mdl-comment-textarea";
    textArea.oninput = handleCommentInput;
    textArea.setAttribute('rows', '6');

    return textArea;
}

// Thread Comments
export const commentModalBtn = (props) => Button({
    id: props.id,
    threadId: props.id,
    type: "comment",
    label: "Comment",
    isModal: true,
    modalType: "comment",
    onClick: defaultHandleClick,
});

// Reply to comments within a thread
export const replyModalBtn = (props) => Button({
    id: props.id,
    threadId: props.threadId,
    parentId: props.id,
    type: "reply",
    label: "Reply",
    isModal: true,
    modalType: "comment",
    onClick: defaultHandleClick,
});

const defaultHandleClick = (event) => {
    event.preventDefault();
    const btn = event.target.closest('button');

    const threadId = btn.getAttribute('thread-id');
    const parentId = btn.getAttribute('parent-comment-id');

    // Attach it to the modal
    const cmtModal = document.getElementById('comment-modal');
    cmtModal.setAttribute('thread-id', threadId);
    parentId && cmtModal.setAttribute('parent-comment-id', parentId);
}

const handleCommentInput = (event) => {
    event.preventDefault();

    const modal = event.target.closest('#comment-modal');
    const textArea = event.target;
    const subBtn = modal.querySelector('.btn-primary');

    if (textArea.value === '') {
        subBtn.disabled = true;
    } else {
        subBtn.disabled = false;
    }
}

const handleCommentSubmit = (event) => {
    event.preventDefault();

    const cmtModal = document.getElementById('comment-modal');
    const threadId = cmtModal.getAttribute('thread-id');
    const parentCommentId = cmtModal.getAttribute('parent-comment-id');
    const contentElem = document.getElementById('mdl-comment-textarea');


    const content = contentElem.value;

    if (content === "") {
        contentElem.classList.add('is-invalid');
        return;
    } else {
        contentElem.classList.remove('is-invalid');
        contentElem.classList.add('is-valid');
    }
    const request = {
        content: content,
        threadId,
        parentCommentId,
    }

    apiCall('POST', '/comment', request)
        .then(() => {
            contentElem.value = "";
            ShowThread({ threadId });
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });
}

const handleCommentClose = (event) => {
    event.preventDefault();

    const cmtInput = document.getElementById('mdl-comment-textarea');
    cmtInput.value = "";
}