import { generateGlobalAlert } from "../components/Alert.js";
import { Modal } from "../components/Modal.js";
import { NavBar } from "../components/NavBar.js";
import { apiCall, defaultImgUrl, formatTimeSince, getUserInfo, navigateTo, getAllThreadIds, fileToDataUrl, isValidEmail, isValidPassword, isLocalOwner, isAdmin } from "../helpers.js";

export const ProfilePage = (props) => {

    const { userId } = props;

    const NavBarComp = NavBar();

    // Main Section 
    const mainSection = document.createElement('section');
    mainSection.id = "profile-section";

    // Left Section
    const mainLeft = document.createElement('div');
    mainLeft.className = "profile-left-section";

    // right Section
    const mainRight = document.createElement('div');
    mainRight.className = "profile-right-section";

    // Comnine sections
    mainSection.append(mainLeft, mainRight);

    // Left Content

    // Profile Widget
    const profileWidget = ProfileWidget({ userId });
    mainLeft.appendChild(profileWidget);

    // Right Content
    const threadSection = document.createElement('div');
    threadSection.className = "thread-section";
    mainRight.appendChild(threadSection);

    getAllThreadIds()
        .then(threadIds => {
            Promise.all(threadIds
                .map((threadId) => {
                    return apiCall('GET', `/thread?id=${threadId}`);
                }))
                .then((threadItems) => {
                    // Filter thread Items by userId
                    const userThreads = threadItems.filter(thItem => thItem.creatorId == userId);
                    return Promise.all(userThreads.map(thItem => ProfileThreadItem(thItem)));
                })
                .then(userThreads => {
                    threadSection.append(...userThreads);
                })
        })


    // Load content to the page
    const content = document.createDocumentFragment();
    content.append(NavBarComp, mainSection);

    return content;
}

const ProfileWidget = (props) => {
    const content = document.createElement('div');
    content.classList.add('profile-info-widget');

    // Header
    const header = document.createElement('div');
    header.classList.add('header', 'profile-header', 'mb-3');
    content.append(header);

    // profile image
    const profileImg = document.createElement('div');
    profileImg.classList.add('profile-img');
    header.append(profileImg);

    // Name
    const name = document.createElement('div');
    name.classList.add('author-name');
    header.append(name);

    // Contact Section
    // Title
    const contactHeading = document.createElement('h4');
    contactHeading.className = "contact-title";
    contactHeading.textContent = "Contacts";
    content.append(contactHeading);

    // Contacts
    const contactContent = document.createElement('div');
    contactContent.classList.add('header', 'contact');
    content.append(contactContent);

    // email
    const emailLabel = document.createElement('div');
    emailLabel.textContent = "Email"
    emailLabel.classList.add('email-label');

    // email content
    const emailContent = document.createElement('div');
    emailContent.classList.add('user-email');

    contactContent.append(emailLabel, emailContent);

    const btnSection = document.createElement('div');
    btnSection.classList.add('btn-section', 'gap-2');
    content.append(btnSection);

    // btn section
    if (isLocalOwner(props.userId)) {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-primary', 'btn-sm');
        btn.type = "button";
        btn.textContent = "Edit Profile";
        btn.setAttribute('data-bs-toggle', 'modal');
        btn.setAttribute('data-bs-target', '#profile-modal');
        btnSection.append(btn);
    }

    const createDropDownItem = (label, isAdmin) => {
        const item = document.createElement('li');

        const div = document.createElement('div');
        div.classList.add('dropdown-item');
        div.setAttribute('is-admin', isAdmin);
        div.textContent = label;
        div.onclick = updateAdminAccess;
        item.appendChild(div);
        return item;
    }

    // User Access
    if (isAdmin()) {
        const dropDownDiv = document.createElement('div');
        dropDownDiv.classList.add('dropdown');
        btnSection.append(dropDownDiv);

        const dropDownBtn = document.createElement('button');
        dropDownBtn.classList.add('btn', 'btn-secondary', 'btn-sm', 'dropdown-toggle');
        dropDownBtn.type = "button";
        dropDownBtn.setAttribute('data-bs-toggle', 'dropdown');
        dropDownBtn.setAttribute('aria-expanded', "false");
        dropDownBtn.id = "user-access-btn";
        dropDownDiv.append(dropDownBtn);

        const ul = document.createElement('ul');
        ul.className = "dropdown-menu";
        ul.append(
            createDropDownItem("User access", false),
            createDropDownItem("Admin access", true)
        );
        dropDownDiv.append(ul);
    }

    // Get user info Api call
    getUserInfo(props.userId)
        .then((userInfo) => {
            profileImg.style.backgroundImage = `url("${userInfo?.image || defaultImgUrl}")`;
            name.textContent = userInfo.name;
            emailContent.textContent = userInfo.email;

            // Save the current values
            const profileForm = document.getElementById('profile-edit-form');
            profileForm.setAttribute('user-id', userInfo.id);

            // Saves admin access
            const userAccessBtn = document.getElementById('user-access-btn');
            if (userAccessBtn) userAccessBtn.textContent = userInfo?.admin && "Admin" || "User";


            const dropDownItems = document.querySelectorAll('.dropdown-item');
            dropDownItems.forEach(item => {
                item.setAttribute('user-email', userInfo.email);
                item.setAttribute('user-id', userInfo.id);
            })
        })

    // Update Profile
    const profileModal = Modal({
        id: "profile-modal",
        title: "Update Profile",
        elems: [
            profileModalBody()
        ],
        submitLabel: "Save",
        onSubmit: handleProfileUpdate,
        onClose: handleCloseProfile,
        submitDisabled: true,
    });

    content.appendChild(profileModal);
    return content;
}

