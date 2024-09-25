import { AuthForm } from '../components/AuthForm.js';

export const AuthBox = (props) => {
    // Container
    const globalContainer = document.createElement('div');
    globalContainer.classList.add('container-xxl', 'center-screen');

    // Auth Box Container
    const authBoxContainer = document.createElement('div');
    authBoxContainer.classList.add('auth-box-container');

    // Left Section
    const left = document.createElement('div');
    left.classList.add('left');

    // Brand Title - When mobile
    const brandTitle = document.createElement('h1')
    brandTitle.textContent = "QANDA";
    brandTitle.id = "brand-title";
    left.append(brandTitle);

    // Form section
    const authForm = AuthForm(props);
    left.append(authForm);

    // Right Section
    const right = document.createElement('div');
    right.classList.add('right');

    // Image banner
    const pageTitle = document.createElement('h1');
    pageTitle.textContent = "QANDA";

    const image = document.createElement('img');
    image.src = "./assets/images/pexels-fauxels-3183165.jpg";
    image.alt = "";

    right.append(pageTitle, image);

    // Create Element
    authBoxContainer.append(left, right);

    // Adding the Auth Box into the container 
    globalContainer.append(authBoxContainer);

    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(globalContainer);
    return contentFrag;
}