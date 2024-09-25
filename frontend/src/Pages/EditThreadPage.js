import { ThreadForm } from "../components/ThreadForm.js";
import { apiCall } from "../helpers.js";
import { NavBar } from "../components/NavBar.js";

export const EditThreadPage = (props) => {

    // ========================= HTML ============================= //

    // Components
    const NavBarComp = NavBar();

    // Load content to the page
    const content = document.createDocumentFragment();
    content.append(NavBarComp);

    apiCall('GET', `/thread?id=${props?.threadId}`)
        .then((thread) => {
            // Content
            console.log(thread);
            const contentDiv = document.getElementById('content');
            contentDiv.append(ThreadForm({
                threadId: thread.id,
                formTitle: "Edit Thread",
                title: thread.title,
                content: thread.content,
                isPublic: thread.isPublic,
                isEdit: true,
            }));
        })
        .catch(err => {
            console.log(err);
            generateGlobalAlert({ alertType: 'alert-danger', alertText: err });
        });

    return content; 
};