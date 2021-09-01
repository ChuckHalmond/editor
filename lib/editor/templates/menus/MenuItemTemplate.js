define(["require", "exports", "src/editor/elements/HTMLElement", "src/editor/Input", "./MenuTemplate"], function (require, exports, HTMLElement_1, Input_1, MenuTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemTemplate = void 0;
    const HTMLEMenuItemTemplate = (desc) => {
        let slotted = [];
        if (desc.menu) {
            let menu = (0, MenuTemplate_1.HTMLEMenuTemplate)(desc.menu);
            menu.slot = "menu";
            slotted.push(menu);
        }
        const menuItem = (0, HTMLElement_1.HTMLElementConstructor)("e-menuitem", {
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
                hotkey: desc.hotkey ? new Input_1.HotKey(desc.hotkey.key, desc.hotkey.mod1, desc.hotkey.mod2) : void 0
            },
            children: [
                ...slotted
            ]
        });
        return menuItem;
    };
    exports.HTMLEMenuItemTemplate = HTMLEMenuItemTemplate;
});
//# sourceMappingURL=MenuItemTemplate.js.map