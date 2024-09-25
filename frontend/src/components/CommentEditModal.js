import { apiCall } from "../helpers.js";
import { generateGlobalAlert } from "./Alert.js";
import { Button } from "./Button.js";
import { Modal } from "./Modal.js";
import { ShowThread } from "./Thread.js";

export const CommentEditModal = () => {
    const cmtEditModal = Modal({
        id: "comment-edit-modal",
        title: "Edit comment",
        elems: [
            editCmtModalBody()
        ],
        submitLabel: "Comment",
        onSubmit: handleEditCmtSubmit,
    })

    return cmtEditModal;
}

const editCmtModalBody = () => {
    const textArea = document.createElement('textarea');
    textArea.classList.add('form-control', 'mb-3')
    textArea.id = "mdl-edit-cmt-textarea";
    textArea.oninput = handleEditCmtInput;
    textArea.setAttribute('rows', '6');

    return textArea;
}

const handleEditCmtInput = (event) => {
    event.preventDefault();

    const modal = event.target.closest('#comment-edit-modal');
    const textArea = event.target;
    const subBtn = modal.querySelector('.btn-primary');

    if (textArea.value === '') {
        subBtn.disabled = true;
    } else {
        subBtn.disabled = false;
    }
}

const handleEditCmtSubmit = (event) => {
    event.preventDefault();

    const cmtModal = document.getElementById('comment-edit-modal');
    const threadId = cmtModal.getAttribute('thread-id');
    const commentId = cmtModal.getAttribute('comment-id');
    const contentElem = document.getElementById('mdl-edit-cmt-textarea');

    const content = contentElem.value;

    if (content === "") {
        contentElem.classList.add('is-invalid');
        return;
    } else {
        contentElem.classList.remove('is-invalid');
        contentElem.classList.add('is-valid');
    }

    const request = {
        id: commentId,
        content,
    }

    apiCall('PUT', '/comment', request)
        .then((data) => {
            contentElem.value = "";
            ShowThread({ threadId });
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });

}

export const editCmtMdlBtn = (props) => {
    const btn = Button({
        id: props.threadId,
        threadId: props.threadId,
        type: "edit",
        label: "Edit",
        isModal: true,
        modalType: 'comment-edit',
        onClick: handleOpenCmtEditModal,
    })
    btn.setAttribute('comment-id', props.id);
    btn.setAttribute('comment-content', props.content);

    return btn;
}

const handleOpenCmtEditModal = (event) => {
    event.preventDefault();
    const btn = event.target.closest('button');

    const threadId = btn.getAttribute('thread-id');
    const commentId = btn.getAttribute('comment-id');
    const content = btn.getAttribute('comment-content');

    // Attach it to the modal
    const cmtModal = document.getElementById('comment-edit-modal');
    cmtModal.setAttribute('comment-id', commentId);
    cmtModal.setAttribute('thread-id', threadId);
    const textArea = cmtModal.querySelector("#mdl-edit-cmt-textarea");
    textArea.value = content;
}
