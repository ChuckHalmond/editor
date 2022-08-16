import { HTMLEActionElement } from "../../containers/actions/Action";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEOptionElement } from "./Option";
import { HTMLEOptionCollection } from "./OptionCollection";
import { HTMLEOptionGroupElement } from "./OptionGroup";

export { HTMLESelectElement };

interface HTMLESelectElement extends HTMLEActionElement {
    readonly shadowRoot: ShadowRoot;
    readonly options: HTMLEOptionCollection;
    readonly activeOption: HTMLEOptionElement | null;
    readonly selectedOption: HTMLEOptionElement | null;
    name: string;
    label: string;
    value: string;
    expanded: boolean;
    expand(): void;
    collapse(): void;
    toggle(force?: boolean): void;
    //attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

interface HTMLESelectElementConstructor {
    prototype: HTMLESelectElement;
    new(): HTMLESelectElement;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-select": HTMLESelectElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-select"
})
class HTMLESelectElementBase extends HTMLEActionElement implements HTMLESelectElement {
    
    readonly shadowRoot!: ShadowRoot;
    readonly options: HTMLEOptionCollection;

    get activeOption(): HTMLEOptionElement | null {
        return this.querySelector("e-option[active]") ?? null;
    }

    get selectedOption(): HTMLEOptionElement | null {
        return this.querySelector("e-option[selected]") ?? null;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string;

    @AttributeProperty({type: String, observed: true})
    value!: string;

    @AttributeProperty({type: String, defaultValue: "select", observed: true})
    type!: string;

    @AttributeProperty({type: Boolean})
    expanded!: boolean;

    #walker: TreeWalker;
    #optionsObserver: MutationObserver;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("div", {
                attributes: {
                    part: "content"
                },
                children: [
                    element("label", {
                        attributes: {
                            part: "label"
                        }
                    }),
                    element("output", {
                        attributes: {
                            part: "value"
                        }
                    })
                ]
            }),
            element("div", {
                attributes: {
                    part: "box"
                },
                children: element("slot")
            })
        );
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.#walker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.#optionsObserver = new MutationObserver(
            this.#mutationCallback.bind(this)
        );
        this.#optionsObserver.observe(this, {
            childList: true,
            subtree: true
        });
        this.options = new HTMLEOptionCollection(this);
    }

    connectedCallback() {
        const {selectedOption} = this;
        if (selectedOption !== null) {
            this.#value().textContent = selectedOption.getAttribute("label");
        }
    }

    expand(): void {
        const {expanded} = this;
        if (!expanded) {
            this.expanded = true;
            this.#positionBox();
            const {selectedOption} = this;
            if (selectedOption) {
                selectedOption.focus({preventScroll: true});
            }
        }
    }

    collapse(): void {
        const {expanded} = this;
        if (expanded) {
            this.expanded = false;
            this.focus();
        }
    }

    toggle(force?: boolean): void {
        const {expanded} = this;
        const expand = force ?? !expanded;
        expand ? this.expand() : this.collapse();
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "label": {
                const {shadowRoot} = this;
                const labelPart = shadowRoot.querySelector<HTMLElement>("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
        }
    }

    #value(): HTMLElement {
        return this.shadowRoot.querySelector<HTMLElement>("[part=value]")!;
    }

    #box(): HTMLElement {
        return this.shadowRoot.querySelector<HTMLElement>("[part=box]")!;
    }

    #mutationCallback(mutationsList: MutationRecord[]): void {
        mutationsList.forEach((mutation: MutationRecord) => {
            const {type} = mutation;
            switch (type) {
                case "childList": {
                    const {addedNodes} = mutation;
                    const selector = "e-option[selected]";
                    for (let node of addedNodes) {
                        if (node instanceof HTMLElement) {
                            const selectedOption = <HTMLEOptionElement | null>(
                                node.matches(selector) ? node :
                                node.querySelector(selector)
                            );
                            if (selectedOption !== null) {
                                this.#setSelectedOption(selectedOption);
                            }
                        }
                    }
                    break;
                }
            }
        });
    }

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLOptionElement && !node.disabled && !node.hidden) {
            return NodeFilter.FILTER_ACCEPT;
        }
        else if (node instanceof HTMLEOptionGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    #firstOption(): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = this;
        return <HTMLEOptionElement | null>walker.firstChild();
    }

    #lastOption(): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = this;
        return <HTMLEOptionElement | null>walker.lastChild();
    }
    
    #previousOption(option: HTMLElement): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = option;
        return <HTMLEOptionElement | null>walker.previousNode();
    }

    #nextOption(option: HTMLEOptionElement): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = option;
        return <HTMLEOptionElement | null>walker.nextNode();
    }

    #selectOption(option: HTMLEOptionElement) {
        const {selectedOption} = this;
        if (selectedOption) {
            selectedOption.selected = false;
        }
        if (option !== selectedOption) {
            option.selected = true;
            this.#setSelectedOption(option);
            this.dispatchEvent(new Event("change", {bubbles: true}));
        }
    }
    
    #setSelectedOption(option: HTMLEOptionElement) {
        this.#value().textContent = option.label;
    }

    #positionBox(): void {
        const box = this.#box()
        const {style: optionsStyle} = box;  
        const {bottom, left} = this.getBoundingClientRect();
        const {scrollX, scrollY} = window;
        optionsStyle.setProperty("top", `${bottom + scrollY}px`);
        optionsStyle.setProperty("left", `${left + scrollX}px`);
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        this.toggle();
        const {expanded} = this;
        if (expanded) {
            const {selectedOption} = this;
            (selectedOption ?? this.options.item(0))?.focus({preventScroll: true});
        }
        else {
            const targetOption = (<HTMLElement>target).closest<HTMLEOptionElement>("e-option");
            
            if (targetOption) {
                this.#selectOption(targetOption);
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.collapse();
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        const {expanded, activeOption, selectedOption} = this;
        switch (key) {
            case "ArrowUp": {
                if (expanded) {
                    const previousOption = activeOption ?
                        this.#previousOption(activeOption) :
                        this.#firstOption();
                    if (previousOption) {
                        previousOption.focus({preventScroll: true});
                    }
                }
                else {
                    const previousOption = selectedOption ?
                        this.#previousOption(selectedOption) :
                        this.#firstOption();
                    if (previousOption) {
                        this.#selectOption(previousOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (expanded) {
                    const nextOption = activeOption ?
                        this.#nextOption(activeOption) :
                        this.#lastOption();
                    if (nextOption) {
                        nextOption.focus({preventScroll: true});
                    }
                }
                else {
                    const nextOption = selectedOption ?
                        this.#nextOption(selectedOption) :
                        this.#lastOption();
                    if (nextOption) {
                        this.#selectOption(nextOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstOption = this.#firstOption();
                if (firstOption) {
                    if (expanded) {
                        firstOption.focus({preventScroll: true});
                    }
                    else {
                        this.#selectOption(firstOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastOption = this.#lastOption();
                if (lastOption) {
                    if (expanded) {
                        lastOption.focus({preventScroll: true});
                    }
                    else {
                        this.#selectOption(lastOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (expanded) {
                    this.collapse();
                    if (activeOption) {
                        this.#selectOption(activeOption);
                    }
                }
                else {
                    this.expand();
                    selectedOption?.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                if (expanded) {
                    this.collapse();
                }
                event.stopPropagation();
                break;
            }
            default: {
                const {length: keyLength} = key;
                if (keyLength == 1) {
                    const keyCode = key.charCodeAt(0);
                    const options = Array.from(this.options.values());
                    const activeIndex = activeOption ? options.indexOf(activeOption) : -1;
                    const matchingOption = options.find(
                        (option_i, i) => option_i.label.toLowerCase().charCodeAt(0) == keyCode && i > activeIndex
                    ) ?? options.find(
                        (option_i) => option_i.label.toLowerCase().charCodeAt(0) == keyCode
                    );
                    if (matchingOption) {
                        matchingOption.focus({preventScroll: true});
                    }
                    event.stopPropagation();
                }
                break;
            }
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        const targetItem = (<Element>target).closest<HTMLElement>(".option");
        if (targetItem) {
            targetItem.focus({preventScroll: true});
        }
    }
}

var HTMLESelectElement: HTMLESelectElementConstructor = HTMLESelectElementBase;