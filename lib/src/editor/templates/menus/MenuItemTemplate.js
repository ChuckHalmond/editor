import { HTMLElementConstructor } from "src/editor/elements/HTMLElement";
import { HotKey } from "src/editor/Input";
import { HTMLEMenuTemplate } from "./MenuTemplate";
export { HTMLEMenuItemTemplate };
const HTMLEMenuItemTemplate = (desc) => {
    let slotted = [];
    if (desc.menu) {
        let menu = HTMLEMenuTemplate(desc.menu);
        menu.slot = "menu";
        slotted.push(menu);
    }
    const menuItem = HTMLElementConstructor("e-menuitem", {
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
    });
    return menuItem;
};
//# sourceMappingURL=MenuItemTemplate.js.map