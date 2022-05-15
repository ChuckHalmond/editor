var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AttributeProperty, CustomElement } from "../../Element";
import { HTMLEMenuElement } from "./Menu";
export { HTMLEContextMenuElement };
let HTMLEContextMenuElementBase = class HTMLEContextMenuElementBase extends HTMLEMenuElement {
    clientX;
    clientY;
    constructor() {
        super();
        this.addEventListener("trigger", this.#handleTrigger.bind(this));
        this.addEventListener("focusout", this.#handleFocusOut.bind(this));
        this.addEventListener("keydown", this.#handleKeyDown.bind(this));
    }
    connectedCallback() {
        this.#position();
    }
    close() {
        this.dispatchEvent(new Event("close", { bubbles: true }));
        this.remove();
    }
    #position() {
        const { clientX, clientY } = this;
        const { style } = this;
        const { width: menuWidth, height: menuHeight } = this.getBoundingClientRect();
        const { scrollX, scrollY } = window;
        const left = clientX + scrollX;
        const top = clientY + scrollY;
        const { clientWidth, clientHeight } = document.body;
        const overflowX = left + menuWidth - clientWidth;
        const overflowY = top + menuHeight - clientHeight;
        style.setProperty("left", `${overflowX > 0 ? left - menuWidth : left}px`);
        style.setProperty("top", `${overflowY > 0 ? top - menuHeight : top}px`);
    }
    #handleTrigger() {
        this.close();
    }
    #handleFocusOut(event) {
        const { relatedTarget } = event;
        const lostFocusWithin = !this.contains(relatedTarget);
        if (lostFocusWithin) {
            this.close();
        }
    }
    #handleKeyDown(event) {
        const { key } = event;
        switch (key) {
            case "Escape":
                this.close();
                event.stopPropagation();
                break;
        }
    }
};
__decorate([
    AttributeProperty({ type: Number, defaultValue: 0 })
], HTMLEContextMenuElementBase.prototype, "clientX", void 0);
__decorate([
    AttributeProperty({ type: Number, defaultValue: 0 })
], HTMLEContextMenuElementBase.prototype, "clientY", void 0);
HTMLEContextMenuElementBase = __decorate([
    CustomElement({
        name: "e-contextmenu"
    })
], HTMLEContextMenuElementBase);
var HTMLEContextMenuElement = HTMLEContextMenuElementBase;
//# sourceMappingURL=ContextMenu.js.map