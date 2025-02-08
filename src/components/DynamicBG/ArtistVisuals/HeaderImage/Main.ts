import SpicyFetch from "../../../../utils/API/SpicyFetch";
import ArtistVisuals from "../Main";
import GetHeaderUrl from "./GetHeaderUrl";


export default async function ApplyContent(CurrentSongArtist: string, CurrentSongUri: string) {
    if (!CurrentSongArtist) throw new Error("Invalid Song Artist");
    if (!CurrentSongUri) throw new Error("Invalid Song URI");
    const TrackId = CurrentSongUri.split(":")[2];
    if (!TrackId) throw new Error("Invalid Song URI");
    const Cached: any = await ArtistVisuals.Cache.get(TrackId);

    if (Cached) {
        if (Cached.metadata.expiresIn <= Date.now()) {
            await ArtistVisuals.Cache.remove(TrackId);
            return Continue();
        }
        if (Cached?.data) {
            return GetHeaderUrl(Cached?.data);
        }
        await ArtistVisuals.Cache.remove(TrackId);
        return Continue();
    }

    return Continue();

    async function Continue() {
        const [res, status] = await SpicyFetch(`artist/visuals?artist=${CurrentSongArtist}&track=${CurrentSongUri}`);
        if (status === 200) {
            await ArtistVisuals.Cache.set(TrackId, {
                data: res,
                metadata: {
                    expiresIn: Date.now() + 259200000 // 3 days
                }
            });
            return GetHeaderUrl(res);
        } else {
            throw new Error(`Failed to fetch visuals: ${status}`);
        }
    }

}