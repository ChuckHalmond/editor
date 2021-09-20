import { Element } from "../../elements/HTMLElement";
import { HTMLEMenuItemTemplate } from "./MenuItemTemplate";
export { HTMLEMenubarTemplate };
const HTMLEMenubarTemplate = (desc) => {
    const items = desc.items.map((itemDesc) => {
        return HTMLEMenuItemTemplate(itemDesc);
    });
    return Element("e-menubar", {
        props: {
            id: desc.id,
            className: desc.className,
            tabIndex: desc.tabIndex
        },
        children: items
    });
};
//# sourceMappingURL=MenubarTemplate.js.map