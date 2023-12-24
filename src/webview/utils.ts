/**
 * Get the extension of a file path.
 */
export function extension(filePath: string): string {
  const match = filePath.match(/\.([^\.]+)$/);
  if (match) {
    return match[1];
  }
  return "";
}

/**
 * Group the items in an array by a key.
 */
export function groupBy<K extends PropertyKey, V>(
  array: V[],
  getKey: (item: V) => K
): [K, V[]][] {
  const grouped: [K, V[]][] = [];
  let lastKey: K | null = null;
  let lastGroup: V[] = [];

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
