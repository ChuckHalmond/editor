var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, bindShadowRoot, isTagElement } from "src/editor/elements/HTMLElement";
let HTMLEDropzoneInputElementBase = class HTMLEDropzoneInputElementBase extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*html*/ `
            <style>
                :host {
                    display: block;
                }

                [part~="container"] {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                }
                
                ::slotted(e-dropzone) {
                    flex: auto;
                }

                ::slotted(input) {
                    position: absolute;
                    flex: none;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    opacity: 0;
                    pointer-events: none;
                }
            </style>
            <div part="container">
                <slot name="input"></slot>
                <slot name="dropzone"></slot>
            </div>
            `);
        this.dropzone = null;
        this.input = null;
        this.converter = (dropzone) => dropzone.type;
    }
    connectedCallback() {
        var _a, _b;
        this.tabIndex = this.tabIndex;
        this.addEventListener("datachange", (event) => {
            let target = event.target;
            if (target == this.dropzone && this.dropzone && this.input && this.converter) {
                this.input.value = this.converter(this.dropzone);
            }
        });
        const dropzoneSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name='dropzone']");
        if (dropzoneSlot) {
            dropzoneSlot.addEventListener("slotchange", () => {
                const dropzone = dropzoneSlot.assignedElements().filter(elem => isTagElement("e-dropzone", elem));
                if (dropzone.length > 0) {
                    this.dropzone = dropzone[0];
                }
            });
        }
        const inputSlot = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("slot[name='input']");
        if (inputSlot) {
            inputSlot.addEventListener("slotchange", () => {
                const input = inputSlot.assignedElements().filter(elem => isTagElement("input", elem));
                if (input.length > 0) {
                    this.input = input[0];
                }
            });
        }
    }
};
HTMLEDropzoneInputElementBase = __decorate([
    RegisterCustomHTMLElement({
        name: "e-dropzoneinput"
    })
], HTMLEDropzoneInputElementBase);
//# sourceMappingURL=DropzoneInput.js.map