import { generateGlobalAlert } from "./components/Alert.js";
import { BACKEND_PORT } from "./config.js";

export const apiURL = `http://localhost:${BACKEND_PORT}`;
export const defaultImgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/813px-Unknown_person.jpg';

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export const apiCall = (method, path, request) => {
    const userSession = getUserSession();
    return fetch(`${apiURL}${path}`, {
        method: method,
        headers: {
            'Content-type': 'application/json',
            ...(userSession === null ? {} : { Authorization: `Bearer ${userSession.token}` }),
        },
        ...(request && { body: JSON.stringify(request) })
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                return Promise.reject(data.error);
            } else {
                return Promise.resolve(data);
            }
        })
};

export const getUserInfo = (userId) => {
    // Get User Info
    return apiCall('GET', `/user?userId=${userId}`)
        .then((userData) => {
            return Promise.resolve(userData);
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });
}

export const isGlobalOwner = userId => (getUserSession().userId == userId) || (getUserSession().admin);
export const isLocalOwner = userId => (getUserSession().userId == userId);
export const isAdmin = () => getUserSession().admin;


export const callThreadsList = (index) => {
    return apiCall('GET', `/threads?start=${index}`)
            .then(thIds => thIds)
            .catch(err => {
                console.log(err);
                generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
            });
}

export const getAllThreadIds = () => {
    let index = 0;
    let threadIds = [];


    const recursiveApiCall = () => {
        return callThreadsList(index)
            .then(thItems => {
                if (thItems.length === 0) {
                    return Promise.resolve(threadIds);
                } else {
                    threadIds = [...threadIds, ...thItems];
                    index += 5;
                    return recursiveApiCall();   
                }
            })
            .catch(err => {
                console.log(err);
                generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
            });
    }
    return recursiveApiCall();
}


export const getUserSession = () => {
    const userSession = localStorage.getItem("userSession");
    return userSession ? JSON.parse(userSession) : null;
}

export const setUserSession = (data) => {
    localStorage.setItem("userSession", JSON.stringify({ ...getUserSession(), ...data }));
}

export function clearUserSession() {
    localStorage.removeItem("userSession");
}

export const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    // Checks the email against the regex
    return emailRegex.test(email);
}

export const isValidPassword = password => /[a-zA-Z]/.test(password) && password.trim() !== "";

export const navigateTo = (path, render = true) => {
    // If render is true it will rerender the whole page, otherwise no rerender
    console.log("navigate to " + path);
    if (render) {
        history.replaceState(null, null, path)
        window.dispatchEvent(new PopStateEvent('popstate'));
    }
    else {
        history.replaceState({}, '', path)
    };
};


export const formatTimeSince = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const intervals = {
        week: Math.floor(diff / 604800),
        day: Math.floor(diff / 86400),
        hour: Math.floor(diff / 3600),
        minute: Math.floor(diff / 60),
    };

    // Format the time
    const isPlural = num => num > 1 && 's' || '';
    if (intervals.week > 0) return `${intervals.week} week${isPlural(intervals.week)} ago`;
    if (intervals.day > 0) return `${intervals.day} day${isPlural(intervals.day)} ago`;
    if (intervals.hour > 0) return `${intervals.hour} hour${isPlural(intervals.hour)} ago`;
    if (intervals.minute > 0) return `${intervals.minute} minute${isPlural(intervals.minute)} ago`;
    return 'Just now';
}

const createDropItem = (item) => {
    const li = document.createElement('li');
    li.appendChild(item);
    return li;
}