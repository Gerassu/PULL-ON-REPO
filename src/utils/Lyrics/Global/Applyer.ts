import { setBlurringLastLine } from "../Animator/Lyrics/LyricsAnimator";
import { ApplyStaticLyrics } from "../Applyer/Static";
import { ApplyLineLyrics } from "../Applyer/Synced/Line";
import { ApplySyllableLyrics } from "../Applyer/Synced/Syllable";

export default function ApplyLyrics(lyrics) {
    setBlurringLastLine(null)
    if (lyrics?.Type === "Syllable") {
        ApplySyllableLyrics(lyrics);
    } else if (lyrics?.Type === "Line") {
        ApplyLineLyrics(lyrics);
    } else if (lyrics?.Type === "Static") {
        ApplyStaticLyrics(lyrics);
    }
}