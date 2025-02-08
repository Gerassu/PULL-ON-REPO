import { DeepFreeze } from "../../utils/Addons";

const Fonts = DeepFreeze({
    Lyrics: () => LoadFont("https://fonts.spikerko.org/spicy-lyrics/source.css"),
    Vazirmatn: () => LoadFont("https://fonts.spikerko.org/Vazirmatn/source.css"),
})

export default function LoadFonts() {
    // Iterate over the functions in Fonts and execute each one
    Object.values(Fonts).forEach(loadFontFunction => loadFontFunction());
}

function LoadFont(url: string) {
    const fontElement = document.createElement("link");
    fontElement.href = url;
    fontElement.rel = "stylesheet";
    fontElement.type = "text/css";
    document.head.appendChild(fontElement);
}