// TODO =============================================================

const updateAdminAccess = (event) => {
    event.preventDefault();

    const btn = event.target.closest('.dropdown-item');
    console.log(btn);
    const isAdmin = btn.getAttribute('is-admin')
    const userId = btn.getAttribute('user-id');

    // Request
    const request = {
        userId,
        turnon: isAdmin === "true" ? true : false,
    }
    console.log(request);
    // update backend
    apiCall('PUT', '/user/admin', request)
        .then(() => navigateTo(`#profile=${userId}`))
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });
}

const addTextInput = (type, id, label) => {
    const inputElem = document.createElement('input');
    inputElem.type = type;
    inputElem.className = "form-control";
    inputElem.id = id;

    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', id);
    labelElem.textContent = label;

    const formFloat = document.createElement('div');
    formFloat.classList.add('form-floating', 'mb-3');

    formFloat.append(inputElem, labelElem);

    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(formFloat);
    return contentFrag;
}

const handleInputChange = (event) => {
    event.preventDefault();

    const modal = event.target.closest('#profile-modal');
    const subBtn = modal.querySelector('.btn-primary');
    const profileForm = event.target.closest('#profile-edit-form');

    // Get all input
    const emailInput = profileForm['mdl-edit-email-profile'];
    const nameInput = profileForm['mdl-edit-name-profile'];
    const passInput = profileForm['mdl-edit-pass-profile'];
    const confirmPassInput = profileForm['mdl-confirm-pass-profile'];
    const imageInput = profileForm['mdl-edit-image-profile'];

    // Values
    const email = emailInput.value;
    const name = nameInput.value;
    const password = passInput.value;
    const confirmPassword = confirmPassInput.value;
    const image = imageInput.value;

    const isEmailValid = isValidEmail(email);
    const isPasswordValid = isValidPassword(password);
    const doPasswordsMatchFlag = doPasswordsMatch(password, confirmPassword);

    if ((email !== '' && isEmailValid) || ((password !== '' && isPasswordValid) && (confirmPassword !== '' && doPasswordsMatchFlag)) || name !== '' || image !== '') {
        subBtn.disabled = false;
    } else {
        subBtn.disabled = true;
    }

    // Update classes for validation feedback
    emailInput.classList.remove('is-invalid', 'is-valid');
    passInput.classList.remove('is-invalid', 'is-valid');
    confirmPassInput.classList.remove('is-invalid', 'is-valid');

    if (email !== '') {
        if (isEmailValid) {
            emailInput.classList.add('is-valid');
        } else {
            emailInput.classList.add('is-invalid');
        }
    }

    if (password !== '') {
        if (isPasswordValid) {
            passInput.classList.add('is-valid');
            if (doPasswordsMatchFlag) {
                confirmPassInput.classList.add('is-valid');
            } else {
                confirmPassInput.classList.add('is-invalid');
            }
        } else {
            passInput.classList.add('is-invalid');
        }

    }

    if (confirmPassword !== '') {
        if (doPasswordsMatchFlag && isPasswordValid) {
            confirmPassInput.classList.add('is-valid');
        } else {
            confirmPassInput.classList.add('is-invalid');
        }
    }

    // If name or image is filled but either email or password is invalid, disable button
    if ((name !== '' || image !== '') && ((email !== "" && !isEmailValid) || (password !== '' && !isPasswordValid) || !doPasswordsMatchFlag)) {
        subBtn.disabled = true;
    }
}

// Function to check if passwords match
function doPasswordsMatch(password, confirmPassword) {
    return password === confirmPassword;
}

const profileModalBody = () => {
    const form = document.createElement('form');
    form.id = "profile-edit-form";
    form.onchange = handleInputChange;

    const emailInput = addTextInput('text', 'mdl-edit-email-profile', 'Email')
    form.appendChild(emailInput);

    const nameInput = addTextInput('text', 'mdl-edit-name-profile', 'Name');
    form.appendChild(nameInput);

    const fileDiv = document.createElement('div');
    fileDiv.classList.add('mb-3');

    const fileLabel = document.createElement('label');
    fileLabel.setAttribute('for', 'mdl-edit-image-profile');
    fileLabel.classList.add('form-label');
    fileLabel.textContent = "Change Profile Image";
    fileDiv.appendChild(fileLabel);

    const fileInput = document.createElement('input');
    fileInput.classList.add('form-control');
    fileInput.type = "file";
    fileInput.id = "mdl-edit-image-profile";
    fileDiv.appendChild(fileInput);

    // password
    const passwordInput = addTextInput('password', 'mdl-edit-pass-profile', 'New Password')
    form.appendChild(passwordInput);

    const confirmPassInput = addTextInput('password', 'mdl-confirm-pass-profile', 'Confirm New Password');
    form.appendChild(confirmPassInput);

    form.appendChild(fileDiv);

    return form;
}

