var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEActionElement } from "../actions/Action";
import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuItemElement };
export { MenuItem };
let HTMLEMenuItemElementBase = class HTMLEMenuItemElementBase extends HTMLEActionElement {
    label;
    index;
    expanded;
    type;
    #menu;
    shadowRoot;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: flex;
                            user-select: none;
                            white-space: nowrap;
                            padding: 2px 12px;
                        }

                        :host([type="menu"]) {
                            padding: 2px 10px;
                        }
        
                        :host(:focus-within) {
                            color: black;
                            background-color: lightgray;
                        }
        
                        :host([disabled]) {
                            color: dimgray;
                        }
                        
                        :host([type="submenu"]) ::slotted([slot="menu"]),
                        :host([type="menu"]) ::slotted([slot="menu"]) {
                            z-index: 1;
                            position: absolute;
                            color: initial;
                        }

                        :host([type="menu"]:not([expanded])) ::slotted([slot="menu"]),
                        :host([type="submenu"]:not([expanded])) ::slotted([slot="menu"]) {
                            opacity: 0;
                            pointer-events: none;
                        }
        
                        [part="content"] {
                            flex: auto;
                            display: flex;
                            height: 20px;
                            pointer-events: none;
                        }
        
                        [part="label"] {
                            flex: auto;
                            line-height: 18px;
                        }

                        :host::before {
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            margin: 1px;
                            margin-right: 8px;
                        }

                        :host([type="submenu"])::before {
                            content: "";
                        }

                        :host(:not([type]))::before,
                        :host([type="button"])::before,
                        :host([type="radio"])::before,
                        :host([type="checkbox"])::before {
                            content: "";
                            background-color: var(--icon-mask-color, none);
                            -webkit-mask-image: var(--icon-mask-image, none);
                            mask-image: var(--icon-mask-image, none);
                        }

                        :host([hotkey])::after {
                            display: inline-block;
                            flex: none;
                            content: attr(hotkey);
                            text-align: right;
                            margin-left: 16px;
                        }
                        
                        :host([type="submenu"]) [part="content"]::after {
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            margin: 1px;
                            margin-left: 8px;
                            text-align: center;

                            content: var(--arrow-content, "");
                            color: var(--arrow-color, unset);
                            background-color: var(--arrow-mask-color, none);
                            -webkit-mask-image: var(--arrow-mask-image, none);
                            mask-image: var(--arrow-mask-image, none);
                        }
                    `
            }
        }), HTML("span", {
            part: ["content"],
            children: [
                HTML("span", {
                    part: ["label"]
                })
            ]
        }), HTML("slot", {
            properties: {
                name: "menu"
            }
        }));
        this.#menu = null;
    }
    get menu() {
        return this.#menu;
    }
    connectedCallback() {
        this.shadowRoot.addEventListener("slotchange", this);
        this.addEventListener("click", this);
    }
    handleEvent(event) {
        const { type: eventType, target: eventTarget } = event;
        const { type } = this;
        switch (eventType) {
            case "slotchange": {
                const element = eventTarget.assignedElements()[0];
                this.#menu = (element instanceof HTMLEMenuElement) ? element : null;
                break;
            }
            case "click": {
                if (eventTarget === this) {
                    switch (type) {
                        case "menu":
                        case "submenu": {
                            this.toggle();
                            break;
                        }
                        default: {
                            this.trigger();
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    {
                        const labelPart = this.shadowRoot.querySelector("[part='label']");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
            }
        }
    }
    focusMenu(options) {
        switch (this.type) {
            case "menu":
            case "submenu": {
                const { menu } = this;
                if (menu) {
                    menu.focusGroup(0, options);
                }
                break;
            }
        }
    }
    toggle(force) {
        const { type } = this;
        switch (type) {
            case "menu":
            case "submenu": {
                const { expanded } = this;
                const expand = force ?? !expanded;
                this.expanded = expand;
                if (expand) {
                    this.#positionMenu();
                }
                break;
            }
        }
    }
    #positionMenu() {
        const { menu } = this;
        if (menu) {
            const { style: menuStyle } = menu;
            const { top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight } = this.getBoundingClientRect();
            const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect();
            const { scrollY, scrollX } = window;
            const { clientWidth, clientHeight } = document.body;
            const { type } = this;
            if (type === "menu") {
                const overflowX = itemRight + menuWidth - clientWidth;
                const overflowY = itemTop + menuHeight - clientHeight;
                menuStyle.setProperty("left", `${overflowX > 0 ?
                    scrollX + itemLeft - menuWidth :
                    scrollX + itemLeft}px`);
                menuStyle.setProperty("top", `${overflowY > 0 ?
                    scrollY + itemTop - menuHeight :
                    scrollY + itemBottom}px`);
            }
            else {
                const closestMenu = this.closest("e-menu");
                if (closestMenu) {
                    const { top: closestMenuTop, left: closestMenuLeft } = closestMenu.getBoundingClientRect();
                    const overflowX = itemRight + menuWidth - clientWidth;
                    const overflowY = itemTop + menuHeight - clientHeight;
                    menuStyle.setProperty("left", `${overflowX > 0 ?
                        itemLeft - menuWidth - closestMenuLeft :
                        itemRight - closestMenuLeft}px`);
                    const menuComputedStyle = window.getComputedStyle(menu);
                    const { paddingTop, paddingBottom } = menuComputedStyle;
                    const menuPaddingTop = parseFloat(paddingTop);
                    const menuPaddingBottom = parseFloat(paddingBottom);
                    menuStyle.setProperty("top", `${overflowY > 0 ?
                        itemBottom - menuHeight - closestMenuTop + menuPaddingBottom :
                        itemTop - closestMenuTop - menuPaddingTop}px`);
                }
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEMenuItemElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: Number })
], HTMLEMenuItemElementBase.prototype, "index", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuItemElementBase.prototype, "expanded", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "button" })
], HTMLEMenuItemElementBase.prototype, "type", void 0);
HTMLEMenuItemElementBase = __decorate([
    CustomElement({
        name: "e-menuitem"
    })
], HTMLEMenuItemElementBase);
var HTMLEMenuItemElement = HTMLEMenuItemElementBase;
var MenuItem = Object.assign(function (init) {
    const { label, name, trigger } = init;
    return HTML("e-menuitem", {
        properties: {
            tabIndex: -1,
            label: label,
            name: name,
        },
        eventListeners: {
            trigger: trigger
        }
    });
}, {
    prototype: HTMLEMenuItemElement.prototype
});
//# sourceMappingURL=MenuItem.js.map