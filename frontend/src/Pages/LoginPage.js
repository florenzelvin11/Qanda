import { AuthBox } from "../components/AuthBox.js";
import { generateGlobalAlert } from "../components/Alert.js";
import { apiCall, getUserInfo, isValidEmail, isValidPassword, navigateTo, setUserSession } from "../helpers.js";


export const LoginPage = () => {

    document.body.style.backgroundColor = "#0d3470";

    // ========================= HTML ============================= //

    const authBoxContainer = AuthBox({
        title: "Login",
        subtitle: "Welcome back! Ready to join the conversation?",
        textInputs: [
            {
                type: "email",
                id: "login-email",
                label: "Email Address",
                placeholder: "Email Address",
                invalidFeeback: "Please provide a valid email address.",
                required: true,
                onChange: handleFormChange,
            },
            {
                type: "password",
                id: "login-password",
                label: "Password",
                placeholder: "Password",
                invalidFeeback: "Please provide a valid password.",
                required: true,
                onChange: handleFormChange,
                mb: "mb-4",
            }
        ],
        button: {
            btnId: 'auth-btn-submit',
            btnLabel: 'Login',
            onClick: handleFormSubmit,
        },
        subLink: {
            sbText: "You don't have an account yet? ",
            sbId: 'create-account-btn',
            sbTargetLink: '#sign-up',
            sblinkLabel: "Sign Up",
        }
    });

    // Append all components to the Page
    const content = document.createDocumentFragment();
    content.append(authBoxContainer);

    return content;
}

// ========================= Callbacks ============================= //

const isValidForm = (emailElem, passwordElem) => {
    const email = emailElem.value;
    const password = passwordElem.value;

    let state = true;
    if (!isValidEmail(email)) {
        state = false;
        emailElem.classList.add('is-invalid');
    } else {
        emailElem.classList.remove('is-invalid');
    }

    if (!isValidPassword(password)) {
        state = false;
        passwordElem.classList.add('is-invalid');
    } else {
        passwordElem.classList.remove('is-invalid');
    }
    return state;
};

const handleFormChange = (event) => {
    event.preventDefault();
    const form = document.getElementById('auth-form');
    const emailElem = form['login-email'];
    const passwordElem = form['login-password'];

    isValidForm(emailElem, passwordElem);
};

const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = document.getElementById('auth-form');
    const emailElem = form['login-email'];
    const passwordElem = form['login-password'];

    if (!isValidForm(emailElem, passwordElem)) return;


    const email = emailElem.value;
    const password = passwordElem.value;

    const request = {
        email: email,
        password: password,
    }

    apiCall('POST', '/auth/login', request)
        .then((data) => {
            console.log(data);
            emailElem.classList.add('is-valid');
            passwordElem.classList.add('is-valid');

            // Save user session
            setUserSession(data);
            getUserInfo(data.userId)
                .then(userInfo => setUserSession({
                    admin: userInfo.admin,
                    name: userInfo.name,
                    image: userInfo.image,
                }));


            // After successful login navigate to dashboard page
            navigateTo('#dashboard');
        })
        .catch((err) => {
            console.log(err);
            emailElem.classList.add('is-invalid');
            passwordElem.classList.add('is-invalid');

            // Create Global Alert
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        })
};

