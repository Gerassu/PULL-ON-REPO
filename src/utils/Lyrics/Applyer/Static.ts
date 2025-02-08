import { ArabicPersianRegex, BOTTOM_ApplyLyricsSpacer, TOP_ApplyLyricsSpacer } from "../../Addons";
import Defaults from "../../../components/Global/Defaults";
import { applyStyles, removeAllStyles } from "../../CSS/Styles";
import { ClearScrollSimplebar, MountScrollSimplebar, RecalculateScrollSimplebar, ScrollSimplebar } from "../../Scrolling/Simplebar/ScrollSimplebar";
import { ClearLyricsContentArrays, LyricsObject } from "../lyrics";
import { ApplyLyricsCredits } from "./Credits/ApplyLyricsCredits";


export function ApplyStaticLyrics(data) {
    if (!Defaults.LyricsContainerExists) return
    const LyricsContainer = document.querySelector<HTMLElement>("#SpicyLyricsPage .LyricsContainer .LyricsContent");

    LyricsContainer.setAttribute("data-lyrics-type", "Static")

    ClearLyricsContentArrays();
    ClearScrollSimplebar();


    TOP_ApplyLyricsSpacer(LyricsContainer)

    data.Lines.forEach(line => {
      const lineElem = document.createElement("div")
      
      if (line.Text.includes("[DEF=font_size:small]")) {
        lineElem.style.fontSize = "35px"
        lineElem.textContent = line.Text.replace("[DEF=font_size:small]", "")
      } else {
        lineElem.textContent = line.Text
      }
      
      lineElem.classList.add("line")
      lineElem.classList.add("static")

      if (ArabicPersianRegex.test(line.Text)) {
        lineElem.setAttribute("font", "Vazirmatn")
      }

      LyricsObject.Types.Static.Lines.push({
        HTMLElement: lineElem,
      })
      
      LyricsContainer.appendChild(lineElem)
    })
    ApplyLyricsCredits(data);

    BOTTOM_ApplyLyricsSpacer(LyricsContainer)

    if (ScrollSimplebar) RecalculateScrollSimplebar();
      else MountScrollSimplebar();

    const LyricsStylingContainer = document.querySelector<HTMLElement>("#SpicyLyricsPage .LyricsContainer .LyricsContent .simplebar-content");

    if (data.offline) {
      LyricsStylingContainer.classList.add("offline");
    }

    removeAllStyles(LyricsStylingContainer)

    if (data.classes) {
      LyricsStylingContainer.className = data.classes;
    }

    if (data.styles) {
      applyStyles(LyricsStylingContainer, data.styles);
    }
    
}