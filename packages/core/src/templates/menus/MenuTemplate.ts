
import { HTMLEMenuElement } from "../../elements/containers/menus/Menu";
import { HTMLElementConstructor } from "../../elements/HTMLElement";
import { HTMLEMenuItemGroupTemplate, HTMLEMenuItemGroupTemplateDescription } from "./MenuItemGroupTemplate";
import { HTMLEMenuItemTemplate, HTMLEMenuItemTemplateDescription } from "./MenuItemTemplate";

export { HTMLEMenuTemplateDescription };
export { HTMLEMenuTemplate };

type HTMLEMenuTemplateDescription = Partial<Pick<HTMLEMenuElement, 'id' | 'className' | 'name'>> & {
    items: (HTMLEMenuItemTemplateDescription | HTMLEMenuItemGroupTemplateDescription)[],
}

interface HTMLEMenuTemplate {
    (desc: HTMLEMenuTemplateDescription): HTMLEMenuElement;
}

const HTMLEMenuTemplate: HTMLEMenuTemplate = (desc: HTMLEMenuTemplateDescription) => {
    
    const items = desc.items.map((itemDesc) => {
        if ("isGroup" in itemDesc) {
            return HTMLEMenuItemGroupTemplate(itemDesc);
        }
        else {
            return HTMLEMenuItemTemplate(itemDesc);
        }
    });

    return HTMLElementConstructor(
        "e-menu", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name,
            },
            children: items
        }
    );
}