const handleProfileUpdate = (event) => {
    event.preventDefault();

    // Save the current values
    const profileForm = document.getElementById('profile-edit-form');
    const userId = profileForm.getAttribute('user-id');

    // Get all input
    const emailInput = profileForm['mdl-edit-email-profile'];
    const nameInput = profileForm['mdl-edit-name-profile'];
    const passInput = profileForm['mdl-edit-pass-profile'];
    const imageInput = profileForm['mdl-edit-image-profile'];

    // Values
    const email = emailInput.value;
    const password = passInput.value;
    const name = nameInput.value;

    if (imageInput.value) {
        fileToDataUrl(imageInput.files[0])
            .then(imageUrl => {
                const request = {
                    email,
                    password,
                    name,
                    image: imageUrl,
                }

                apiCall('PUT', '/user', request)
                    .then(() => {
                        navigateTo(`#profile=${userId}`);
                    })
            });
    } else {
        const request = {
            email,
            password,
            name,
            image: undefined,
        }

        apiCall('PUT', '/user', request)
            .then(() => {
                navigateTo(`#profile=${userId}`);
            })
    }
}

const handleCloseProfile = (event) => {
    event.preventDefault();

    // Save the current values
    const profileForm = document.getElementById('profile-edit-form');

    // Get all input
    const emailInput = profileForm['mdl-edit-email-profile'];
    const nameInput = profileForm['mdl-edit-name-profile'];
    const passInput = profileForm['mdl-edit-pass-profile'];
    const confirmPassInput = profileForm['mdl-confirm-pass-profile'];
    const imageInput = profileForm['mdl-edit-image-profile'];

    emailInput.value = "";
    nameInput.value = "";
    passInput.value = "";
    confirmPassInput.value = "";
    imageInput.value = "";

    // Update classes for validation feedback
    emailInput.classList.remove('is-invalid', 'is-valid');
    passInput.classList.remove('is-invalid', 'is-valid');
    confirmPassInput.classList.remove('is-invalid', 'is-valid');
}

const ProfileThreadItem = (props) => {
    const parent = document.createElement('div');
    parent.setAttribute('thread-id', props.id);
    parent.className = 'thread-item-box';
    parent.onclick = handleClickThread;

    const header = document.createElement('div');
    header.classList.add('thread-item-user', 'mb-2');
    parent.appendChild(header);

    // profile-img
    const profileImg = document.createElement('div');
    profileImg.className = "profile-img";
    header.append(profileImg);

    // profile name
    const authorName = document.createElement('div');
    authorName.className = "author-name";
    header.appendChild(authorName);

    getUserInfo(props.creatorId)
        .then((userInfo) => {
            profileImg.style.backgroundImage = `url("${userInfo?.image || defaultImgUrl}")`;
            authorName.textContent = userInfo.name;
        });

    // Posted
    const posted = document.createElement('div');
    posted.classList.add('thread-posted');
    posted.textContent = `• ${formatTimeSince(props.createdAt)}`
    header.appendChild(posted);

    // Content
    const threadTitle = document.createElement('h1');
    threadTitle.className = 'thread-title';
    threadTitle.textContent = props.title;
    parent.appendChild(threadTitle);

    const threadContent = document.createElement('div');
    threadContent.classList.add('thread-body-content', 'mb-2');
    threadContent.textContent = props.content;
    parent.appendChild(threadContent);

    // Likes and comment
    const likeCmtSection = document.createElement('div');
    likeCmtSection.classList.add('like-comment-count');
    parent.appendChild(likeCmtSection);

    // likes
    const likeCount = document.createElement('small');
    likeCount.id = `like-count-${props.id}`;
    likeCount.textContent = `${props.likes.length} likes`;
    likeCmtSection.appendChild(likeCount);

    // comments
    const cmtCount = document.createElement('small');
    cmtCount.id = `comment-count-${props.id}`;
    likeCmtSection.appendChild(cmtCount);

    // Get thread Comments
    apiCall('GET', `/comments?threadId=${props.id}`)
        .then(comments => cmtCount.textContent = `${comments.length} comments`)
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });

    return parent;
}

const handleClickThread = (event) => {
    event.preventDefault();

    const threadItem = event.target.closest('.thread-item-box');
    const threadId = threadItem.getAttribute('thread-id');

    navigateTo(`#thread=${threadId}`);
}