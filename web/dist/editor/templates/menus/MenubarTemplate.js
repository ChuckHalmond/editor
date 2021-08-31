define(["require", "exports", "src/editor/elements/HTMLElement", "./MenuItemTemplate"], function (require, exports, HTMLElement_1, MenuItemTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenubarTemplate = void 0;
    const HTMLEMenubarTemplate = (desc) => {
        const items = desc.items.map((itemDesc) => {
            return (0, MenuItemTemplate_1.HTMLEMenuItemTemplate)(itemDesc);
        });
        return (0, HTMLElement_1.HTMLElementConstructor)("e-menubar", {
            props: {
                id: desc.id,
                className: desc.className,
                tabIndex: desc.tabIndex
            },
            children: items
        });
    };
    exports.HTMLEMenubarTemplate = HTMLEMenubarTemplate;
});
//# sourceMappingURL=MenubarTemplate.js.map