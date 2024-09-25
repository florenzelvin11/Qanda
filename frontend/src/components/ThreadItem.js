import { apiCall, formatTimeSince, navigateTo } from "../helpers.js";
import { generateGlobalAlert } from "./Alert.js";
import { ShowThread } from "./Thread.js";

export const ThreadItem = (props) => {
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

    const itemSection = document.createElement('a');
    itemSection.id = `thread-item-${props.id}`;
    itemSection.setAttribute('thread-id', `${props.id}`);
    itemSection.classList.add('thread-item', 'list-group-item', 'list-group-item-action');
    itemSection.setAttribute('aria-current', 'true');
    itemSection.onclick = handleClick;

    // Header
    const itemHeader = document.createElement('div');
    itemHeader.classList.add('d-flex', 'w-100', 'justify-content-between');
    itemSection.append(itemHeader);

    // Title
    const title = document.createElement('h6');
    title.classList.add('thread-item-title','mb-1');
    title.textContent = props.title;

    // Likes
    const likes = document.createElement('small');
    likes.textContent = `${props?.likes.length} likes`;
    itemHeader.append(title, likes);

    const author = document.createElement('p');
    author.classList.add('mb-1');
    itemSection.append(author);

    // Get User Info
    apiCall('GET', `/user?userId=${props.creatorId}`)
        .then((userData) => {
            author.textContent = userData.name;
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });

    const postedDate = document.createElement('small');
    postedDate.textContent = formatTimeSince(props.createdAt);
    itemSection.append(postedDate);

    return itemSection;
};

const handleClick = (event) => {
    event.preventDefault();

    // Untoggle previous active button
    const currActive = document.querySelector('.thread-item.active');
    currActive?.classList.remove('active');

    // Activate selected Item
    const threadItem = event.target.closest('a');
    threadItem.classList.add('active');
    const threadId = threadItem.getAttribute('thread-id');

    // Change URL
    navigateTo(`#thread=${threadId}`, false);

    // Show page
    ShowThread({ threadId });
}
