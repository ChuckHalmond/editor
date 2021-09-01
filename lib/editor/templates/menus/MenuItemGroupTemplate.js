define(["require", "exports", "src/editor/elements/HTMLElement", "./MenuItemTemplate"], function (require, exports, HTMLElement_1, MenuItemTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemGroupTemplate = void 0;
    const HTMLEMenuItemGroupTemplate = (desc) => {
        const items = desc.items.map((descArgs) => (0, MenuItemTemplate_1.HTMLEMenuItemTemplate)(descArgs));
        return (0, HTMLElement_1.HTMLElementConstructor)("e-menuitemgroup", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name
            },
            children: items
        });
    };
    exports.HTMLEMenuItemGroupTemplate = HTMLEMenuItemGroupTemplate;
});
//# sourceMappingURL=MenuItemGroupTemplate.js.map