export default function GetHeaderUrl(data: any) {
    const HeaderImage = typeof data === "object" ? data?.Visuals?.headerImage?.sources[0]?.url : JSON.parse(data)?.Visuals?.headerImage?.sources[0]?.url;
    if (!HeaderImage) return Spicetify.Player.data?.item.metadata.image_xlarge_url || null;
    return `spotify:image:${HeaderImage.replace("https://i.scdn.co/image/", "")}`;
}