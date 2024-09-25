export const Button = (props) => {
    // {
    //     id,
    //     threadId,
    //     parentId;
    //     type,
    //     label
    //     isModal,
    //     modalType,
    //     onClick,
    // }
    const btn = document.createElement('button');
    btn.id = `${props.type}-btn-${props.id}`;
    btn.type = "button";
    btn.classList.add('btn');
    btn.setAttribute('thread-id', props.threadId);
    props?.parentId && btn.setAttribute('parent-comment-id', props.parentId);

    if (props?.isModal) {
        btn.setAttribute('data-bs-toggle', 'modal');
        btn.setAttribute('data-bs-target', `#${props.modalType}-modal`);
    }

    btn.onclick = props?.onClick || null;

    btn.textContent = props?.label || "";

    return btn;
}