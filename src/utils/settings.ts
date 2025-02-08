import { SettingsSection } from "spcr-settings";
import storage from "./storage";
import { lyricsCache } from "./Lyrics/fetchLyrics";
import Defaults from "../components/Global/Defaults";

export function setSettingsMenu() {
    generalSettings();
    devSettings();
    infos();
}

function devSettings() {
    const settings = new SettingsSection("Spicy Lyrics - Developer Settings", "spicy-lyrics-dev-settings");

    settings.addInput("custom-lyrics-api", "Custom Lyrics API", Defaults.lyrics.api.url, () => {
        storage.set("customLyricsApi", settings.getFieldValue("custom-lyrics-api") as string)
        Spicetify.showNotification("Custom Lyrics API Updated Successfully!", false, 1000);
    });

    settings.addInput("lyrics-api-access-token", "Lyrics API Access Token", Defaults.lyrics.api.accessToken, () => { 
        storage.set("lyricsApiAccessToken", settings.getFieldValue("lyrics-api-access-token") as string)
        Spicetify.showNotification("Lyrics API Access Token Updated Successfully!", false, 1000);
    });

    settings.addButton("reset-custom-apis", "Reset Custom APIs", "Reset to Default", () => {
        settings.setFieldValue("custom-lyrics-api", Defaults.lyrics.api.url);
        settings.setFieldValue("lyrics-api-access-token", Defaults.lyrics.api.accessToken);

        storage.set("customLyricsApi", Defaults.lyrics.api.url)
        storage.set("lyricsApiAccessToken", Defaults.lyrics.api.accessToken)

        settings.rerender();

        Spicetify.showNotification("Custom APIs Reset Successfully!", false, 3000);
    });

    settings.addButton("remove-cached-lyrics", "Remove Cached Lyrics (Lyrics Stay in Cache for 7 days*)", "Remove Cached Lyrics", () => {
        lyricsCache.destroy();
        Spicetify.showNotification("Cache Destroyed Successfully!", false, 5000);
    });

    settings.addButton("remove-current-song-lyrics-from-localStorage", "Remove Current Song Lyrics from LocalStorage", "Remove Current Lyrics", () => { 
        storage.set("currentLyricsData", null);
        Spicetify.showNotification("Current Lyrics Removed Successfully!", false, 5000);
    });


    settings.pushSettings();
}


function generalSettings() {
    const settings = new SettingsSection("Spicy Lyrics", "spicy-lyrics-settings");

    settings.addToggle("low-q-mode", "Low Quality Mode", Defaults.lowQualityMode, () => {
        storage.set("lowQMode", settings.getFieldValue("low-q-mode") as string)
    }); 

    settings.addToggle("skip-spicy-font", "Skip Spicy Font**", Defaults.SkipSpicyFont, () => {
        storage.set("skip-spicy-font", settings.getFieldValue("skip-spicy-font") as string)
    }); 

    settings.addToggle("old-style-font", "Old Style Font (Gets Overriden by the previous option)", Defaults.OldStyleFont, () => {
        storage.set("old-style-font", settings.getFieldValue("old-style-font") as string)
    }); 

    settings.addButton("save-n-reload", "Save your current settings and reload.", "Save & Reload", () => {
        window.location.reload();
    });
    

    settings.pushSettings()
}

function infos() {
    const settings = new SettingsSection("Spicy Lyrics - Info", "spicy-lyrics-settings-info");

    settings.addButton("more-info", "*Only if you're online", "", () => {});
    settings.addButton("more-info2", "**If you're using a custom font modification, turn that on", "", () => {});

    settings.pushSettings();

}