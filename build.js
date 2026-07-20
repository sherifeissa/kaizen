/**
 * build.js — bundles the src/ files into the single deployable tracker.html.
 *
 * Why a build step: the app ships as ONE html file (you paste it into Google
 * Apps Script, or double-click it locally). Keeping the source split into
 * css + small JS modules makes it readable to edit; this script stitches
 * them back into that one file.
 *
 * Run:  node build.js
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const css = fs.readFileSync(path.join(root, "src", "styles.css"), "utf8");

// concatenation order matters (no module loader — one shared scope; main.js boots last)
const order = ["state", "model", "views", "data", "art", "main"];
const js = order.map(n => "/* ===== " + n + ".js ===== */\n" +
  fs.readFileSync(path.join(root, "src", "app", n + ".js"), "utf8")).join("\n\n");

let html = fs.readFileSync(path.join(root, "src", "index.html"), "utf8");
// use function replacers so $-sequences in css/js aren't treated as special
html = html.replace("/*{{STYLES}}*/", () => css.replace(/\s+$/, ""));
html = html.replace("//{{SCRIPT}}", () => js);

fs.writeFileSync(path.join(root, "tracker.html"), html);
console.log("Built tracker.html — " + html.length + " bytes");
