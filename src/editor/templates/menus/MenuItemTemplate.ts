import { HTMLElementConstructor } from "src/editor/elements/HTMLElement";
import { HTMLEMenuItemElement } from "src/editor/elements/lib/containers/menus/MenuItem";
import { Key, KeyModifier, HotKey } from "src/editor/Input";
import { HTMLEMenuTemplate, HTMLEMenuTemplateDescription } from "./MenuTemplate";

export { HTMLEMenuItemTemplateDescription };
export { HTMLEMenuItemTemplate };

type HTMLEMenuItemTemplateDescription = Pick<HTMLEMenuItemElement, 'name'> & Partial<Pick<HTMLEMenuItemElement, 'id' | 'className' | 'title' | 'type' | 'disabled'>> & {
    label?: string;
    icon?: string;
    command?: string;
    commandArgs?: any;
    hotkey?: {
        key: Key;
        mod1?: KeyModifier;
        mod2?: KeyModifier;
    },
    value?: string,
    checked?: boolean,
    statekey?: string,
    menu?: HTMLEMenuTemplateDescription;
    disabled?: boolean;
}

interface HTMLEMenuItemTemplate {
    (args: HTMLEMenuItemTemplateDescription): HTMLEMenuItemElement;
}

const HTMLEMenuItemTemplate: HTMLEMenuItemTemplate = (desc: HTMLEMenuItemTemplateDescription) => {
    let slotted: (Node | string)[] = [];

    if (desc.menu) {
        let menu = HTMLEMenuTemplate(desc.menu);
        menu.slot = "menu";
        slotted.push(menu);
    }

    const menuItem = HTMLElementConstructor(
        "e-menuitem", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name,
                title: desc.title,
                type: desc.type,
                label: desc.label,
                disabled: desc.disabled,
                icon: desc.icon,
                value: desc.value,
                checked: desc.checked,
                command: desc.command,
                commandArgs: desc.commandArgs,
                hotkey: desc.hotkey ? new HotKey(desc.hotkey.key, desc.hotkey.mod1, desc.hotkey.mod2) : void 0
            },
            children: [
                ...slotted
            ]
        }
    );

    return menuItem;
}