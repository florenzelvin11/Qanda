import { apiCall, getUserSession } from "../helpers.js";

export const ThreadWatchBtn = (props) => {
    const watchBtn = document.createElement('button');
    watchBtn.id = "watch-btn";
    watchBtn.type = "button";
    watchBtn.classList.add('btn');
    watchBtn.setAttribute('thread-id', props.id);
    watchBtn.onclick = handleWatchBtn;

    // Icon
    const eyeIcon = document.createElement('i');
    eyeIcon.classList.add('thread-icon', 'fa', 'fa-eye');

    const currUserId = getUserSession().userId;
    props.watchees.includes(currUserId) && eyeIcon.classList.add('active');
    watchBtn.appendChild(eyeIcon);

    return watchBtn;
}

const handleWatchBtn = (event) => {
    event.preventDefault();

    const watchBtn = event.target.closest('button');
    const threadId = watchBtn.getAttribute('thread-id');

    const eyeIcon = document.querySelector('#watch-btn .thread-icon');

    let state;
    if (eyeIcon.classList.contains('active')) {
        eyeIcon.classList.remove('active')
        state = false;
    } else {
        eyeIcon.classList.add('active');
        state = true;
    }

    const request = {
        id: threadId,
        turnon: state,
    }

    // TODO API Call
    apiCall('PUT', '/thread/watch', request)
        .then()
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });

}