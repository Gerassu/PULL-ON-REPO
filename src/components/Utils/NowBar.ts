import BlobURLMaker from "../../utils/BlobURLMaker";
import storage from "../../utils/storage";
import { SpotifyPlayer } from "../Global/SpotifyPlayer";
import { Tooltips } from "../Pages/PageView";
import Fullscreen from "./Fullscreen";


function OpenNowBar() {
    const NowBar = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar");
    if (!NowBar) return;
    UpdateNowBar(true);
    NowBar.classList.add("Active");
    storage.set("IsNowBarOpen", "true");

    if (Fullscreen.IsOpen) {
        const MediaBox = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar .Header .MediaBox .MediaContent");
        
        // Let's Apply more data into the fullscreen mode.
        {
            if (MediaBox.querySelector(".AlbumData")) return;
            const AlbumNameElement = document.createElement("div");
            AlbumNameElement.classList.add("AlbumData");
            AlbumNameElement.innerHTML = `<span>${SpotifyPlayer.GetAlbumName()}</span>`;
            MediaBox.insertBefore(AlbumNameElement, MediaBox.firstChild);
        }
    }

    
    const DragBox = 
        (
            Fullscreen.IsOpen
                ? document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar .Header .MediaBox .MediaContent")
                : document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar .Header .MediaBox .MediaImage")
        );
    
    const dropZones = document.querySelectorAll<HTMLElement>("#SpicyLyricsPage .ContentBox .DropZone");

    DragBox.addEventListener("dragstart", (e) => {
        setTimeout(() => {
            document.querySelector("#SpicyLyricsPage").classList.add("SomethingDragging");
            if (NowBar.classList.contains("LeftSide")) {
                dropZones.forEach(zone => {
                    if (zone.classList.contains("LeftSide")) {
                        zone.classList.add("Hidden")
                    } else {
                        zone.classList.remove("Hidden")
                    }
                });
            } else if (NowBar.classList.contains("RightSide")) {
                dropZones.forEach(zone => {
                    if (zone.classList.contains("RightSide")) {
                        zone.classList.add("Hidden")
                    } else {
                        zone.classList.remove("Hidden")
                    }
                });
            }
            DragBox.classList.add("Dragging")
        }, 0);
    });
    
    DragBox.addEventListener("dragend", () => {
        document.querySelector("#SpicyLyricsPage").classList.remove("SomethingDragging");
        dropZones.forEach(zone => zone.classList.remove("Hidden"));
        DragBox.classList.remove("Dragging")
    });
    
    dropZones.forEach((zone) => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.classList.add("DraggingOver");
        });
    
        zone.addEventListener("dragleave", () => {
            zone.classList.remove("DraggingOver");
        });
    
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("DraggingOver");
        
            const currentClass = NowBar.classList.contains("LeftSide")
                ? "LeftSide"
                : "RightSide";

            const newClass = zone.classList.contains("RightSide") ? "RightSide" : "LeftSide";
        
            NowBar.classList.remove(currentClass);
            NowBar.classList.add(newClass);

            const side = zone.classList.contains("RightSide") ? "right" : "left";

            storage.set("NowBarSide", side);
        });
    });


}

function CloseNowBar() {
    const NowBar = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar");
    if (!NowBar) return;
    NowBar.classList.remove("Active");
    storage.set("IsNowBarOpen", "false");
}

function ToggleNowBar() {
    const IsNowBarOpen = storage.get("IsNowBarOpen");
    if (IsNowBarOpen === "true") {
        CloseNowBar();
    } else {
        OpenNowBar();
    }
}

function Session_OpenNowBar() {
    const IsNowBarOpen = storage.get("IsNowBarOpen");
    if (IsNowBarOpen === "true") {
        OpenNowBar();
    } else {
        CloseNowBar();
    }
}

