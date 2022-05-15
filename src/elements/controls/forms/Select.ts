import { HTMLEActionElement } from "../../containers/actions/Action";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEOptionElement } from "./Option";
import { HTMLEOptionCollection } from "./OptionCollection";
import { HTMLEOptionGroupElement } from "./OptionGroup";

export { HTMLESelectElement };

interface HTMLESelectElement extends HTMLEActionElement {
    readonly shadowRoot: ShadowRoot;
    readonly options: HTMLEOptionCollection;
    readonly activeIndex: number;
    readonly activeOption: HTMLEOptionElement | null;
    readonly selectedIndex: number;
    readonly selectedOption: HTMLEOptionElement | null;
    name: string;
    label: string;
    value: string;
    expanded: boolean;
    expand(): void;
    collapse(): void;
    toggle(force?: boolean): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

interface HTMLESelectElementConstructor {
    readonly prototype: HTMLESelectElement;
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

    get activeIndex(): number {
        return this.#activeIndex;
    }

    get selectedIndex(): number {
        return this.#selectedIndex;
    }

    get activeOption(): HTMLEOptionElement | null {
        return this.options.item(this.#activeIndex) ?? null;
    }

    get selectedOption(): HTMLEOptionElement | null {
        return this.options.item(this.#selectedIndex) ?? null;
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
    #activeIndex: number;
    #selectedIndex: number;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("div", {
                part: ["content"],
                children: [
                    element("label", {
                        part: ["label"]
                    }),
                    element("output", {
                        part: ["value"]
                    })
                ]
            }),
            element("div", {
                part: ["options"],
                children: [
                    element("slot"),
                    element("hr", {
                        part: ["separator"]
                    }),
                    element("span", {
                        part: ["description"]
                    })
                ]
            })
        );
    }

    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.#activeIndex = -1;
        this.#selectedIndex = -1;
        this.options = new HTMLEOptionCollection(this);
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "label": {
                const {shadowRoot} = this;
                const labelPart = shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "value": {
                const {options} = this;
                const matchingOption = Array.from(options.values()).find(option => option.value == newValue);
                if (matchingOption) {
                    this.#setSelectedOption(matchingOption);
                    this.dispatchEvent(new Event("change", {bubbles: true}));
                }
                break;
            }
        }
    }

    expand(): void {
        const {expanded, options} = this;
        if (!expanded) {
            this.expanded = true;
            const {selectedIndex} = this;
            this.#positionOptions();
            const option = options.item(selectedIndex);
            if (option) {
                option.focus({preventScroll: true});
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

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLEOptionElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEOptionGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    #firstOption(): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLEOptionElement | null>walker.firstChild();
    }

    #lastOption(): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLEOptionElement | null>walker.lastChild();
    }
    
    #previousOption(item: HTMLEOptionElement): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLEOptionElement | null>walker.previousNode();
    }

    #nextOption(item: HTMLEOptionElement): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLEOptionElement | null>walker.nextNode();
    }

    #selectOption(option: HTMLEOptionElement): void {
        if (option && !option.disabled) {
            this.value = option.value;
        }
    }

    #setActiveOption(option: HTMLEOptionElement | null): void {
        const {options, activeOption} = this;
        if (activeOption !== null && activeOption !== option) {
            activeOption.active = false;
        }
        if (option !== null) {
            if (!option.disabled) {
                const {shadowRoot} = this;
                const descriptionPart = shadowRoot.querySelector("[part='description']");
                if (descriptionPart) {
                    descriptionPart.textContent = option.description;
                }
                this.#activeIndex = Array.from(options.values()).indexOf(option);
            }
            option.active = true;
        }
        else {
            this.#activeIndex = -1;
        }
    }

    #setSelectedOption(option: HTMLEOptionElement | null): void {
        const {options} = this;
        if (option !== null) {
            if (!option.disabled) {
                const {shadowRoot, selectedOption} = this;
                const valuePart = shadowRoot.querySelector("[part='value']");
                if (valuePart) {
                    valuePart.textContent = option.label;
                }
                option.selected = true;
                if (selectedOption) {
                    selectedOption.selected = false;
                }
                this.#selectedIndex = Array.from(options.values()).indexOf(option);
            }
        }
        else {
            this.#activeIndex = -1;
        }
    }

    #positionOptions(): void {
        const {shadowRoot} = this;
        const options = shadowRoot.querySelector<HTMLElement>("[part=options]")!;
        const {style: optionsStyle} = options;  
        const {bottom: selectBottom, left: selectLeft} = this.getBoundingClientRect();
        const {scrollX, scrollY} = window;
        optionsStyle.setProperty("top", `${selectBottom + scrollY}px`);
        optionsStyle.setProperty("left", `${selectLeft + scrollX}px`);
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        if (target instanceof HTMLEOptionElement) {
            this.#selectOption(target);
            this.collapse();
        }
        else {
            if (target == this) {
                this.toggle();
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const {expanded} = this;
        if (target instanceof HTMLEOptionElement) {
            if (!expanded) {
                this.expand();
            }
            this.#setActiveOption(target);
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const {expanded} = this;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            if (expanded) {
                this.collapse();
            }
            this.#setActiveOption(null);
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        const {options, activeOption, selectedOption, selectedIndex, expanded} = this;
        switch (key) {
            case "ArrowUp": {
                if (expanded && activeOption !== null) {
                    const previousOption = this.#previousOption(activeOption) ?? this.#firstOption();
                    if (previousOption) {
                        previousOption.focus({preventScroll: true});
                    }
                }
                else if (!expanded && selectedOption !== null) {
                    const previousOption = this.#previousOption(selectedOption) ?? this.#firstOption();
                    if (previousOption) {
                        this.#selectOption(previousOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (expanded && activeOption !== null) {
                    const nextOption = this.#nextOption(activeOption) ?? this.#lastOption();
                    if (nextOption) {
                        nextOption.focus({preventScroll: true});
                    }
                }
                else if (!expanded && selectedOption !== null) {
                    const nextOption = this.#nextOption(selectedOption) ?? this.#lastOption();
                    if (nextOption) {
                        this.#selectOption(nextOption);
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstOption = this.#firstOption();
                if (firstOption !== null) {
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
                if (lastOption !== null) {
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
                    if (activeOption !== null) {
                        this.#selectOption(activeOption);
                    }
                }
                else {
                    const option = options.item(selectedIndex);
                    if (option !== null) {
                        option.focus({preventScroll: true});
                    }
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
                const {activeIndex} = this;
                const {length: keyLength} = key;
                if (keyLength == 1) {
                    const keyCode = key.charCodeAt(0);
                    const optionsArray = Array.from(options.values());
                    const firstMatchIndex = optionsArray.findIndex(
                        option_i => option_i.label.toLowerCase().charCodeAt(0) == keyCode
                    );
                    const nextMatchIndex = optionsArray.findIndex(
                        (option_i, i) => option_i.label.toLowerCase().charCodeAt(0) == keyCode && i > activeIndex
                    );
                    const matchIndex = nextMatchIndex > -1 ?
                        nextMatchIndex :
                        firstMatchIndex;
                    const option = options.item(matchIndex);
                    if (option !== null) {
                        option.focus({preventScroll: true});
                    }
                    event.stopPropagation();
                }
                break;
            }
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        if (target instanceof HTMLEOptionElement) {
            target.focus({preventScroll: true});
        }
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const options = <HTMLEOptionElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLEOptionElement
            );
        if (options.length > 0) {
            let selectedOption: HTMLEOptionElement | undefined | null = null;
            let {value} = this;
            if (value) {
                selectedOption = options.find(option => option.value == value);
            }
            if (selectedOption == null) {
                selectedOption = options.find(option => option.selected);
            }
            if (selectedOption == null) {
                selectedOption = options.find(option => option.default);
            }
            if (selectedOption == null) {
                selectedOption = this.#firstOption();
            }
            options.forEach(option_i => {
                option_i.selected = option_i == selectedOption
            });
            if (selectedOption) {
                this.#setSelectedOption(selectedOption);
            }
        }
    }
}

var HTMLESelectElement: HTMLESelectElementConstructor = HTMLESelectElementBase;