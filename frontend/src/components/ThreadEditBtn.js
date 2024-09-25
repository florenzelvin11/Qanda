import { Button } from "./Button.js";
import { navigateTo } from "../helpers.js";

export const ThreadEditBtn = (props) => Button({
    id: props.id,
    threadId: props.id,
    type: "edit",
    label: "Edit",
    isModal: false,
    onClick: defaultHandleClick,
});

const defaultHandleClick = (event) => {
    event.preventDefault();

    const edtBtn = event.target.closest('button');
    const threadId = edtBtn.getAttribute('thread-id');
    navigateTo(`#edit-thread=${threadId}`);
}