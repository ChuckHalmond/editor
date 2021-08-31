import { HTMLElementConstructor } from "src/editor/elements/HTMLElement";
import { HTMLEMenuBarElement } from "src/editor/elements/lib/containers/menus/MenuBar";
import { HTMLEMenuItemTemplate, HTMLEMenuItemTemplateDescription } from "./MenuItemTemplate";

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