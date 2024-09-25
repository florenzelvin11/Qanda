import { CommentItem } from "./CommentItem.js";

export const CommentSection = (props) => {
    const parentContainer = document.createElement('div');
    parentContainer.classList.add('comment-section', 'mb-5');

    // header
    const cmtSecHeader = document.createElement('div');
    cmtSecHeader.classList.add('comment-section-header');
    parentContainer.appendChild(cmtSecHeader);
    const headerTitle = document.createElement('h3');
    headerTitle.textContent = "Comments";
    cmtSecHeader.appendChild(headerTitle);

    // Comments
    props.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .reverse()
        .forEach((comment) => {
            // const thComment = createComment(comment);
            const thComment = CommentItem(comment);
            if (thComment) parentContainer.append(thComment);
        })

    return parentContainer;
}