function UpdateNowBar(force: boolean = false) {
    const NowBar = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar");
    const ArtistsDiv = NowBar.querySelector<HTMLSpanElement>(".Header .Metadata .Artists");
    const ArtistsSpan = NowBar.querySelector<HTMLSpanElement>(".Header .Metadata .Artists span");
    const MediaImage = NowBar.querySelector<HTMLImageElement>(".Header .MediaBox .MediaImage");
    const SongNameSpan = NowBar.querySelector<HTMLSpanElement>(".Header .Metadata .SongName span");
    const MediaBox = NowBar.querySelector<HTMLElement>(".Header .MediaBox");
    const SongName = NowBar.querySelector<HTMLElement>(".Header .Metadata .SongName");
    ArtistsDiv.classList.add("Skeletoned");
    MediaBox.classList.add("Skeletoned");
    SongName.classList.add("Skeletoned");
    if (!NowBar) return;
    const IsNowBarOpen = storage.get("IsNowBarOpen");
    if (IsNowBarOpen == "false" && !force) return;

    SpotifyPlayer.Artwork.Get("xl").then(artwork => {
        BlobURLMaker(`https://i.scdn.co/image/${artwork.replace("spotify:image:", "")}`).then(processedArtwork => {
            MediaImage.src = processedArtwork ?? artwork;
            MediaBox.classList.remove("Skeletoned");
        });
    });

    SpotifyPlayer.GetSongName().then(title => {
        SongNameSpan.textContent = title;
        SongName.classList.remove("Skeletoned");
    });

    SpotifyPlayer.GetArtists().then(artists => {
        const JoinedArtists = SpotifyPlayer.JoinArtists(artists);
        ArtistsSpan.textContent = JoinedArtists;
        ArtistsDiv.classList.remove("Skeletoned");
    });

    if (Fullscreen.IsOpen) {
        const NowBarAlbum = NowBar.querySelector<HTMLElement>(".Header .MediaBox .AlbumData");
        if (NowBarAlbum) {
            NowBarAlbum.classList.add("Skeletoned");
            const AlbumSpan = NowBarAlbum.querySelector<HTMLSpanElement>("span");
            AlbumSpan.textContent = SpotifyPlayer.GetAlbumName();
            NowBarAlbum.classList.remove("Skeletoned");
        }
    }
}

function NowBar_SwapSides() {
    const NowBar = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar");
    if (!NowBar) return;
    const CurrentSide = storage.get("NowBarSide");
    if (CurrentSide === "left") {
        storage.set("NowBarSide", "right");
        NowBar.classList.remove("LeftSide");
        NowBar.classList.add("RightSide");
    } else if (CurrentSide === "right") {
        storage.set("NowBarSide", "left");
        NowBar.classList.remove("RightSide");
        NowBar.classList.add("LeftSide");
    } else {
        storage.set("NowBarSide", "right");
        NowBar.classList.remove("LeftSide");
        NowBar.classList.add("RightSide");
    }
}


function Session_NowBar_SetSide() {
    const NowBar = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar");
    if (!NowBar) return;
    const CurrentSide = storage.get("NowBarSide");
    if (CurrentSide === "left") {
        storage.set("NowBarSide", "left");
        NowBar.classList.remove("RightSide");
        NowBar.classList.add("LeftSide");
    } else if (CurrentSide === "right") {
        storage.set("NowBarSide", "right");
        NowBar.classList.remove("LeftSide");
        NowBar.classList.add("RightSide");
    } else {
        storage.set("NowBarSide", "left");
        NowBar.classList.remove("RightSide");
        NowBar.classList.add("LeftSide");
    }
}


function DeregisterNowBarBtn() {
    Tooltips.NowBarToggle?.destroy();
    Tooltips.NowBarToggle = null;
    const nowBarButton = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .ViewControls #NowBarToggle");
    nowBarButton?.remove();
}

export {
    OpenNowBar,
    CloseNowBar,
    ToggleNowBar,
    UpdateNowBar,
    Session_OpenNowBar,
    NowBar_SwapSides,
    Session_NowBar_SetSide,
    DeregisterNowBarBtn
}