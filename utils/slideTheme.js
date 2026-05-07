/**
 * Sanitize homepage slider slide theme colours (hex only) for Mongo + JSON.
 */

function normalizeHex(v) {
  if (v == null) return "";
  const s = String(v).trim();
  if (!s) return "";
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  if (!hex.test(s)) return "";
  if (s.length === 4) {
    const r = s[1];
    const g = s[2];
    const b = s[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return s.toLowerCase();
}

function normalizeSlideTheme(input) {
  if (input == null || typeof input !== "object" || Array.isArray(input))
    return {};
  return {
    tagColor: normalizeHex(input.tagColor),
    tagLineColor: normalizeHex(input.tagLineColor),
    headline1Color: normalizeHex(input.headline1Color),
    headline2Color: normalizeHex(input.headline2Color),
    subheadingColor: normalizeHex(input.subheadingColor),
    buttonBg: normalizeHex(input.buttonBg),
    buttonText: normalizeHex(input.buttonText),
  };
}

module.exports = { normalizeSlideTheme, normalizeHex };
