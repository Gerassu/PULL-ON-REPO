import Animator from "../../utils/Animator";
import BlobURLMaker from "../../utils/BlobURLMaker";
import storage from "../../utils/storage";
import { SpotifyPlayer } from "../Global/SpotifyPlayer";
import ArtistVisuals from "./ArtistVisuals/Main";

export default async function ApplyDynamicBackground(element) {
    if (!element) return
    let currentImgCover = await SpotifyPlayer.Artwork.Get("d");
    const lowQMode = storage.get("lowQMode");
    const lowQModeEnabled = lowQMode && lowQMode === "true";
    const IsEpisode = Spicetify.Player.data.item.type === "episode";
    const CurrentSongArtist = IsEpisode ? null : Spicetify.Player.data?.item.artists[0].uri;
    const CurrentSongUri = Spicetify.Player.data?.item.uri;

    if (lowQModeEnabled) {
        try {
            currentImgCover = IsEpisode ? null : await LowQMode_SetDynamicBackground(CurrentSongArtist, CurrentSongUri);
        } catch (error) {
            console.error("Error happened while trying to set the Low Quality Mode Dynamic Background", error)
        }
    }
    

    if (lowQModeEnabled) {
        if (IsEpisode) return;
        const dynamicBg = document.createElement("img");
        const prevBg = element.querySelector(".spicy-dynamic-bg.lowqmode");

        if (prevBg && prevBg.getAttribute("spotifyimageurl") === currentImgCover) {
            dynamicBg.remove();
            return;
        }

        dynamicBg.classList.add("spicy-dynamic-bg", "lowqmode")

        const processedCover = `https://i.scdn.co/image/${currentImgCover.replace("spotify:image:", "")}`;

        dynamicBg.src = await BlobURLMaker(processedCover) ?? currentImgCover;
        dynamicBg.setAttribute("spotifyimageurl", currentImgCover);
        element.appendChild(dynamicBg);

        const Animator1 = new Animator(0, 1, 0.3);
        const Animator2 = new Animator(1, 0, 0.3);

        Animator1.on("progress", (progress) => {
            dynamicBg.style.opacity = progress.toString();
        });

        Animator2.on("progress", (progress) => {
            if (!prevBg) return;
            prevBg.style.opacity = progress.toString();
        });

        Animator1.on("finish", () => {
            dynamicBg.style.opacity = "1";
            Animator1.Destroy();
        });

        Animator2.on("finish", () => {
            prevBg?.remove();
            Animator2.Destroy();
        });

        Animator2.Start();
        Animator1.Start();
    } else {

        if (element?.querySelector(".spicy-dynamic-bg")) {
            const e = element.querySelector<HTMLElement>(".spicy-dynamic-bg");
            e.innerHTML = `
                <img class="Front" src="${currentImgCover}" />
                <img class="Back" src="${currentImgCover}" />
                <img class="BackCenter" src="${currentImgCover}" />
            `
        }
        const dynamicBg = document.createElement("div")
        dynamicBg.classList.add("spicy-dynamic-bg")
        dynamicBg.classList.remove("lowqmode")

        dynamicBg.innerHTML = `
            <img class="Front" src="${currentImgCover}" />
            <img class="Back" src="${currentImgCover}" />
            <img class="BackCenter" src="${currentImgCover}" />
        `
        element.appendChild(dynamicBg)
    }

}

export async function LowQMode_SetDynamicBackground(CurrentSongArtist, CurrentSongUri) {
    try {
        return await ArtistVisuals.ApplyContent(CurrentSongArtist, CurrentSongUri);
    } catch (error) {
        console.error("Error happened while trying to set the Low Quality Mode Dynamic Background", error)
    }
}