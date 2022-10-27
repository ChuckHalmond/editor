export { themeStylesheet };
const themeStylesheet = new CSSStyleSheet();
fetch("../css/theme.css").then(async function (resp) {
    const text = await resp.text();
    themeStylesheet.replace(text);
});
//# sourceMappingURL=Theme.js.map