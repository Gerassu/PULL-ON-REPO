function DeepFreeze(obj: Object): Readonly<Object> {
    if (obj === null || typeof obj !== "object") {
        // Base case: Return primitives as they are
        return obj;
    }

    // Create a copy of the object or array
    const clone = Array.isArray(obj) ? [] : {};

    // Recursively copy and freeze properties
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        clone[key] = DeepFreeze(value); // Deep copy and freeze the value
    });

    // Freeze the cloned object
    return Object.freeze(clone);
}

function IsPlaying() {
    const state = Spicetify?.Player?.data?.isPaused;
    return !state;
}

function TOP_ApplyLyricsSpacer(Container: HTMLElement) {
    const div = document.createElement("div");
    div.classList.add("TopSpacer");
    Container.appendChild(div);
}

function BOTTOM_ApplyLyricsSpacer(Container: HTMLElement) {
    const div = document.createElement("div");
    div.classList.add("BottomSpacer");
    Container.appendChild(div);
}

export const ArabicPersianRegex = /[\u0600-\u06FF]/;

export { DeepFreeze, IsPlaying, TOP_ApplyLyricsSpacer, BOTTOM_ApplyLyricsSpacer }