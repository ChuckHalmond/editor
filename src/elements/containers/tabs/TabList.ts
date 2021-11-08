import { CustomElement, HTML } from "../../Element";
import { HTMLETabElement } from "./Tab";

export { HTMLETabListElement };

interface HTMLETabListElementConstructor {
    readonly prototype: HTMLETabListElement;
    new(): HTMLETabListElement;
}

interface HTMLETabListElement extends HTMLElement {
    readonly activeTab: HTMLETabElement | null;
    tabs: HTMLETabElement[];
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tablist": HTMLETabListElement,
    }
}

@CustomElement({
    name: "e-tablist"
})
class HTMLETabListElementBase extends HTMLElement implements HTMLETabListElement {

    public tabs: HTMLETabElement[];

    private _activeIndex: number;

    constructor() {
        super();
        
        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: block;
                            position: relative;
                        }
                    `
                }
            }),
            HTML("slot")
        );
        
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
                    .filter(tab => tab instanceof HTMLETabElement) as HTMLETabElement[];
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
            if (target instanceof HTMLETabElement) {
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

    public focusTabAt(index: number): void {
        const tab = this.tabs[index];
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

var HTMLETabListElement: HTMLETabListElementConstructor = HTMLETabListElementBase;