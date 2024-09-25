import { clearUserSession, getUserSession, getUserInfo, navigateTo } from "../helpers.js";
import { Icon } from "./Icon.js";

export const NavBar = (props) => {

    // HTML Adjustment
    const alertPlaceholder = document.getElementById('alert-placeholder');
    alertPlaceholder.style.top = 60 + 'px';

    // ========================= HTML ============================= //
    const navBlock = document.createElement('div');

    const nav = document.createElement('nav');
    nav.classList.add("navbar", "navbar-expand-lg");
    nav.style.backgroundColor = "#0d3470";
    nav.setAttribute('data-bs-theme', 'dark');
    navBlock.append(nav);

    const container = document.createElement('div');
    container.classList.add('container-fluid', 'px-3');
    nav.append(container);

    const brandName = document.createElement('a');
    brandName.classList.add('navbar-brand');
    brandName.href = "#dashboard";
    brandName.textContent = "QANDA";
    container.append(brandName);

    const largeNav = document.createElement('div');
    largeNav.classList.add('large-nav');
    container.append(largeNav);

    const navToggle = createToggleBtn();
    container.append(navToggle);

    // const navLinks = createNavLinks(navItems);
    // container.append(navLinks);

    // Creates the Nav Item Sections
    const navItems = navItemSection();
    container.append(navItems);

    const content = document.createDocumentFragment();
    content.append(navBlock);

    return content;
};

// ========================= HTML ============================= //

const createToggleBtn = () => {
    const navToggle = document.createElement('button');
    navToggle.classList.add('navbar-toggler');
    navToggle.type = "button";
    navToggle.setAttribute('data-bs-toggle', 'collapse');
    navToggle.setAttribute('data-bs-target', '#navbarToggler');
    navToggle.setAttribute('aria-controls', 'navbarToggler');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Toggle navigation');

    const icon = document.createElement('span');
    icon.className = "navbar-toggler-icon";
    navToggle.append(icon);

    return navToggle;
}

const createNavItem = (link, isIcon = false) => {
    // Create elements
    const navItem = document.createElement('li');
    navItem.className = 'nav-item';

    const navLink = document.createElement('a');
    navItem.append(navLink);

    // Initialise Attributes
    navLink.classList.add('nav-link', 'active');
    navLink.id = link.id;
    navLink.href = link.href;

    // Optional Attributes
    if (!isIcon) navLink.textContent = link?.label;
    navLink.onclick = link?.onClick;
    link?.icon && navLink.append(Icon(link.icon));

    return navItem;
}

const navItemSection = () => {
    const userData = getUserSession();

    const navItems = [
        {
            id: 'nav-dashboard',
            href: '#dashboard',
            label: 'Dashboard',
            icon: 'fa-home',
        },
        {
            id: 'nav-profile',
            href: `#profile=${userData.userId}`,
            label: 'View Profile',
        },
        {
            id: 'nav-logout',
            href: '#login',
            label: 'Log Out',
            onClick: handleLogOut,
        }
    ]

    const linkContainer = document.createElement('div');
    linkContainer.classList.add("collapse", "navbar-collapse");
    linkContainer.id = "navbarToggler";

    const ul = document.createElement('ul');
    ul.classList.add('navbar-nav', 'ms-auto', 'mb-2', 'mb-lg-0');
    linkContainer.append(ul);

    // Large Nav Section
    const largeNav = createLargeNav(navItems);
    ul.appendChild(largeNav);

    // Mobile Nav Section
    const mobileNav = createMobileNav(navItems);
    ul.append(mobileNav);

    return linkContainer;
}

const createMobileNav = (mobileNavItems) => {
    const navContainer = document.createElement('div');
    navContainer.classList.add('mobile-nav');

    // Home Dashboard Nav
    mobileNavItems.forEach((navLink) => {
        const navItem = createNavItem(navLink);
        navContainer.appendChild(navItem);
    })

    return navContainer;
}

const createLargeNav = (navItems) => {
    const [dashboard, viewProfile, logout] = navItems;

    const navContainer = document.createElement('div');
    navContainer.classList.add('large-nav');

    // Home Dashboard Nav
    const homeButton = createNavItem(dashboard, true);
    navContainer.append(homeButton);

    // Account dropdown 
    const accountDropdown = document.createElement('li');
    accountDropdown.classList.add('nav-item', 'dropdown');
    navContainer.append(accountDropdown);

    const accountDropBtn = document.createElement('a');
    accountDropBtn.classList.add('nav-link', 'dropdown-toggle');
    accountDropBtn.setAttribute('data-bs-toggle', 'dropdown');
    accountDropBtn.setAttribute('aria-expanded', 'false');
    accountDropBtn.setAttribute('role', 'button');
    accountDropdown.append(accountDropBtn);

    // Profile Button
    const profileImg = document.createElement('div');
    profileImg.id = "nav-profile-img"
    profileImg.classList.add('profile-img');
    // profileImg.style.backgroundImage = `url(${getUserSession()?.image})`;
    accountDropBtn.append(profileImg);

    // Dropdown menu
    const dropMenu = document.createElement('ul');
    dropMenu.classList.add('dropdown-menu', 'dropdown-menu-lg-end');
    accountDropdown.append(dropMenu);

    // Drop Header
    const headerText = document.createElement('h6');
    headerText.id = "nav-drop-title";
    headerText.classList.add('dropdown-header');
    headerText.textContent = getUserSession()?.name;
    dropMenu.appendChild(createDropItem(headerText));

    // View profile
    const viewProfileBtn = document.createElement('a');
    viewProfileBtn.classList.add('dropdown-item');
    viewProfileBtn.href = `#profile=${getUserSession().userId}`;
    viewProfileBtn.textContent = viewProfile.label;
    dropMenu.appendChild(createDropItem(viewProfileBtn));

    // divider
    const dropDivider = document.createElement('hr');
    dropDivider.classList.add('dropdown-divider');
    dropMenu.appendChild(createDropItem(dropDivider));

    // Logout
    const logOutBtn = document.createElement('a');
    logOutBtn.classList.add('dropdown-item');
    logOutBtn.id = logout.id;
    logOutBtn.onclick = logout.onClick;
    logOutBtn.textContent = logout.label;
    
    dropMenu.appendChild(createDropItem(logOutBtn));

    getUserInfo(getUserSession().userId)
            .then(userInfo => {
                const navProfImg = document.getElementById('nav-profile-img');
                const navDropTitle = document.getElementById('nav-drop-title');
                if (userInfo?.image) navProfImg.style.backgroundImage = `url(${userInfo?.image})`;
                navDropTitle.textContent = userInfo.name;
            });


    return navContainer;
}

const createDropItem = (item) => {
    const li = document.createElement('li');
    li.appendChild(item);
    return li;
}

// ========================= Callbacks ============================= //

const handleLogOut = (event) => {
    event.preventDefault();

    // Clears User session local storage
    clearUserSession();

    // Navigate to login page
    navigateTo('#login');
}
