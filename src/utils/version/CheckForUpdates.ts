import Session from "../../components/Global/Session";

let ShownUpdateNotice = false;

export async function CheckForUpdates() {
    const IsOutdated = await Session.SpicyLyrics.IsOutdated();
    if (IsOutdated) {
        if (ShownUpdateNotice) return;
        const currentVersion = Session.SpicyLyrics.GetCurrentVersion();
        const latestVersion = await Session.SpicyLyrics.GetLatestVersion();
        Spicetify.PopupModal.display({
          title: "New Update - Spicy Lyrics",
          content: `
          <div style="font-size: 1.5rem;">
            Your Spicy Lyrics version is outdated.
            To update, click on the "Update" button.
            <br>
            Version: From: ${currentVersion.Text} -> To: ${latestVersion.Text}
            <br><br>
            <button onclick="window._spicy_lyrics_session.Navigate({ pathname: '/SpicyLyrics/Update' })" class="Button-sc-y0gtbx-0 Button-buttonSecondary-small-useBrowserDefaultFocusStyle encore-text-body-small-bold" data-encore-id="buttonSecondary">
              Update
            </button>
          </div>`,
        })
        ShownUpdateNotice = true;
    }
}