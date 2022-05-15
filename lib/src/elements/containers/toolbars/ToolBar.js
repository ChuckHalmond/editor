var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEToolBarItemGroupElement } from "./ToolBarItemGroup";
export { HTMLEToolbarElement };
let HTMLEToolbarElementBase = class HTMLEToolbarElementBase extends HTMLElement {
    name;
    shadowRoot;
    #groups;
    #activeIndex;
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(HTML("style", {
            properties: {
                innerText: /*css*/ `
                        :host {
                            display: flex;
                            flex-direction: row;
                        }
                    `
            }
        }), HTML("slot"));
        this.#groups = [];
        this.#activeIndex = -1;
    }
    get groups() {
        return this.#groups;
    }
    get activeIndex() {
        return this.#activeIndex;
    }
    get activeGroup() {
        return this.groups[this.activeIndex] || null;
    }
    connectedCallback() {
        this.shadowRoot.addEventListener("slotchange", this);
        this.addEventListener("focus", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
        this.addEventListener("keydown", this);
    }
    handleEvent(event) {
        const { type, target } = event;
        const { groups } = this;
        let { activeGroup } = this;
        switch (type) {
            case "slotchange":
                this.#groups = target
                    .assignedElements()
                    .filter(element_i => element_i instanceof HTMLEToolBarItemGroupElement);
                break;
            case "focusin":
                this.#activeIndex = groups.findIndex((item) => item.contains(target));
                break;
            case "focusout":
                const lostFocusWithin = !this.contains(event.relatedTarget);
                if (lostFocusWithin) {
                    this.reset();
                }
                break;
            case "keydown":
                const { activeIndex } = this;
                switch (event.key) {
                    case "ArrowLeft":
                        this.focusGroup((activeIndex === -1) ?
                            0 :
                            (activeIndex === 0) ?
                                groups.length - 1 :
                                activeIndex - 1);
                        if (activeGroup instanceof HTMLEToolBarItemGroupElement) {
                            activeGroup.focusItem(activeGroup.items.length - 1);
                        }
                        event.stopPropagation();
                        break;
                    case "ArrowRight":
                        this.focusGroup((activeIndex === -1) ?
                            groups.length - 1 :
                            (activeIndex === groups.length - 1) ?
                                0 :
                                activeIndex + 1);
                        if (activeGroup instanceof HTMLEToolBarItemGroupElement) {
                            activeGroup.focusItem(0);
                        }
                        event.stopPropagation();
                        break;
                    case "Enter":
                        if (activeGroup) {
                            activeGroup.click();
                        }
                        event.stopPropagation();
                        break;
                    case "Escape":
                        document.body.focus();
                        event.stopPropagation();
                        break;
                }
                break;
        }
    }
    focusGroup(index, options) {
        const { groups } = this;
        const group = groups[index];
        if (group) {
            const firstItem = options?.firstItem ?? false;
            if (firstItem) {
                group.focusItem(0);
            }
            else {
                group.focus({ preventScroll: true });
            }
        }
    }
    reset() {
        this.#activeIndex = -1;
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolbarElementBase.prototype, "name", void 0);
HTMLEToolbarElementBase = __decorate([
    CustomElement({
        name: "e-toolbar"
    })
], HTMLEToolbarElementBase);
var HTMLEToolbarElement = HTMLEToolbarElementBase;
//# sourceMappingURL=ToolBar.js.map