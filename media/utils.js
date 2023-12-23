export function extension(filePath) {
    const match = filePath.match(/\.([^\.]+)$/);
    if (match) {
        return match[1];
    }
    return "";
}

export function groupBy(array, getKey) {
    const grouped = [];
    let lastKey = null;
    let lastGroup = null;
    for (const item of array) {
        const key = getKey(item);
        if (key !== lastKey) {
            lastKey = key;
            lastGroup = [];
            grouped.push([key, lastGroup]);
        }
        lastGroup.push(item);
    }
    return grouped;
}
