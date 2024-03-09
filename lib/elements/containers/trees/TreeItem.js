var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, element, AttributeProperty, QueryProperty } from "../../Element";
export { HTMLETreeItemElement };
import stylesheet from "../../../../css/elements/containers/trees/treeitem.css" assert { type: 'css' };
import { theme } from "../../../stylesheets/Theme";
var shadowTemplate;
var style;
let HTMLETreeItemElementBase = class HTMLETreeItemElementBase extends HTMLElement {
    static {
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
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [theme.stylesheet, ...Array.from(stylesheet).map((item) => {
                const [count, source] = item;
                const stylesheet = new CSSStyleSheet();
                stylesheet.replace(source);
                return stylesheet;
            })];
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
                this.shadowRoot.adoptedStyleSheets[0].cssRules[6].styleMap.set("padding-left", `${12 * Number(newValue)}px`);
                break;
            }
        }
    }
    toggle(force) {
        const { expanded } = this;
        this.expanded = force ?? !expanded;
    }
};
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