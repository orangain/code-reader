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
export function groupBy<T>(
  array: T[],
  getKey: (item: T) => PropertyKey
): [PropertyKey, T[]][] {
  const grouped: [PropertyKey, T[]][] = [];
  let lastKey: PropertyKey | null = null;
  let lastGroup: T[] = [];

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
