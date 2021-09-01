
import { HTMLEMenuBarElement } from "../../elements/containers/menus/MenuBar";
import { HTMLElementConstructor } from "../../elements/HTMLElement";
import { HTMLEMenuItemTemplateDescription, HTMLEMenuItemTemplate } from "./MenuItemTemplate";


export { HTMLEMenubarTemplateDescription };
export { HTMLEMenubarTemplate };

type HTMLEMenubarTemplateDescription = Partial<Pick<HTMLEMenuBarElement, 'id' | 'className' | 'tabIndex'>> & {
    items: HTMLEMenuItemTemplateDescription[],
}

interface HTMLEMenubarTemplate {
    (desc: HTMLEMenubarTemplateDescription): HTMLEMenuBarElement;
}

const HTMLEMenubarTemplate: HTMLEMenubarTemplate = (desc: HTMLEMenubarTemplateDescription) => {
    
    const items = desc.items.map((itemDesc) => {
        return HTMLEMenuItemTemplate(itemDesc);
    });

    return HTMLElementConstructor(
        "e-menubar", {
            props: {
                id: desc.id,
                className: desc.className,
                tabIndex: desc.tabIndex
            },
            children: items
        }
    );
}