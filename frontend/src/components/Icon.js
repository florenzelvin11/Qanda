export const Icon = (icon) => {
    const i = document.createElement('i');
    i.classList.add('fa', icon);
    return i;
}