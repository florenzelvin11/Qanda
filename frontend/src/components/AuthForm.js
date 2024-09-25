export const AuthForm = (props) => {
    /**
     * parameter:
     * Title - formTitle
     * Subtitle - subtitle
     * Text Inputs - array of inputs
     * [
     * {
     * type, id, label, placeholder, invalidFeeback, required = false, onChange, mb = "mb-3"
     * }
     * ]
     * Button - obj button
     * {
     *  id,
     *  btnLabel, 
     *  onClick,
     * }
     * sub-link - obj
     * {
     *  text,
     *  id, 
     *  targetLink
     *  linkLabel
     * }
     * 
     * return is a form element
     */

    const authFormcard = document.createElement('div');
    authFormcard.classList.add('auth-form-card');

    const formTitle = document.createElement('h1');
    formTitle.classList.add('mb-3');
    formTitle.textContent = props.title;

    // Checks if form has a subtitle
    const formSubtitle = document.createElement('p');
    formSubtitle.classList.add('mb-3');
    formSubtitle.textContent = props.subtitle;

    // creates a form with inputs
    const form = document.createElement('form');
    form.id = "auth-form";
    form.classList.add('needs-validation', 'mb-4');
    form.setAttribute('novalidate', '');

    // Inputs
    form.append(...props.textInputs.map((obj) => {
        return addTextInput(...Object.values(obj));
    }));

    // Button
    const formBtn = createBtnInput(...Object.values(props.button));
    form.append(formBtn);

    // Sub-link
    const { sbText, sbId, sbTargetLink, sblinkLabel } = props.subLink;
    const subLink = document.createElement('div');
    subLink.classList.add('sub-link');
    subLink.textContent = sbText;

    const link = document.createElement('a');
    link.id = sbId;
    link.href = sbTargetLink;
    link.textContent = sblinkLabel;

    subLink.appendChild(link);

    // Group all elements together
    authFormcard.append(formTitle, formSubtitle, form, subLink);

    // Return constructed form element
    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(authFormcard)
    return contentFrag;
}

const addTextInput = (type, id, label, placeholder, invalidFeeback, required = false, onChange = () => {}, mb = "mb-3") => {
    const inputElem = document.createElement('input');
    inputElem.type = type;
    inputElem.className = "form-control";
    inputElem.id = id;
    inputElem.placeholder = placeholder;
    inputElem.required = required;
    inputElem.onchange = onChange;

    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', id);
    labelElem.textContent = label;

    const invalidDiv = document.createElement('div');
    invalidDiv.className = "invalid-feedback";
    invalidDiv.textContent = invalidFeeback;

    const formFloat = document.createElement('div');
    formFloat.classList.add('form-floating', mb);

    formFloat.append(inputElem, labelElem, invalidDiv);

    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(formFloat);
    return contentFrag;
}

const createBtnInput = (id, text, onClick = () => {}) => {
    const btn = document.createElement('button');
    btn.id = id;
    btn.classList.add('btn', 'btn-primary');
    btn.type = 'button';
    btn.textContent = text;
    btn.onclick = onClick;

    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(btn)
    return contentFrag;
}
