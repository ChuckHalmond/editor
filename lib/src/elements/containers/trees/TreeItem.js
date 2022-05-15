var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, HTML, AttributeProperty } from "../../Element";
import { HTMLEContextMenuElement } from "../menus/ContextMenu";
import { HTMLEToolbarElement } from "../toolbars/ToolBar";
import { HTMLETreeElement } from "./Tree";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";
export { HTMLETreeItemElement };
let HTMLETreeItemElementBase = class HTMLETreeItemElementBase extends HTMLElement {
    name;
    index;
    label;
    expanded;
    droptarget;
    active;
    selected;
    level;
    type;
    #group;
    #toolbar;
    #badge;
    #contextmenu;
    shadowRoot;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(HTML("style", {
            properties: {
                textContent: /*css*/ `
                        :host {
                            display: block;
                            user-select: none;
                        }

                        :host(:focus-visible) {
                            outline: none;
                        }
                        
                        :host([droptarget]) {
                            background-color: gainsboro;
                        }
                        
                        [part="content"]:hover {
                            background-color: whitesmoke;
                        }

                        :host([active]) [part="content"] {
                            background-color: whitesmoke;
                            outline: 1px solid black;
                            outline-offset: -1px;
                        }

                        :host([selected]) [part="content"] {
                            background-color: gainsboro;
                        }

                        [part="content"] {
                            display: flex;
                            height: 20px;
                            padding-left: calc(var(--level) * var(--indent-width, 12px));
                        }
                        
                        [part="label"] {
                            order: 0;
                            margin-right: auto;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            pointer-events: none;
                        }

                        ::slotted([slot="toolbar"]) {
                            order: 1;
                        }

                        ::slotted([slot="badge"]) {
                            order: 2;
                            pointer-events: none;
                        }

                        ::slotted([slot="contextmenu"]) {
                            position: absolute;
                        }
                        
                        :host(:not([type="parent"])) ::slotted([slot="group"]),
                        :host(:not([expanded])) ::slotted([slot="group"]) {
                            display: none;
                        }

                        :host(:not([type="parent"])) [part="content"]::before {
                            visibility: hidden;
                        }

                        [part="content"]::before {
                            display: inline-block;
                            text-align: center;
                            width: 18px;
                            height: 18px;
                            margin: 1px;
                            margin-right: 8px;
                        }
                        
                        :host(:not([expanded])) [part="content"]::before {
                            content: var(--collapsed-symbol);
                        }
                        
                        :host([expanded]) [part="content"]::before {
                            content: var(--expanded-symbol);
                        }
                    `
            }
        }), HTML("div", {
            part: ["content"],
            children: [
                HTML("span", {
                    part: ["label"]
                }),
                HTML("slot", {
                    properties: {
                        name: "toolbar"
                    }
                }),
                HTML("slot", {
                    properties: {
                        name: "badge"
                    }
                })
            ]
        }), HTML("slot", {
            properties: {
                name: "group"
            }
        }), HTML("slot", {
            properties: {
                name: "contextmenu"
            }
        }));
        this.#group = null;
        this.#toolbar = null;
        this.#badge = null;
        this.#contextmenu = null;
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }
    get group() {
        return this.#group;
    }
    get badge() {
        return this.#badge;
    }
    get toolbar() {
        return this.#toolbar;
    }
    get contextmenu() {
        return this.#contextmenu;
    }
    connectedCallback() {
        this.level = (() => {
            let level = 0;
            let item = this;
            let { parentElement } = item;
            while (parentElement instanceof HTMLETreeItemGroupElement) {
                level++;
                ({ parentElement } = parentElement);
                if (!(parentElement instanceof HTMLETreeItemElement)) {
                    return level;
                }
                ({ parentElement } = parentElement);
            }
            if (parentElement instanceof HTMLETreeElement) {
                level++;
            }
            return level;
        })();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "expanded": {
                this.dispatchEvent(new Event("toggle", { bubbles: true }));
                break;
            }
            case "selected": {
                this.dispatchEvent(new Event("select", { bubbles: true }));
                break;
            }
            case "label": {
                const { shadowRoot } = this;
                const labelPart = shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "level": {
                this.#updateLevelVariable();
                break;
            }
        }
    }
    toggle(force) {
        this.expanded = force ?? !this.expanded;
    }
    #updateLevelVariable() {
        this.style.setProperty("--level", `${this.level}`);
    }
    #handleClickEvent(event) {
        const { target, shiftKey, ctrlKey } = event;
        const { type } = this;
        if (this === target && type === "parent" && !(shiftKey || ctrlKey)) {
            this.toggle();
        }
    }
    #handleSlotChangeEvent(event) {
        const { target } = event;
        const { name: slotName } = target;
        switch (slotName) {
            case "group": {
                const element = target.assignedElements()[0];
                this.#group = (element instanceof HTMLETreeItemGroupElement) ? element : null;
                break;
            }
            case "toolbar": {
                const element = target.assignedElements()[0];
                this.#toolbar = (element instanceof HTMLEToolbarElement) ? element : null;
                break;
            }
            case "badge": {
                const element = target.assignedElements()[0];
                this.#badge = (element instanceof HTMLSpanElement) ? element : null;
                break;
            }
            case "contextmenu": {
                const element = target.assignedElements()[0];
                this.#contextmenu = (element instanceof HTMLEContextMenuElement) ? element : null;
                break;
            }
        }
    }
};
__decorate([
    AttributeProperty({ type: String })
], HTMLETreeItemElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Number })
], HTMLETreeItemElementBase.prototype, "index", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLETreeItemElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLETreeItemElementBase.prototype, "expanded", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLETreeItemElementBase.prototype, "droptarget", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLETreeItemElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLETreeItemElementBase.prototype, "selected", void 0);
__decorate([
    AttributeProperty({ type: Number, observed: true })
], HTMLETreeItemElementBase.prototype, "level", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "leaf" })
], HTMLETreeItemElementBase.prototype, "type", void 0);
HTMLETreeItemElementBase = __decorate([
    CustomElement({
        name: "e-treeitem"
    })
], HTMLETreeItemElementBase);
var HTMLETreeItemElement = HTMLETreeItemElementBase;
//# sourceMappingURL=TreeItem.js.map