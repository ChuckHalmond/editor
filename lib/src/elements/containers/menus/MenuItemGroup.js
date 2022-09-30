var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { element, CustomElement, AttributeProperty } from "../../Element";
import { EMenuItem } from "./MenuItem";
export { HTMLEMenuItemGroupElement };
export { EMenuItemGroup };
var shadowTemplate;
let HTMLEMenuItemGroupElementBase = class HTMLEMenuItemGroupElementBase extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        const internals = this.attachInternals();
        internals.role = "group";
        this.internals = internals;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        const { internals } = this;
        switch (name) {
            case "label":
                internals.ariaLabel = newValue;
                break;
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("span", {
        attributes: {
            part: "label"
        }
    }), element("slot"));
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEMenuItemGroupElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEMenuItemGroupElementBase.prototype, "label", void 0);
HTMLEMenuItemGroupElementBase = __decorate([
    CustomElement({
        name: "e-menuitemgroup"
    })
], HTMLEMenuItemGroupElementBase);
var HTMLEMenuItemGroupElement = HTMLEMenuItemGroupElementBase;
var EMenuItemGroup = Object.assign(function (init) {
    const { name, items } = init;
    return element("e-menuitemgroup", {
        attributes: {
            name: name
        },
        children: items
    });
}, {
    prototype: HTMLEMenuItemGroupElement.prototype,
    radios: (init) => {
        const { name, items } = init;
        return element("e-menuitemgroup", {
            attributes: {
                name: name
            },
            children: items.map(({ label, value }) => new EMenuItem({ name, label, type: "radio", value }))
        });
    }
});
//# sourceMappingURL=MenuItemGroup.js.map