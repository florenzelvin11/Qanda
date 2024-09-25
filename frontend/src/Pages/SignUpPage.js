import { AuthBox } from "../components/AuthBox.js";
import { generateGlobalAlert } from "../components/Alert.js";
import { apiCall, isValidEmail, isValidPassword, navigateTo, setUserSession, getUserInfo } from "../helpers.js";


export const SignUpPage = () => {

    document.body.style.backgroundColor = "#0d3470";

    // ========================= HTML ============================= //

    // Components
    const authBoxContainer = AuthBox({
        title: "Create an Account",
        subtitle: "Be a part of the community",
        textInputs: [
            {
                type: "email",
                id: "sign-up-email",
                label: "Email Address",
                placeholder: "Email Address",
                invalidFeeback: "Please provide a valid email address.",
                required: true,
                onChange: handleFormChange,
            },
            {
                type: "text",
                id: "sign-up-name",
                label: "Full Name",
                placeholder: "Full Name",
                invalidFeeback: "Please provide valid Full Name.",
                required: true,
                onChange: handleFormChange,
            },
            {
                type: "password",
                id: "sign-up-password",
                label: "Password",
                placeholder: "Password",
                invalidFeeback: "Please provide a valid password.",
                required: true,
                onChange: handleFormChange,
            },
            {
                type: "password",
                id: "sign-up-confirm-password",
                label: "Confirm Password",
                placeholder: "Confirm Password",
                invalidFeeback: "Password not matching",
                required: true,
                onChange: handleFormChange,
                mb: "mb-4",
            }
        ],
        button: {
            btnId: 'auth-btn-submit',
            btnLabel: 'Sign Up',
            onClick: handleFormSubmit,
        },
        subLink: {
            sbText: "Already have an account? ",
            sbId: 'login-account-btn',
            sbTargetLink: '#login',
            sblinkLabel: "Log In",
        }
    });

    const content = document.createDocumentFragment();
    content.append(authBoxContainer);

    return content;
}

// ========================= Callbacks ============================= //

const isValidForm = (emailElem, nameElem, passwordElem, confirmPassElem) => {
    const email = emailElem.value;
    const name = nameElem.value;
    const password = passwordElem.value;
    const confirmPassword = confirmPassElem.value;

    if (!isValidEmail(email)) {
        emailElem.classList.add('is-invalid');
        return false;
    } else {
        emailElem.classList.remove('is-invalid');
    }

    if (!(/[a-zA-Z]/.test(name))) {
        nameElem.classList.add('is-invalid');
        return false;
    } else {
        nameElem.classList.remove('is-invalid');
    }

    if (!isValidPassword(password)) {
        passwordElem.classList.add('is-invalid');
        return false;
    } else {
        passwordElem.classList.remove('is-invalid');
    }

    if (!isValidPassword(confirmPassword) || password !== confirmPassword) {
        confirmPassElem.classList.add('is-invalid');
        return false;
    } else {
        confirmPassElem.classList.remove('is-invalid');
    }

    return true;
};

const handleFormChange = (event) => {
    event.preventDefault();
    const form = document.getElementById('auth-form');
    const emailElem = form['sign-up-email'];
    const nameElem = form['sign-up-name'];
    const passwordElem = form['sign-up-password'];
    const confirmPassElem = form["sign-up-confirm-password"];

    console.log('hello');

    isValidForm(emailElem, nameElem, passwordElem, confirmPassElem);
};

const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = document.getElementById('auth-form');
    const emailElem = form['sign-up-email'];
    const nameElem = form['sign-up-name'];
    const passwordElem = form['sign-up-password'];
    const confirmPassElem = form["sign-up-confirm-password"];

    if (!isValidForm(emailElem, nameElem, passwordElem, confirmPassElem)) return;

    const email = emailElem.value;
    const name = nameElem.value;
    const password = passwordElem.value;

    const request = {
        email: email,
        password: password,
        name: name,
    }

    apiCall('POST', '/auth/register', request)
        .then((data) => {
            console.log(data);
            emailElem.classList.add('is-valid');
            nameElem.classList.add('is-valid');
            passwordElem.classList.add('is-valid');
            confirmPassElem.classList.add('is-valid');

            // Save user session
            setUserSession(data);
            getUserInfo(data.userId)
                .then(userInfo => setUserSession({ 
                        name: userInfo.name,
                        admin: userInfo.admin, 
                        image: userInfo.image,
                    }));

            // After successful sign up navigate to dashboard page
            navigateTo('#dashboard');
        })
        .catch((err) => {
            console.log(err);
            emailElem.classList.add('is-invalid');
            // Create Global Alert
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        })
};