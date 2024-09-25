// Pages
import { LoginPage } from './Pages/LoginPage.js';
import { SignUpPage } from './Pages/SignUpPage.js';
import { DashboardPage } from './Pages/DashboardPage.js';
import { ThreadFormPage } from './Pages/CreateThreadPage.js';
import { EditThreadPage } from './Pages/EditThreadPage.js';
import { ProfilePage } from './Pages/ProfilePage.js';

const renderPage = () => {
    const urlFrag = window.location.hash.substring(1).split('=');
    const path = urlFrag[0];
    const pathId = urlFrag[1];

    const contentMap = {
        '': () => LoginPage(),
        'login': () => LoginPage(),
        'sign-up': () => SignUpPage(),
        'dashboard': () => DashboardPage(),
        'create-thread': () => ThreadFormPage(),
        'thread': () => DashboardPage({ threadId: pathId }),
        'edit-thread': () => EditThreadPage({ threadId: pathId }),
        'profile': () => ProfilePage({ userId: pathId }),
    }

    // Get the content generating function for the current route from contentMap
    let contentGenerator = contentMap[path];

    // Get App section
    const app = document.getElementById('app');

    // Clear previous content
    const oldContent = document.getElementById('content');
    app.removeChild(oldContent);

    // Generate and append new content
    const contentDiv = document.createElement('div');
    contentDiv.id = "content";

    // Gets current content and Add New content to the app    
    contentDiv.append(contentGenerator());
    app.append(contentDiv);
}

// Listen for popstate event
window.addEventListener('popstate', () => {
    console.log("Re-Render");
    renderPage();
})

// Loads content on page
renderPage();
