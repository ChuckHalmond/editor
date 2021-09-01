import { HTMLElementConstructor } from "editor/elements/HTMLElement";
import { HTMLEMenuItemGroupTemplate } from "./MenuItemGroupTemplate";
import { HTMLEMenuItemTemplate } from "./MenuItemTemplate";
export { HTMLEMenuTemplate };
const HTMLEMenuTemplate = (desc) => {
    const items = desc.items.map((itemDesc) => {
        if ("isGroup" in itemDesc) {
            return HTMLEMenuItemGroupTemplate(itemDesc);
        }
        else {
            return HTMLEMenuItemTemplate(itemDesc);
        }
    });
    return HTMLElementConstructor("e-menu", {
        props: {
            id: desc.id,
            className: desc.className,
            name: desc.name,
        },
        children: items
    });
};
//# sourceMappingURL=MenuTemplate.js.map