import { CustomElement, element } from "../../Element";
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

    tabs: HTMLETabElement[];

    #activeIndex: number;

    constructor() {
        super();
        
        this.attachShadow({mode: "open"}).append(
            element("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: block;
                            position: relative;
                        }
                    `
                }
            }),
            element("slot")
        );
        
        this.tabs = [];
        this.#activeIndex = 1;
    }

    get activeIndex(): number {
        return this.#activeIndex;
    }

    get activeTab(): HTMLETabElement | null {
        return this.tabs[this.#activeIndex] || null;
    }

    connectedCallback(): void {
        this.tabIndex = this.tabIndex;
        const slot = this.shadowRoot!.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", (event) => {

                const tabs = <HTMLETabElement[]>(<HTMLSlotElement>event.target)
                    .assignedElements()
                    .filter(tab => tab instanceof HTMLETabElement);
                this.tabs = tabs;
                this.#activeIndex = this.tabs.findIndex(tab => tab.active);
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
            this.#activeIndex = targetIndex;
            this.tabs.forEach((thisTab, thisTabIndex) => {
                if (thisTabIndex !== targetIndex) {
                    thisTab.active = false;
                }
            });
        });
    }

    focusTabAt(index: number): void {
        const tab = this.tabs[index];
        if (tab) {
            this.#activeIndex = index;
            tab.focus();
        }
    }

    activateTab(tab: HTMLETabElement) {
        if (this.tabs.includes(tab)) {
            tab.active = true;
        }
    }
}

var HTMLETabListElement: HTMLETabListElementConstructor = HTMLETabListElementBase;