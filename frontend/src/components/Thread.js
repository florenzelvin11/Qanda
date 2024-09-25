import { apiCall, defaultImgUrl, formatTimeSince, getUserInfo, isGlobalOwner, isLocalOwner } from "../helpers.js";
import { generateGlobalAlert } from "./Alert.js";
import { CommentEditModal } from "./CommentEditModal.js";
import { CommentModal, commentModalBtn } from "./CommentModal.js";
import { CommentSection } from "./CommentSection.js";
import { CommentTextArea } from "./CommentTextArea.js";
import { createLikeBtn } from "./LikeBtn.js";
import { ThreadDeleteModal, deleteModalBtn } from "./ThreadDeleteModal.js";
import { ThreadEditBtn } from "./ThreadEditBtn.js";
import { ThreadWatchBtn } from "./ThreadWatchBtn.js";

export const ShowThread = (props) => {
    // {
    //     id: Thread,
    // }

    const { threadId } = props;

    apiCall('GET', `/thread?id=${threadId}`)
        .then((thread) => {
            // Content
            const mainRight = document.getElementById('main-right');
            mainRight.style.backgroundImage = 'none';

            // Clear previous content
            const prevContent = document.getElementById('thread');
            prevContent && mainRight.removeChild(prevContent);

            // Checks for Thread List Item to be marked
            const thItem = document.getElementById(`thread-item-${threadId}`);
            thItem.classList.add('active');

            mainRight.append(Thread(thread));
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });
}

export const Thread = (props) => {
    // {
    //     "id": 528491,
    //     "title": "COO for cupcake factory",
    //     "isPublic": true,
    //     "lock": true,
    //     "content": "Does anyone know what the answer to the question is??",
    //     "creatorId": 61021,
    //     "createdAt": "2011-10-05T14:48:00.000Z",
    //     "likes": [
    //     61021
    //     ],
    //     "watchees": [
    //     61021
    //     ]
    // }

    // Content Container
    const parentContainer = document.createElement('div');
    parentContainer.id = "thread"
    parentContainer.classList.add('container', 'thread-item-container');

    const thContSection = document.createElement('div');
    thContSection.classList.add('thread-item-section', 'mb-5');
    parentContainer.append(thContSection);

    // header
    const thItmHeader = document.createElement('div');
    thItmHeader.classList.add('thread-item-header');
    thContSection.append(thItmHeader);

    // header content
    const thItmUser = document.createElement('div');
    thItmUser.classList.add('thread-item-user');
    thItmHeader.append(thItmUser);


    // Profile Img
    const profileImg = document.createElement('div');
    profileImg.classList.add('profile-img');
    profileImg.id = `profile-img-${props.creatorId}`;
    thItmUser.append(profileImg);

    // Author
    const author = document.createElement('a');
    author.classList.add('author-name');
    author.href = `#profile=${props.creatorId}`;
    thItmUser.append(author);

    // Posted date
    const posted = document.createElement('div');
    posted.textContent = `• ${formatTimeSince(props.createdAt)}`
    posted.classList.add('thread-posted');
    thItmUser.append(posted);

    // Get user
    getUserInfo(props.creatorId).then((userInfo) => {
        profileImg.style.backgroundImage = `url(${userInfo?.image || defaultImgUrl})`;
        author.textContent = userInfo?.name;
    });

    // Watch Btn
    const watchBtn = ThreadWatchBtn(props);
    thItmHeader.append(watchBtn);

    // Thread Title
    const threadTitle = document.createElement('div');
    threadTitle.classList.add('thread-title');
    thContSection.append(threadTitle);
    const title = document.createElement('h1');
    title.textContent = props.title;
    threadTitle.append(title);

    // Thread Body Content
    const thBodyContent = document.createElement('div');
    thBodyContent.classList.add('thread-body-content', 'mb-2');
    thBodyContent.textContent = props.content;
    thContSection.append(thBodyContent);

    // Like Count
    const likeDiv = document.createElement('div');
    const likes = document.createElement('small');
    likes.id = `like-count-${props.id}`;
    likes.textContent = `${props.likes.length} likes`;
    likes.setAttribute('like-count', props.likes.length);
    likeDiv.append(likes);
    thContSection.append(likeDiv);

    // Thread interactions
    const thInteractions = document.createElement('div');
    thInteractions.classList.add('thread-interactions');
    thContSection.append(thInteractions);

    // Like Btn
    const likeBtn = createLikeBtn(props, 'thread');
    thInteractions.append(likeBtn);

    // Comment button - Modal
    const commentBtn = commentModalBtn(props);
    thInteractions.append(commentBtn);

    if (isLocalOwner(props.creatorId)) {
        // Edit button - Modal
        const editBtn = ThreadEditBtn(props);
        thInteractions.append(editBtn);
    }

    if (isGlobalOwner(props.creatorId)) {
        // Delete button - Modal
        const deleteBtn = deleteModalBtn(props);
        thInteractions.append(deleteBtn);
    }

    // Comment Section
    apiCall('GET', `/comments?threadId=${props.id}`)
        .then((comments) => {
            if (comments.length === 0) {
                // No Comments
                parentContainer.append(CommentTextArea({ threadId: props.id }));
            } else {
                // Comments
                parentContainer.append(CommentSection({ comments }));
            }
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });


    // Modals
    const cmtModal = CommentModal();
    const cmtEditModal = CommentEditModal();
    const deleteModal = ThreadDeleteModal();
    parentContainer.append(cmtModal, cmtEditModal, deleteModal);

    // Apply the content to the DOM
    const content = document.createDocumentFragment();
    content.append(parentContainer);
    return content;
};
