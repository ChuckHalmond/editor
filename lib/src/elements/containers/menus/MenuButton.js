var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuButtonElement };
let HTMLEMenuButtonElementBase = class HTMLEMenuButtonElementBase extends HTMLElement {
    name;
    disabled;
    expanded;
    #menu;
    shadowRoot;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: inline-block;
                            user-select: none;
                            white-space: nowrap;
                            cursor: pointer;
                        }
        
                        :host([disabled]) {
                            color: lightgray;
                        }
        
                        ::slotted([slot="menu"]) {
                            z-index: 1;
                            position: absolute;
                            color: initial;
                        }
                        
                        :host(:not([expanded])) ::slotted([slot="menu"]) {
                            opacity: 0;
                            pointer-events: none;
                        }
                        
                        [part="content"] {
                            display: flex;
                            width: 18px;
                            height: 18px;
                            text-align: center;
                        }
        
                        [part="content"]::after {
                            display: flex;
                            content: "";
                            width: 18px;
                            height: 18px;
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
            part: ["content"]
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
        this.addEventListener("keydown", this);
        this.addEventListener("click", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
        this.addEventListener("trigger", this);
    }
    handleEvent(event) {
        const { type: eventType, target: eventTarget } = event;
        let { expanded } = this;
        switch (eventType) {
            case "slotchange":
                const element = eventTarget.assignedElements()[0];
                this.#menu = (element instanceof HTMLEMenuElement) ? element : null;
                break;
            case "click":
                if (eventTarget === this) {
                    this.toggle();
                }
                break;
            case "focusin":
                if (eventTarget !== this) {
                    this.toggle(true);
                }
                break;
            case "focusout":
                const lostFocusWithin = !this.contains(event.relatedTarget);
                if (lostFocusWithin) {
                    this.toggle(false);
                }
                break;
            case "keydown":
                switch (event.key) {
                    case "ArrowDown":
                        this.focusMenu(true);
                        event.stopPropagation();
                        break;
                    case "Enter":
                        if (!expanded) {
                            this.focusMenu(true);
                            event.stopPropagation();
                        }
                        break;
                    case "Escape":
                        if (expanded) {
                            this.toggle(false);
                            this.focus({ preventScroll: true });
                            event.stopPropagation();
                        }
                        break;
                }
                break;
        }
    }
    focusMenu(firstItem) {
        const { menu } = this;
        if (menu) {
            if (firstItem) {
                menu.focusGroup(0);
            }
            else {
                menu.focus({ preventScroll: true });
            }
        }
    }
    toggle(force) {
        const expand = force ?? !this.expanded;
        this.expanded = expand;
        if (expand) {
            this.#positionMenu();
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
            const overflowX = itemRight + menuWidth - clientWidth;
            const overflowY = itemTop + menuHeight - clientHeight;
            menuStyle.setProperty("left", `${overflowX > 0 ?
                scrollX + itemLeft - menuWidth :
                scrollX + itemLeft}px`);
            menuStyle.setProperty("top", `${overflowY > 0 ?
                scrollY + itemTop - menuHeight :
                scrollY + itemBottom}px`);
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuButtonElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuButtonElementBase.prototype, "disabled", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEMenuButtonElementBase.prototype, "expanded", void 0);
HTMLEMenuButtonElementBase = __decorate([
    CustomElement({
        name: "e-menubutton"
    })
], HTMLEMenuButtonElementBase);
var HTMLEMenuButtonElement = HTMLEMenuButtonElementBase;
//# sourceMappingURL=MenuButton.js.map