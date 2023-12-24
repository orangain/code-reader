/**
 * Get the extension of a file path.
 *
 * @param {string} filePath 
 * @returns {string}
 */
export function extension(filePath) {
    const match = filePath.match(/\.([^\.]+)$/);
    if (match) {
        return match[1];
    }
    return "";
}

/**
 * Group the items in an array by a key.
 *
 * @template T
 * @param {T[]} array 
 * @param {(T) => string | number | symbol} getKey 
 * @returns {[string | number | symbol, T[]][]}
 */
export function groupBy(array, getKey) {
    /**
     * @type {[string | number | symbol, T[]][]}
     */
    const grouped = [];
    /**
     * @type {string | number | symbol | null}
     */
    let lastKey = null;
    /**
     * @type {T[]}
     */
    let lastGroup = [];
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
