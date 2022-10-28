var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, element, AttributeProperty, QueryProperty } from "../../Element";
import { themeStylesheet } from "../../../web/Theme";
export { HTMLETreeItemElement };
var shadowTemplate;
var style;
let HTMLETreeItemElementBase = class HTMLETreeItemElementBase extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet, themeStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
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
                const labelPart = this.shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "level": {
                this.style.setProperty("--level", `${this.level}`);
                break;
            }
        }
    }
    toggle(force) {
        const { expanded } = this;
        this.expanded = force ?? !expanded;
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("div", {
        attributes: {
            part: "content"
        },
        children: [
            element("span", {
                attributes: {
                    part: "arrow"
                }
            }),
            element("slot")
        ]
    }), element("slot", {
        attributes: {
            name: "group"
        }
    }));
    style = /*css*/ `
            :host {
                display: block;
                user-select: none;
            }
            
            :host([droptarget]) {
                background-color: var(--droptarget-item-color);
            }
            
            :host([active]:focus-visible) {
                outline: none;
            }
            
            :host([active]:is(:focus, :not(:focus-within))):host-context(e-tree:focus-within) [part="content"] {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
            
            [part="content"]:hover {
                background-color: var(--hovered-item-color);
            }
            
            :host([selected]) [part="content"] {
                background-color: var(--selected-item-color);
            }
            
            [part="content"] {
                display: flex;
                line-height: 22px;
                padding-left: calc(var(--level) * var(--indent-width, 12px));
            }
            
            :host(:not([type="parent"])) ::slotted([slot="group"]),
            :host(:not([expanded])) ::slotted([slot="group"]) {
                display: none;
            }
            
            :host(:not([type="parent"])) [part="arrow"]::before {
                visibility: hidden;
            }
            
            [part="arrow"] {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px 4px 1px 1px;
            }
            
            [part="arrow"]::before {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;
                background-color: var(--arrow-color, none);
                filter: var(--arrow-filter, none);
            }
            
            :host(:not([expanded])) [part="arrow"]::before {
                -webkit-mask-image: var(--arrow-icon-collapsed, none);
                mask-image: var(--arrow-icon-collapsed, none);
            }
            
            :host([expanded]) [part="arrow"]::before {
                -webkit-mask-image: var(--arrow-icon-expanded, none);
                mask-image: var(--arrow-icon-expanded, none);
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLETreeItemElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: Number })
], HTMLETreeItemElementBase.prototype, "posinset", void 0);
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
__decorate([
    QueryProperty({ selector: ":scope > e-treeitemgroup[slot=group]" })
], HTMLETreeItemElementBase.prototype, "group", void 0);
HTMLETreeItemElementBase = __decorate([
    CustomElement({
        name: "e-treeitem"
    })
], HTMLETreeItemElementBase);
var HTMLETreeItemElement = HTMLETreeItemElementBase;
//# sourceMappingURL=TreeItem.js.map