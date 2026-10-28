// Turns a location list into clean, unique entries.
// Accepts a string or an array, and splits any entry on commas or new lines,
// so "Whitefield, Sarjapura" becomes ["Whitefield", "Sarjapura"].
export function splitLocations(value) {
  const items = Array.isArray(value) ? value : [value];
  const result = items
    .flatMap((item) => (typeof item === 'string' ? item.split(/[,，\n\r]+/) : []))
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(result)];
}
