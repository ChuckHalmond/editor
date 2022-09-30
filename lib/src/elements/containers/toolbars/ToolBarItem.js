var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
export { HTMLEToolBarItemElement };
export { EToolBarItem };
var shadowTemplate;
var iconPart;
let HTMLEToolBarItemElementBase = class HTMLEToolBarItemElementBase extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "label": {
                //...
                break;
            }
            case "iconed": {
                const { shadowRoot } = this;
                if (newValue !== null) {
                    shadowRoot.prepend(iconPart.cloneNode(true));
                }
                else {
                    const iconPart = shadowRoot.querySelector("[part=icon]");
                    if (iconPart) {
                        iconPart.remove();
                    }
                }
                break;
            }
        }
    }
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"), element("slot", {
        attributes: {
            name: "select"
        }
    }), element("slot", {
        attributes: {
            name: "menubutton"
        }
    }));
    iconPart = element("span", {
        attributes: {
            part: "icon"
        }
    });
})();
__decorate([
    QueryProperty({ selector: ":scope > e-menubutton[slot=menubutton]" })
], HTMLEToolBarItemElementBase.prototype, "menubutton", void 0);
__decorate([
    QueryProperty({ selector: ":scope > e-select[slot=select]" })
], HTMLEToolBarItemElementBase.prototype, "select", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEToolBarItemElementBase.prototype, "active", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEToolBarItemElementBase.prototype, "pressed", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEToolBarItemElementBase.prototype, "expanded", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], HTMLEToolBarItemElementBase.prototype, "iconed", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEToolBarItemElementBase.prototype, "value", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarItemElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, observed: true })
], HTMLEToolBarItemElementBase.prototype, "label", void 0);
__decorate([
    AttributeProperty({ type: String })
], HTMLEToolBarItemElementBase.prototype, "type", void 0);
HTMLEToolBarItemElementBase = __decorate([
    CustomElement({
        name: "e-toolbaritem"
    })
], HTMLEToolBarItemElementBase);
var HTMLEToolBarItemElement = HTMLEToolBarItemElementBase;
var EToolBarItem = Object.assign(function (init) {
    const { label, name, type, value, trigger, menubutton, select } = init;
    if (menubutton) {
        menubutton.slot = "menubutton";
    }
    if (select) {
        select.slot = "select";
    }
    return element("e-toolbaritem", {
        attributes: {
            tabindex: -1,
            title: label,
            name: name,
            value: value,
            type: type
        },
        children: menubutton ? [menubutton] : select ? [select] : undefined,
        listeners: {
            click: trigger
        }
    });
}, {
    prototype: HTMLEToolBarItemElement.prototype,
    button(init) {
        return new EToolBarItem({
            ...init, type: "button"
        });
    },
    checkbox(init) {
        return new EToolBarItem({
            ...init, type: "checkbox"
        });
    },
    radio(init) {
        return new EToolBarItem({
            ...init, type: "radio"
        });
    },
    menubutton(init) {
        return new EToolBarItem({
            ...init, type: "menubutton"
        });
    },
    select(init) {
        return new EToolBarItem({
            ...init, type: "select"
        });
    },
});
//# sourceMappingURL=ToolBarItem.js.map