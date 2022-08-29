import { CustomElement } from "../../Element";
import { HTMLETabElement } from "./Tab";

export { HTMLETabListElement };

interface HTMLETabListElementConstructor {
    prototype: HTMLETabListElement;
    new(): HTMLETabListElement;
}

interface HTMLETabListElement extends HTMLElement {
    get activeTab(): HTMLETabElement | null;
    get selectedTab(): HTMLETabElement | null;
    get tabs(): HTMLETabElement[];
    firstItem(): HTMLETabElement | null;
    connectedCallback(): void;
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

    #walker: TreeWalker;
    
    get tabs(): HTMLETabElement[] {
        return Array.from(
            this.querySelectorAll("e-tab")
        );
    }

    get activeTab(): HTMLETabElement | null {
        return this.querySelector(
            "e-tab[active]"
        );
    }

    get selectedTab(): HTMLETabElement | null {
        return this.querySelector(
            "e-tab[selected]"
        );
    }

    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
    }

    connectedCallback(): void {
        const {tabIndex, selectedTab} = this;
        this.tabIndex = tabIndex;
        const tabToSelect = selectedTab ?? this.firstItem();
        if (tabToSelect) {
            this.#selectTab(tabToSelect);
        }
    }

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLETabElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
    }

    firstItem(): HTMLETabElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLETabElement | null>walker.firstChild();
    }

    #lastItem(): HTMLETabElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLETabElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLETabElement): HTMLETabElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLETabElement | null>walker.previousNode();
    }

    #nextItem(item: HTMLETabElement): HTMLETabElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLETabElement | null>walker.nextNode();
    }

    #setActiveTab(item: HTMLETabElement | null): void {
        const {activeTab} = this;
        if (activeTab !== null && activeTab !== item) {
            activeTab.active = false;
        }
        if (item !== null) {
            item.active = true;
        }
    }

    #selectTab(tab: HTMLETabElement) {
        const {selectedTab} = this;
        if (tab !== selectedTab) {
            tab.selected = true;
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        const targetTab = (<Element>target).closest("e-tab");
        if (targetTab) {
            targetTab.select();
        }
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const {activeTab} = this;
        if (!this.contains(<Node>relatedTarget)) {
            (activeTab ?? this.firstItem())?.focus();
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const targetTab = <HTMLETabElement | null>(<HTMLElement>target).closest("e-tab");
        if (targetTab) {
            this.#setActiveTab(targetTab);
            this.tabIndex = -1;
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.tabIndex = 0;
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        const {activeTab} = this;
        switch (key) {
            case "ArrowLeft": {
                const previousTab = activeTab ?
                    this.#previousItem(activeTab) ?? this.#lastItem() :
                    this.firstItem();
                previousTab?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "ArrowRight": {
                const nextTab = activeTab ?
                    this.#nextItem(activeTab) ?? this.firstItem() :
                    this.#lastItem();
                nextTab?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.firstItem();
                if (firstItem) {
                    firstItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem();
                if (lastItem) {
                    lastItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                activeTab?.click();
                event.stopPropagation();
                break;
            }
        }
    }

    #handleSelectEvent(event: Event) {
        const {target} = event;
        const targetTab = <HTMLETabElement>target;
        if (targetTab.selected) {
            const {tabs} = this;
            tabs.forEach((tab_i) => {
                if (tab_i !== targetTab) {
                    //const {selected} = tab_i;
                    //if (selected) {
                        tab_i.selected = false;
                    //}
                    const {panel} = tab_i;
                    if (panel) {
                        panel.hidden = true;
                    }
                }
            });
            const {panel} = targetTab;
            if (panel) {
                panel.hidden = false;
            }
        }
    }
}

var HTMLETabListElement: HTMLETabListElementConstructor = HTMLETabListElementBase;