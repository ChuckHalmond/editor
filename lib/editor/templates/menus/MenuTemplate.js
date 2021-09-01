define(["require", "exports", "src/editor/elements/HTMLElement", "./MenuItemGroupTemplate", "./MenuItemTemplate"], function (require, exports, HTMLElement_1, MenuItemGroupTemplate_1, MenuItemTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuTemplate = void 0;
    const HTMLEMenuTemplate = (desc) => {
        const items = desc.items.map((itemDesc) => {
            if ("isGroup" in itemDesc) {
                return (0, MenuItemGroupTemplate_1.HTMLEMenuItemGroupTemplate)(itemDesc);
            }
            else {
                return (0, MenuItemTemplate_1.HTMLEMenuItemTemplate)(itemDesc);
            }
        });
        return (0, HTMLElement_1.HTMLElementConstructor)("e-menu", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name,
            },
            children: items
        });
    };
    exports.HTMLEMenuTemplate = HTMLEMenuTemplate;
});
//# sourceMappingURL=MenuTemplate.js.map