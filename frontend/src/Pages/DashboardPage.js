import { Icon } from "../components/Icon.js";
import { NavBar } from "../components/NavBar.js";
import { ShowThread, Thread } from "../components/Thread.js";
import { ThreadItem } from "../components/ThreadItem.js";
import { apiCall, getAllThreadIds, navigateTo } from "../helpers.js";

export const DashboardPage = (props) => {

    document.body.style.backgroundColor = "#fff";

    // ========================= HTML ============================= //

    // Components
    // Navbar Component
    const NavBarComp = NavBar();

    // Dashboard Page Content
    const mainSection = document.createElement('section');
    mainSection.id = "main-section";
    mainSection.classList.add('main-content');

    // Dashboard sections
    const mainLeft = document.createElement('div');
    mainLeft.id = "main-left";
    const mainRight = document.createElement('div');
    mainRight.id = "main-right";
    mainSection.append(mainLeft, mainRight);

    // Left Section
    const thLstHeader = document.createElement('div');
    thLstHeader.className = "thread-list-header";
    const thLstBody = document.createElement('div');
    thLstBody.id = "thread-list";
    thLstBody.classList.add('thread-list-body', 'list-group');

    const mainLeftContent = document.createElement('div');
    mainLeftContent.id = 'main-left-content';
    mainLeft.appendChild(mainLeftContent);

    mainLeftContent.append(thLstHeader, thLstBody);

    // Mobile version - Left section
    let mobileThLst;
    if (window.innerWidth <= 750) {
        mobileThLst = mobileThreadLst(mainLeftContent);
        const mobileContent = mobileThLst.querySelector('#main-left-content');
        mobileContent.style.display = 'block';
    } else {
        mobileThLst = mobileThreadLst();
    }

    // Thread List Header
    const lstTitle = document.createElement('div');
    lstTitle.classList.add('thread-list-title');
    lstTitle.textContent = "Discussion";
    const thCreateBtn = document.createElement('button');
    thCreateBtn.type = "button";
    thCreateBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    thCreateBtn.id = "thread-create-btn";
    thCreateBtn.textContent = "Create";
    thCreateBtn.onclick = handleCreateBtn;

    thLstHeader.append(lstTitle, thCreateBtn);

    // Thread List Body
    // Get all the thread-item link
    getAllThreadIds()
        .then(threadIds => {
            Promise.all(threadIds.map((threadId) => {
                return Promise.resolve(
                    apiCall('GET', `/thread?id=${threadId}`)
                        .then(thItem => Promise.resolve(ThreadItem(thItem)))
                )
            }))
                .then((threadItems) => {
                    thLstBody.append(...threadItems);

                    // Thread Section
                    props?.threadId && ShowThread({ threadId: props.threadId });
                })
        })


    // Thread list button for mobile
    const threadListBtn = document.createElement('button');
    threadListBtn.type = "button";
    threadListBtn.id = 'mobile-thlst-btn';
    threadListBtn.classList.add('mobile-thread-btn', 'btn', 'btn-secondary');
    threadListBtn.appendChild(Icon('fa-angle-right'));
    threadListBtn.setAttribute('data-bs-toggle', 'offcanvas');
    threadListBtn.setAttribute('data-bs-target', '#mobile-thread-lst');
    threadListBtn.setAttribute('aria-controls', 'mobileThreadBackdrop');
    mainLeft.append(threadListBtn);

    // Load content to the page
    const content = document.createDocumentFragment();
    content.append(NavBarComp, mainSection, mobileThLst);


    return content;
};

// Mobile Thread Left thread list section
const mobileThreadLst = (...content) => {
    const parent = document.createElement('div');
    parent.classList.add('offcanvas', 'offcanvas-start');
    parent.setAttribute('data-bs-backdrop', 'static');
    parent.tabIndex = "-1";
    parent.id = 'mobile-thread-lst';
    parent.setAttribute('aria-labelly', 'mobileThreadList');

    const header = document.createElement('div');
    header.classList.add('offcanvas-header');
    parent.appendChild(header);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.type = "button";
    closeBtn.id = "mobile-th-close-btn"
    closeBtn.classList.add('btn-close');
    closeBtn.setAttribute('data-bs-dismiss', 'offcanvas');
    closeBtn.setAttribute('aria-label', 'Close');
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.id = "mobile-thlst-body"
    body.classList.add('offcanvas-body');
    parent.appendChild(body);

    body.append(...content);

    return parent;
}

// ========================= Callbacks ============================= //

const handleCreateBtn = (event) => {
    event.preventDefault();
    const btn = event.target;
    if (btn.id !== 'thread-create-btn') {
        return;
    }
    navigateTo('#create-thread');
}

// Web Responsive
window.addEventListener("resize", () => {
    const mobileThLstBody = document.getElementById('mobile-thlst-body');
    const mainLeftContent = document.getElementById('main-left-content');
    if (window.innerWidth <= 750 && mainLeftContent) {
        mainLeftContent.style.display = "block";
        mobileThLstBody.append(mainLeftContent);

    } else {
        const mainLeftContent = document.getElementById('main-left-content');
        const closeBtn = document.getElementById('mobile-th-close-btn');
        closeBtn && closeBtn.click();
        const mainLeft = document.getElementById('main-left');
        mainLeft && mainLeft.append(mainLeftContent);
    }
});
