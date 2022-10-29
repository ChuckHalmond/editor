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
var style: string;
var mutationObserver: MutationObserver;

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
        style = /*css*/`
            :host {
                position: relative;
                display: inline-block;
                user-select: none;
                line-height: 22px;
                border: 1px solid var(--item-border-color);
            }

            :host(:focus-visible) {
                outline: none;
            }
            
            :host(:focus-within) {
                background-color: var(--focused-item-color);
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            [part="content"] {
                display: flex;
                overflow: hidden;
                padding: 0 4px;
            }
            
            [part="content"]::after {
                display: inline-block;
                text-align: center;
                width: 22px;
                height: 22px;
                margin-left: 6px;
                content: "▾";
            }
            
            [part="value"] {
                margin-right: auto;
                text-align: right;
            }
            
            [part="box"] {
                z-index: 1;
                position: absolute;
            
                display: block;
                padding: 6px 0;
                width: max-content;
            
                background-color: white;
            
                -webkit-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                -moz-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
            }
            
            :host(:not([expanded])) [part="box"] {
                opacity: 0;
                pointer-events: none;
            }
        `;
        mutationObserver = new MutationObserver(
            (mutationsList: MutationRecord[]) => {
                mutationsList.forEach((mutation: MutationRecord) => {
                    const {target} = mutation;
                    const select = <HTMLESelectElementBase>target;
                    const {selectedOption, value, options} = select;
                    if (!selectedOption) {
                        const optionToSelect = value ? options.find(
                            option_i => option_i.value === value
                        ) : select.#firstOption();
                        if (optionToSelect) {
                            optionToSelect.selected = true;
                        }
                        else {
                            select.#setSelectedOption(null);
                        }
                    }
                });
            }
        );
    }

    constructor() {
        super();
        const internals = this.attachInternals();
        internals.role = "combobox";
        this.internals = internals;
        this.#wasExpandedOnMouseDown = false;
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
        mutationObserver.observe(
            this, {
                childList: true,
                subtree: true
            }
        );
    }

    connectedCallback(): void {
        const {options, selectedOption, value} = this;
        const tabindex = this.getAttribute("tabindex");
        this.tabIndex = tabindex !== null ? parseInt(tabindex) : 0;
        customElements.upgrade(this);
        const optionToSelect = selectedOption ?? (
            value ? options.find(
                option_i => option_i.value === value
            ) : null
        ) ?? this.#firstOption();
        if (optionToSelect) {
            if (optionToSelect === selectedOption) {
                this.#setSelectedOption(selectedOption);
            }
            else {
                this.#selectOption(optionToSelect);
            }
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
        walker.currentNode = walker.root;
        return <HTMLEOptionElement | null>walker.firstChild();
    }

    #lastOption(): HTMLEOptionElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
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
        }
    }
    
    #setSelectedOption(option: HTMLEOptionElement | null) {
        const {label, value} = option ?? {label: "", value: ""};
        const {internals} = this;
        this.#value().textContent = label;
        internals.setFormValue(value);
    }

    #positionBox(): void {
        const box = this.#box();
        const {offsetLeft, offsetTop} = this;
        const {width, height} = this.getBoundingClientRect();
        const {style: boxStyle} = box;
        const {width: boxWidth, height: boxHeight} = box.getBoundingClientRect();
        const {clientWidth, clientHeight} = document.body;
        const overflowX = offsetLeft + width + boxWidth - clientWidth;
        const overflowY = offsetTop + boxHeight - clientHeight;
        boxStyle.setProperty("left", `${
            overflowX > 0 ?
            width - boxWidth :
            0
        }px`);
        boxStyle.setProperty("top", `${
            overflowY > 0 ?
            -boxHeight :
            height
        }px`);
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        const wasExpandedOnMouseDown = this.#wasExpandedOnMouseDown;
        if (!wasExpandedOnMouseDown) {
            const {selectedOption} = this;
            this.expand();
            (selectedOption ?? this.#firstOption() ?? this).focus({preventScroll: true});
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