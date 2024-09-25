import { apiCall, getUserSession } from "../helpers.js";

export const LikeBtn = (props, type, handleLikeBtn) => {
    const likeBtn = document.createElement('button');
    likeBtn.id = `like-btn-${props.id}`;
    likeBtn.type = "button";
    likeBtn.className = "btn";
    likeBtn.setAttribute(`${type}-id`, props.id);
    likeBtn.onclick = handleLikeBtn;

    // Like Icon
    const likeIcon = document.createElement('i');
    likeIcon.classList.add(`${type}-icon`, 'fa');
    if (props.likes.includes(getUserSession().userId)) {
        likeIcon.classList.remove('fa-heart-o');
        likeIcon.classList.add('fa-heart');
        likeIcon.classList.add('active');
    } else {
        likeIcon.classList.add('fa-heart-o');
    }
    likeBtn.append(likeIcon);

    return likeBtn;
}

export const createLikeBtn = (props, type) => LikeBtn(props, type, (event) => {
    event.preventDefault();

    const likeBtn = event.target.closest('button');
    const id = likeBtn.getAttribute(`${type}-id`);
    const heartIcon = likeBtn.querySelector(`#like-btn-${id} .${type}-icon`);
    const like = document.getElementById(`like-count-${id}`);
    let likeCount = like.getAttribute('like-count');
    console.log(likeCount);

    let state;
    if (heartIcon.classList.contains('active')) {
        // Unlike
        likeCount--;
        if (likeCount < 0) likeCount = 0;
        like.textContent = `${likeCount} likes`;
        heartIcon.classList.remove('active');
        heartIcon.classList.remove('fa-heart');
        heartIcon.classList.add('fa-heart-o');
        state = false;
    } else {
        // like
        likeCount++;
        like.textContent = `${likeCount} likes`;
        heartIcon.classList.add('active');
        heartIcon.classList.add('fa-heart');
        heartIcon.classList.remove('fa-heart-o');
        state = true;
    }

    // Update like count
    like.setAttribute('like-count', likeCount);

    // Api request
    const request = {
        id,
        turnon: state,
    };

    // API Call
    apiCall('PUT', `/${type}/like`, request)
        .then()
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });
});