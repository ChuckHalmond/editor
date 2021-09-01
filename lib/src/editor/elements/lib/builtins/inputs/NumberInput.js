var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { GenerateAttributeAccessors, RegisterCustomHTMLElement } from "editor/elements/HTMLElement";
export { NumberInputElement };
let NumberInputElement = class NumberInputElement extends HTMLInputElement {
    constructor() {
        super();
        this.addEventListener('input', (event) => {
            if (this.value !== '') {
                if (this.isValueValid(this.value)) {
                    this.cache = this.value;
                }
                else {
                    this.value = this.cache;
                }
            }
        }, { capture: true });
        this.addEventListener('focusin', (event) => {
            this.select();
        }, { capture: true });
        this.addEventListener('focusout', (event) => {
            this.value = this.cache = this.parseValue(this.value);
        }, { capture: true });
    }
    isValueValid(value) {
        let match = value.match(/([+-]?[0-9]*([.][0-9]*)?)|([+-]?[.][0-9]*)/);
        return (match !== null && match[1] === value);
    }
    parseValue(value) {
        let parsedValue = parseFloat(value);
        return Number.isNaN(parsedValue) ? '0' : parsedValue.toString();
    }
    connectedCallback() {
        this.cache = this.value = this.parseValue(this.value);
    }
};
NumberInputElement = __decorate([
    RegisterCustomHTMLElement({
        name: 'number-input',
        options: {
            extends: 'input'
        }
    }),
    GenerateAttributeAccessors([
        { name: 'cache' }
    ])
], NumberInputElement);
//# sourceMappingURL=NumberInput.js.map