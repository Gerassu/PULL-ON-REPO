import Defaults from "../../../../components/Global/Defaults";
import { LyricsObject } from "../../lyrics";
import { timeOffset } from "../Shared";

export function TimeSetter(PreCurrentPosition) {
  const CurrentPosition = PreCurrentPosition + timeOffset;
  const CurrentLyricsType = Defaults.CurrentLyricsType;
  if (CurrentLyricsType && CurrentLyricsType === "None") return;
  const lines = LyricsObject.Types[CurrentLyricsType].Lines;

  if (CurrentLyricsType === "Syllable") {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const lineTimes = {
        start: line.StartTime,
        end: line.EndTime,
        total: line.EndTime - line.StartTime
      }

      if (lineTimes.start <= CurrentPosition && CurrentPosition <= lineTimes.end) {
        line.Status = "Active";

        const words = line.Syllables.Lead;
        for (let j = 0; j < words.length; j++) {
          const word = words[j];
          if (word.StartTime <= CurrentPosition && CurrentPosition <= word.EndTime) {
            word.Status = "Active";
          } else if (word.StartTime >= CurrentPosition) {
            word.Status = "NotSung";
          } else if (word.EndTime <= CurrentPosition) {
            word.Status = "Sung";
          }

          if (word?.LetterGroup) {
            for (let k = 0; k < word.Letters.length; k++) {
              const letter = word.Letters[k];
              if (letter.StartTime <= CurrentPosition && CurrentPosition <= letter.EndTime) {
                letter.Status = "Active";
              } else if (letter.StartTime >= CurrentPosition) {
                letter.Status = "NotSung";
              } else if (letter.EndTime <= CurrentPosition) {
                letter.Status = "Sung";
              }
            }
          }

        }

      } else if (lineTimes.start >= CurrentPosition) {
        line.Status = "NotSung";

        const words = line.Syllables.Lead;
        for (let j = 0; j < words.length; j++) {
          const word = words[j];
          word.Status = "NotSung";

          if (word?.LetterGroup) {
            for (let k = 0; k < word.Letters.length; k++) {
              const letter = word.Letters[k];
              letter.Status = "NotSung";
            }
          }
        }
      } else if (lineTimes.end <= CurrentPosition) {
        line.Status = "Sung";

        const words = line.Syllables.Lead;
        for (let j = 0; j < words.length; j++) {
          const word = words[j];
          word.Status = "Sung";

          if (word?.LetterGroup) {
            for (let k = 0; k < word.Letters.length; k++) {
              const letter = word.Letters[k];
              letter.Status = "Sung";
            }
          }
        }
      }
    }
  } else if (CurrentLyricsType === "Line") {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const lineTimes = {
        start: line.StartTime,
        end: line.EndTime,
        total: line.EndTime - line.StartTime
      }

      if (lineTimes.start <= CurrentPosition && CurrentPosition <= lineTimes.end) {
        line.Status = "Active";
        if (line.DotLine) {
          const Array = line.Syllables.Lead;
          for (let i = 0; i < Array.length; i++) {
            const dot = Array[i];
            if (dot.StartTime <= CurrentPosition && CurrentPosition <= dot.EndTime) {
              dot.Status = "Active";
            } else if (dot.StartTime >= CurrentPosition) {
              dot.Status = "NotSung";
            } else if (dot.EndTime <= CurrentPosition) {
              dot.Status = "Sung";
            }
          }
        }
      } else if (lineTimes.start >= CurrentPosition) {
        line.Status = "NotSung";
        if (line.DotLine) {
          const Array = line.Syllables.Lead;
          for (let i = 0; i < Array.length; i++) {
            const dot = Array[i];
            dot.Status = "NotSung";
          }
        }
      } else if (lineTimes.end <= CurrentPosition) {
        line.Status = "Sung";
        if (line.DotLine) {
          const Array = line.Syllables.Lead;
          for (let i = 0; i < Array.length; i++) {
            const dot = Array[i];
            dot.Status = "Sung";
          }
        }
      }
    }
  }
}