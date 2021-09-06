import { RegisterCustomHTMLElement, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { HTMLETabElement } from "./Tab";

export { TabChangeEvent };
export { HTMLETabListElement };
export { BaseHTMLETabListElement };

interface HTMLETabListElement extends HTMLElement {
    readonly activeTab: HTMLETabElement | null;
    tabs: HTMLETabElement[];
}

type TabChangeEvent = CustomEvent<{
    tab: HTMLETabElement;
}>

@RegisterCustomHTMLElement({
    name: "e-tablist"
})
class BaseHTMLETabListElement extends HTMLElement implements HTMLETabListElement {

    public tabs: HTMLETabElement[];

    private _activeIndex: number;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
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

    public get activeIndex(): number {
        return this._activeIndex;
    }

    public get activeTab(): HTMLETabElement | null {
        return this.tabs[this._activeIndex] || null;
    }

    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;

        const slot = this.shadowRoot!.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", (event) => {
                const tabs = (event.target as HTMLSlotElement)
                    .assignedElements()
                    .filter(tab => isTagElement("e-tab", tab)) as HTMLETabElement[];
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
            let target = event.target as any;
            if (isTagElement("e-tab", target)) {
                target.active = true;
            }
        });

        this.addEventListener("tabchange", (event) => {
            let targetIndex = this.tabs.indexOf(event.detail.tab);
            this._activeIndex = targetIndex;
            this.tabs.forEach((thisTab, thisTabIndex) => {
                if (thisTabIndex !== targetIndex) {
                    thisTab.active = false;
                }
            });
        });
    }

    public focusTabAt(index: number): void {
        let tab = this.tabs[index];
        if (tab) {
            this._activeIndex = index;
            tab.focus();
        }
    }

    public findTab(predicate: (tab: HTMLETabElement) => boolean): HTMLETabElement | null {
        return this.tabs.find(predicate) || null;
    }

    public activateTab(tab: HTMLETabElement) {
        if (this.tabs.includes(tab)) {
            tab.active = true;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tablist": HTMLETabListElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "tabchange": TabChangeEvent
    }
}