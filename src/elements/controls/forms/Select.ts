import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEOptionElement } from "./Option";
import { HTMLEOptionGroupElement } from "./OptionGroup";

export { HTMLESelectElement };

interface HTMLESelectElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly internals: ElementInternals;
    get options(): HTMLEOptionElement[];
    get activeOption(): HTMLEOptionElement | null;
    get selectedOption(): HTMLEOptionElement | null;
    name: string;
    value: string;
    expanded: boolean;
    expand(): void;
    collapse(): void;
    toggle(force?: boolean): void;
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
class HTMLESelectElementBase extends HTMLElement implements HTMLESelectElement {
    
    readonly shadowRoot!: ShadowRoot;
    readonly internals: ElementInternals;

    static get formAssociated(): boolean {
        return true;
    }

    get options(): HTMLEOptionElement[] {
        return Array.from(this.querySelectorAll<HTMLEOptionElement>(
            "e-option"
        ));
    }

    get activeOption(): HTMLEOptionElement | null {
        return this.querySelector("e-option:focus-within") ?? null;
    }

    get selectedOption(): HTMLEOptionElement | null {
        return this.querySelector("e-option[selected]") ?? null;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    value!: string;

    @AttributeProperty({type: String, defaultValue: "select", observed: true})
    type!: string;

    @AttributeProperty({type: Boolean})
    expanded!: boolean;

    #walker: TreeWalker;
    #wasExpandedOnMouseDown: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("div", {
                attributes: {
                    part: "content"
                },
                children: [
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
        this.internals = this.attachInternals();
        this.#wasExpandedOnMouseDown = false;
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.#walker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
    }

    connectedCallback(): void {
        const {tabIndex, options, selectedOption, value} = this;
        this.tabIndex = tabIndex;
        const optionToSelect = selectedOption ?? options.find(
            option_i => option_i.value === value
        ) ?? this.#firstOption();
        if (optionToSelect) {
            this.#selectOption(optionToSelect);
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

    #value(): HTMLElement {
        return this.shadowRoot.querySelector<HTMLElement>("[part=value]")!;
    }

    #box(): HTMLElement {
        return this.shadowRoot.querySelector<HTMLElement>("[part=box]")!;
    }

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLEOptionElement && !node.disabled && !node.hidden) {
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
    
    #previousOption(option: HTMLEOptionElement): HTMLEOptionElement | null {
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
        if (option !== selectedOption) {
            option.selected = true;
            this.dispatchEvent(new Event("change", {bubbles: true}));
        }
    }
    
    #setSelectedOption(option: HTMLEOptionElement) {
        const {label, value} = option;
        const {internals} = this;
        this.#value().textContent = label;
        internals.setFormValue(value);
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
        const wasExpandedOnMouseDown = this.#wasExpandedOnMouseDown;
        if (!wasExpandedOnMouseDown) {
            const {selectedOption} = this;
            this.expand();
            (selectedOption ?? this.#firstOption())?.focus({preventScroll: true});
        }
        else {
            this.collapse();
            const targetOption = (<HTMLElement>target).closest<HTMLEOptionElement>("e-option");
            if (targetOption) {
                this.#selectOption(targetOption);
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin || this === relatedTarget) {
            this.collapse();
        }
    }

    #handleMouseDownEvent(): void {
        const {expanded} = this;
        this.#wasExpandedOnMouseDown = expanded;
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        const targetOption = (<Element>target).closest<HTMLEOptionElement>("e-option");
        if (targetOption) {
            targetOption.focus({preventScroll: true});
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
                this.toggle();
                const {expanded} = this;
                if (expanded) {
                    const {selectedOption} = this;
                    (selectedOption ?? this.#firstOption())?.focus({preventScroll: true});
                }
                else {
                    if (activeOption) {
                        this.#selectOption(activeOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                if (expanded) {
                    this.collapse();
                    event.stopPropagation();
                    event.preventDefault();
                }
                break;
            }
            default: {
                const {length: keyLength} = key;
                if (keyLength == 1) {
                    const keyCode = key.charCodeAt(0);
                    const {options} = this;
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
    
    #handleSelectEvent(event: Event): void {
        const {target} = event;
        const targetOption = (<Element>target).closest<HTMLEOptionElement>("e-option");
        if (targetOption) {
            const {selected} = targetOption;
            if (selected) {
                const {options} = this;
                options.forEach((option_i) => {
                    if (option_i !== targetOption && option_i.selected) {
                        option_i.selected = false;
                    }
                });
                this.#setSelectedOption(targetOption);
            }
            else {
                const {selectedOption} = this;
                if (selectedOption === null) {
                    const firstOption = this.#firstOption();
                    if (firstOption !== null) {
                        this.#setSelectedOption(firstOption);
                    }
                }
            }
        }
    }
}

var HTMLESelectElement: HTMLESelectElementConstructor = HTMLESelectElementBase;