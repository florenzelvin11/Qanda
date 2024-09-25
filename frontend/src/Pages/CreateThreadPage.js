import { NavBar } from "../components/NavBar.js";
import { ThreadForm } from "../components/ThreadForm.js";

export const ThreadFormPage = (props) => {

    // ========================= HTML ============================= //

    // Components
    const NavBarComp = NavBar();
    const ThreadFormComp = ThreadForm();

    // Load content to the page
    const content = document.createDocumentFragment();
    content.append(NavBarComp, ThreadFormComp);
    // ========================= Event Listeners ============================= //

    return content; 
};