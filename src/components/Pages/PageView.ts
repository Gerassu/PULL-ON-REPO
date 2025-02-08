import fetchLyrics from "../../utils/Lyrics/fetchLyrics";
import storage from "../../utils/storage";
import "../../css/Loaders/DotLoader.css"
import { addLinesEvListener, removeLinesEvListener } from "../../utils/Lyrics/lyrics";
import ApplyDynamicBackground from "../DynamicBG/dynamicBackground";
import Defaults from "../Global/Defaults";
import { Icons } from "../Styling/Icons";
import { ScrollSimplebar } from "../../utils/Scrolling/Simplebar/ScrollSimplebar";
import ApplyLyrics from "../../utils/Lyrics/Global/Applyer";
import { SpotifyPlayer } from "../Global/SpotifyPlayer";
import { Session_NowBar_SetSide, Session_OpenNowBar, ToggleNowBar } from "../Utils/NowBar";
import Fullscreen from "../Utils/Fullscreen";
import TransferElement from "../Utils/TransferElement";
import Session from "../Global/Session";

export const Tooltips = {
    Close: null,
    Kofi: null,
    NowBarToggle: null,
    FullscreenToggle: null,
    LyricsToggle: null
}

const PageView = {
    Open: OpenPage,
    Destroy: DestroyPage,
    AppendViewControls,
    IsOpened: false,
};

export const PageRoot = document.querySelector<HTMLElement>('.Root__main-view .main-view-container div[data-overlayscrollbars-viewport]');

function OpenPage() {
    if (PageView.IsOpened) return;
    const elem = document.createElement("div");
    elem.id = "SpicyLyricsPage";
    elem.innerHTML = `
        <div class="ContentBox">
            <div class="NowBar">
                <div class="CenteredView">
                    <div class="Header">
                        <div class="MediaBox">
                            <div class="MediaContent" draggable="true"></div>
                            <img class="MediaImage" src="${SpotifyPlayer.Artwork.Get("xl")}" draggable="true" />
                        </div>
                        <div class="Metadata">
                            <div class="SongName">
                                <span>
                                    ${SpotifyPlayer.GetSongName()}
                                </span>
                            </div>
                            <div class="Artists">
                                <span></span> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="LyricsContainer">
                <div class="loaderContainer">
                    <div id="DotLoader"></div>
                </div>
                <div class="LyricsContent ScrollbarScrollable"></div>
            </div>
            <div class="ViewControls"></div>
            <div class="DropZone LeftSide">
                <span>Switch Sides</span>
            </div>
            <div class="DropZone RightSide">
                <span>Switch Sides</span>
            </div>
        </div>
    `

    const SkipSpicyFont = storage.get("skip-spicy-font");
    if (SkipSpicyFont != "true") {
        elem.classList.add("UseSpicyFont");
    }

    PageRoot.appendChild(elem);
    
    const lowQMode = storage.get("lowQMode");
    const lowQModeEnabled = lowQMode && lowQMode === "true";

    if (lowQModeEnabled) {
        elem.querySelector(".LyricsContainer .LyricsContent").classList.add("lowqmode")
    }
    

    Defaults.LyricsContainerExists = true;

    ApplyDynamicBackground(document.querySelector("#SpicyLyricsPage .ContentBox"))

    addLinesEvListener();

    {
        if (!Spicetify.Player.data?.item?.uri) return; // Exit if `uri` is not available
        const currentUri = Spicetify.Player.data.item.uri;

        fetchLyrics(currentUri).then(ApplyLyrics);
    }

    Session_OpenNowBar();

    /* const ArtworkButton = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar .Header .Artwork");

    ArtworkButton.addEventListener("click", () => {
        NowBar_SwapSides();
    }) */

    Session_NowBar_SetSide();

    AppendViewControls();
    PageView.IsOpened = true;
}

function DestroyPage() {
    if (!PageView.IsOpened) return;
    if (Fullscreen.IsOpen) Fullscreen.Close();
    if (!document.querySelector("#SpicyLyricsPage")) return
    document.querySelector("#SpicyLyricsPage")?.remove();
    Defaults.LyricsContainerExists = false;
    removeLinesEvListener();
    Object.values(Tooltips).forEach(a => a?.destroy());
    ScrollSimplebar?.unMount();
    PageView.IsOpened = false;
}

function AppendViewControls(ReAppend: boolean = false) {
    const elem = document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .ViewControls");
    if (!elem) return;
    if (ReAppend) elem.innerHTML = "";
    elem.innerHTML = `
        <button id="Close" class="ViewControl">${Icons.Close}</button>
        <button id="NowBarToggle" class="ViewControl">${Icons.NowBar}</button>
        <button id="FullscreenToggle" class="ViewControl">${Fullscreen.IsOpen ? Icons.CloseFullscreen : Icons.Fullscreen}</button>
        <button id="Kofi" class="ViewControl">${Icons.Kofi}</button>
    `

    if (Fullscreen.IsOpen) {
        TransferElement(elem, document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar .Header .MediaBox .MediaContent"));
        Object.values(Tooltips).forEach(a => a?.destroy());
        SetupTippy(document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar .Header .MediaBox .MediaContent .ViewControls"));
    } else {
        if (document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox .NowBar .Header .ViewControls")) {
            TransferElement(elem, document.querySelector<HTMLElement>("#SpicyLyricsPage .ContentBox"));
        }
        Object.values(Tooltips).forEach(a => a?.destroy());
        SetupTippy(elem);
    }

    function SetupTippy(elem: HTMLElement) {
        // Let's set up our TippyProps
        {
            const closeButton = elem.querySelector("#Close");

            Tooltips.Close = Spicetify.Tippy(
                closeButton,
                {
                    ...Spicetify.TippyProps,
                    content: `Close Page`
                }
            )

            closeButton.addEventListener(
                "click",
                () => Session.GoBack()
            )

            // Kofi Donation

            const kofiButton = elem.querySelector("#Kofi");

            Tooltips.Kofi = Spicetify.Tippy(
                kofiButton,
                {
                    ...Spicetify.TippyProps,
                    content: `Donate`
                }
            )

            kofiButton.addEventListener(
                "click",
                () => window.open("https://ko-fi.com/spikerko")
            )

            // NowBar Toggle Button

            const nowBarButton = elem.querySelector("#NowBarToggle");

            Tooltips.NowBarToggle = Spicetify.Tippy(
                nowBarButton,
                {
                    ...Spicetify.TippyProps,
                    content: `NowBar`
                }
            )

            nowBarButton.addEventListener(
                "click",
                () => ToggleNowBar()
            )

            // Fullscreen Button
            const fullscreenBtn = elem.querySelector("#FullscreenToggle");

            Tooltips.FullscreenToggle = Spicetify.Tippy(
                fullscreenBtn,
                {
                    ...Spicetify.TippyProps,
                    content: `Fullscreen Mode`
                }
            )

            fullscreenBtn.addEventListener(
                "click",
                () => Fullscreen.Toggle()
            )
        }
    }
}

export default PageView;