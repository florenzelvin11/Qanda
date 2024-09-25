export const Alert = (prop) => {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', prop.alertType, 'alert-dismissible');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = prop.alertText;

    const alertBtn = document.createElement('button');
    alertBtn.type = "button";
    alertBtn.className = "btn-close";
    alertBtn.setAttribute('data-bs-dismiss', "alert");
    alertBtn.setAttribute('aria-label', 'Close');

    alertDiv.append(alertBtn);

    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(alertDiv);
    return contentFrag;
};

export const generateGlobalAlert = (prop) => {
    const alertPlaceholder = document.getElementById('alert-placeholder');

    alertPlaceholder.append(Alert(prop));
}