const prefix = "SpicyLyrics-";

let currentlyFetching = false;

function set(key: string, value: any) {
    if (key === "currentlyFetching") {
        currentlyFetching = value;
        return;
    }
    Spicetify.LocalStorage.set(`${prefix}${key}`, value);
}

function get(key: string) {
    if (key === "currentlyFetching") {
        return currentlyFetching;
    }
    const data = Spicetify.LocalStorage.get(`${prefix}${key}`);
    return data
}

export default {
    set,
    get
}