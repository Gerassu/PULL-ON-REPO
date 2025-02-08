export function applyStyles(element, styles) {
    if (element) {
        Object.entries(styles).forEach(([key, value]) => {
            element.style[key] = value;
        });
    } else {
        console.warn("Element not found");
    }
}

export function removeAllStyles(element) {
    if (element) {
        element.style = null
    } else {
        console.warn("Element not found");
    }
}