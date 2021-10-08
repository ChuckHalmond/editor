var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterCustomHTMLElement, bindShadowRoot, isTagElement } from "../../HTMLElement";
export { BaseHTMLETabListElement };
let BaseHTMLETabListElement = class BaseHTMLETabListElement extends HTMLElement {
    constructor() {
        super();
        bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    position: relative;
                }
            </style>
            <slot></slot>
        `);
        this.tabs = [];
        this._activeIndex = 1;
    }
    get activeIndex() {
        return this._activeIndex;
    }
    get activeTab() {
        return this.tabs[this._activeIndex] || null;
    }
    connectedCallback() {
        this.tabIndex = this.tabIndex;
        const slot = this.shadowRoot.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", (event) => {
                const tabs = event.target
                    .assignedElements()
                    .filter(tab => isTagElement("e-tab", tab));
                this.tabs = tabs;
                this._activeIndex = this.tabs.findIndex(tab => tab.active);
            });
        }
        this.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.focusTabAt((this.activeIndex <= 0) ? this.tabs.length - 1 : this.activeIndex - 1);
                    event.stopPropagation();
                    break;
                case "ArrowDown":
                    this.focusTabAt((this.activeIndex >= this.tabs.length - 1) ? 0 : this.activeIndex + 1);
                    event.stopPropagation();
                    break;
                case "Enter":
                    if (this.activeTab) {
                        this.activateTab(this.activeTab);
                    }
                    break;
            }
        });
        this.addEventListener("click", (event) => {
            const target = event.target;
            if (isTagElement("e-tab", target)) {
                target.active = true;
            }
        });
        this.addEventListener("e_tabchange", (event) => {
            const targetIndex = this.tabs.indexOf(event.detail.tab);
            this._activeIndex = targetIndex;
            this.tabs.forEach((thisTab, thisTabIndex) => {
                if (thisTabIndex !== targetIndex) {
                    thisTab.active = false;
                }
            });
        });
    }
    focusTabAt(index) {
        const tab = this.tabs[index];
        if (tab) {
            this._activeIndex = index;
            tab.focus();
        }
    }
    findTab(predicate) {
        return this.tabs.find(predicate) || null;
    }
    activateTab(tab) {
        if (this.tabs.includes(tab)) {
            tab.active = true;
        }
    }
};
BaseHTMLETabListElement = __decorate([
    RegisterCustomHTMLElement({
        name: "e-tablist"
    })
], BaseHTMLETabListElement);
//# sourceMappingURL=TabList.js.map