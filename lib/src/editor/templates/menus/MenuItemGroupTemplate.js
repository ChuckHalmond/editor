import { HTMLElementConstructor } from "../../elements/HTMLElement";
import { HTMLEMenuItemTemplate } from "./MenuItemTemplate";
export { HTMLEMenuItemGroupTemplate };
const HTMLEMenuItemGroupTemplate = (desc) => {
    const items = desc.items.map((descArgs) => HTMLEMenuItemTemplate(descArgs));
    return HTMLElementConstructor("e-menuitemgroup", {
        props: {
            id: desc.id,
            className: desc.className,
            name: desc.name
        },
        children: items
    });
};
//# sourceMappingURL=MenuItemGroupTemplate.js.map