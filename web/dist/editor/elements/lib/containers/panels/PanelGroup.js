var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PanelGroupElement = void 0;
    let PanelGroupElement = class PanelGroupElement extends HTMLElement {
        constructor() {
            super();
            (0, HTMLElement_1.bindShadowRoot)(this, /*template*/ `
            <link rel="stylesheet" href="css/theme.css"/>
            <style>
                :host {
                    display: block;
                }

                :host([state='closed']) #content {
                    display: none;
                }

                :host([state='closed']) #less {
                    display: none;
                }

                :host([state='opened']) #more {
                    display: none;
                }

                #toggler {
                    display: flex;
                }

                #toggler:hover {
                    font-weight: 500;
                    color: var(--label-on-hover-color);
                }

                #label {
                    flex: 1;
                }
            </style>
            <div>
                <div id="toggler">
                    <span id="arrow"><!--<icon #less><icon #more>--></span>
                    <span id="label"></span>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);
            this.state = this.state || 'closed';
        }
        connectedCallback() {
            const toggler = this.shadowRoot.querySelector('#toggler');
            const arrow = this.shadowRoot.querySelector('#arrow');
            const label = this.shadowRoot.querySelector('#label');
            toggler.addEventListener('click', () => {
                if (this.state === 'opened') {
                    this.state = 'closed';
                }
                else if (this.state === 'closed') {
                    this.state = 'opened';
                }
            });
            label.innerHTML = this.label;
        }
    };
    PanelGroupElement.observedAttributes = ['state'];
    PanelGroupElement = __decorate([
        (0, HTMLElement_1.RegisterCustomHTMLElement)({
            name: 'e-panel-group'
        }),
        (0, HTMLElement_1.GenerateAttributeAccessors)([
            { name: 'label', type: 'string' },
            { name: 'state', type: 'string' },
        ])
    ], PanelGroupElement);
    exports.PanelGroupElement = PanelGroupElement;
});
//# sourceMappingURL=PanelGroup.js.map