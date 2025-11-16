export function convertToDMS(deg) {
    if (deg === null || deg === undefined) return "--";

    const d = Math.floor(deg);
    const mFloat = (deg - d) * 60;
    const m = Math.floor(mFloat);
    const s = Math.round((mFloat - m) * 60);

    return `${d}:${m}:${s}`;
}
