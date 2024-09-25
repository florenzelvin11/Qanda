import { defaultImgUrl, formatTimeSince, getUserInfo, isLocalOwner } from "../helpers.js";
import { editCmtMdlBtn } from "./CommentEditModal.js";
import { replyModalBtn } from "./CommentModal.js";
import { createLikeBtn } from "./LikeBtn.js";

export const CommentItem = (props) => {
    // {
    //     "id": 685788,
    //     "creatorId": 83143,
    //     "threadId": 350404,
    //     "parentCommentId": null,
    //     "content": "asdfasdf",
    //     "createdAt": "2024-03-20T12:32:28.643Z",
    //     "likes": [],
    // }

    const parentContainer = document.createElement('div');
    parentContainer.id = `comment-item-${props.id}`;
    parentContainer.setAttribute('thread-id', props.threadId);
    parentContainer.classList.add('comment-item');

    // Profile Image
    const profileImg = document.createElement('div');
    profileImg.classList.add('profile-img');
    profileImg.style.backgroundImage = ``
    parentContainer.append(profileImg);

    // Comment Body
    const div = document.createElement('div');
    div.classList.add('comment-content');
    parentContainer.append(div);

    // Header
    const cmtHeader = document.createElement('div');
    cmtHeader.classList.add('comment-item-header');
    div.append(cmtHeader);

    const author = document.createElement('a');
    author.classList.add('author-name');
    author.href = `#profile=${props.creatorId}`;
    cmtHeader.append(author);

    // User Info
    getUserInfo(props.creatorId).then((userInfo) => {
        profileImg.style.backgroundImage = `url(${userInfo?.image || defaultImgUrl})`;
        author.textContent = userInfo?.name;
    });

    // Posted
    const posted = document.createElement('div');
    posted.classList.add('comment-posted');
    posted.textContent = `• ${formatTimeSince(props.createdAt)}`;
    cmtHeader.append(posted);

    // Content
    const content = document.createElement('div');
    content.classList.add('comment-body-content', 'mb-2');
    content.textContent = props.content;
    div.append(content);

    // Likes Count
    const likeCountDiv = document.createElement('div');
    likeCountDiv.classList.add('comment-likes', 'mb-2');
    div.append(likeCountDiv);
    const likeCount = document.createElement('small');
    likeCount.id = `like-count-${props.id}`;
    likeCount.textContent = `${props.likes.length} likes`;
    likeCount.setAttribute('like-count', props.likes.length);
    likeCountDiv.append(likeCount);

    // interactions
    const cmtInter = document.createElement('div');
    cmtInter.classList.add('comment-interactions');
    div.append(cmtInter);

    // like btn
    const likeBtn = createLikeBtn(props, 'comment');
    cmtInter.append(likeBtn);

    // reply button
    const replyBtn = replyModalBtn(props);
    cmtInter.append(replyBtn);

    if (isLocalOwner(props.creatorId)) {
        // Edit button
        const editBtn = editCmtMdlBtn(props);
        cmtInter.append(editBtn);
    }

    // Div Container for children comments
    const childrenDiv = document.createElement('div');
    childrenDiv.classList.add('mt-2');
    childrenDiv.id = `comment-children-${props.id}`;
    div.append(childrenDiv);

    // Formats if has parents
    if (props.parentCommentId) {
        parentContainer.setAttribute('parentCommentId', props.parentCommentId);
        const waitForElem = (id) => {
            return new Promise((resolve, reject) => {
                const obsv = new MutationObserver((mutaLst, obsver) => {
                    const elem = document.getElementById(id);
                    if (elem) {
                        obsv.disconnect();
                        resolve(elem);
                    }
                })

                obsv.observe(document.body, { childList: true, subtree: true });

                const elem = document.getElementById(id);
                if (elem) {
                    obsv.disconnect();
                    resolve(elem);
                }
            });
        }

        waitForElem(`comment-children-${props.parentCommentId}`)
            .then((elem) => {
                const parent = elem;
                parent.append(parentContainer);
            })
        return;
    }

    return parentContainer;
}
