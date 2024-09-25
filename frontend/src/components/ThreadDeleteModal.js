import { apiCall, navigateTo } from "../helpers.js";
import { generateGlobalAlert } from "./Alert.js";
import { Button } from "./Button.js";
import { Modal } from "./Modal.js";

export const ThreadDeleteModal = () => {
    const deleteTextWarning = document.createTextNode('This is a permanent action. It will be lost if you proceed');

    const deleteModal = Modal({
        id: "delete-modal",
        title: "Are you sure you?",
        elems: [
            deleteTextWarning
        ],
        submitLabel: "Delete",
        onSubmit: handleDeleteSubmit,
    });

    return deleteModal;
}

const handleDeleteSubmit = (event) => {
    event.preventDefault();

    const cmtModal = document.getElementById('delete-modal');
    const threadId = cmtModal.getAttribute('thread-id');

    const request = {
        id: threadId,
    }

    apiCall('DELETE', '/thread', request)
        .then(() => {
            navigateTo('#dashboard');
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });
}

export const deleteModalBtn = (props) => Button({
    id: props.id,
    threadId: props.id,
    type: "delete",
    label: "Delete",
    isModal: true,
    modalType: "delete",
    onClick: handleOpenDeleteModal,
})

const handleOpenDeleteModal = (event) => {
    event.preventDefault();
    const btn = event.target.closest('button');

    const threadId = btn.getAttribute('thread-id');

    // Attach it to the modal
    const cmtModal = document.getElementById('delete-modal');
    cmtModal.setAttribute('thread-id', threadId);
}
