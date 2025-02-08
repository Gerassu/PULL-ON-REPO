export default function threeDotText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}