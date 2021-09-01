var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../HTMLElement";
export { PaletteElement };
let PaletteElement = class PaletteElement extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    content: contains;
                }

               :host #container {
                    display: grid;
                    grid-template-cols: repeat(5, 1fr);
                    grid-auto-rows: 16px;
                }
            </style>
            <div id="container">
            </div>
        `);
    }
    connectedCallback() {
        const colors = this.colors;
        if (colors.length > 0) {
            this.shadowRoot.querySelector('#container').append(...colors.map((color) => {
                const div = document.createElement('div');
                div.setAttribute('style', `background-color: ${color}`);
                return div;
            }));
        }
    }
};
PaletteElement = __decorate([
    RegisterCustomHTMLElement({
        name: 'e-palette'
    }),
    GenerateAttributeAccessors([{ name: 'colors', type: 'json' }])
], PaletteElement);
//# sourceMappingURL=Palette.js.map