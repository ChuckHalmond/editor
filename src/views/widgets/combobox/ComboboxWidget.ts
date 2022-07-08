import { element, widget, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { optionWidget } from "./OptionWidget";

export { comboboxWidget };

interface ComboboxWidgetFactory extends WidgetFactory {
    create(properties?: {
        label?: string;
        name?: string;
        disabled?: boolean;
        multiselectable?: boolean;
    }): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    getLabel(combobox: HTMLElement): string;
    setLabel(combobox: HTMLElement, value: string): void;
    getName(combobox: HTMLElement): string;
    setName(combobox: HTMLElement, value: string): void;
    getExpanded(combobox: HTMLElement): boolean;
    setExpanded(combobox: HTMLElement, value: boolean): void;
    setDisabled(combobox: HTMLElement, value: boolean): void;
    getDisabled(combobox: HTMLElement): boolean;
    expand(combobox: HTMLElement): void;
    collapse(combobox: HTMLElement): void;
    toggle(combobox: HTMLElement, force?: boolean): void;
}

declare global {
    interface WidgetNameMap {
        "combobox": ComboboxWidgetFactory
    }
}

var comboboxWidget = new(
Widget({
    name: "combobox"
})(
class ComboboxWidgetFactoryBase extends WidgetFactory implements ComboboxWidgetFactory {
    #template: HTMLElement;
    #walker: TreeWalker;
    #optionsObserver: MutationObserver;

    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.#optionsObserver = new MutationObserver(
            this.#optionsMutationCallback.bind(this)
        );
        this.#template = element("div", {
            attributes: {
                class: "combobox",
                role: "combobox",
                tabindex: 0,
            },
            children: [
                element("div", {
                    attributes: {
                        class: "content"
                    },
                    children: [
                        element("label", {
                            attributes: {
                                class: "label"
                            }
                        }),
                        element("span", {
                            attributes: {
                                class: "value"
                            }
                        })
                    ]
                }),
                element("div", {
                    attributes: {
                        class: "box"
                    }
                })
            ]
        });
    }

    create(init?: {
        label?: string;
        name?: string;
        disabled?: boolean;
        multiselectable?: boolean;
    }): HTMLElement {
        const combobox = <HTMLElement>this.#template.cloneNode(true);
        this.#optionsObserver.observe(combobox, {
            childList: true,
            subtree: true
        });
        combobox.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        combobox.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        combobox.addEventListener("click", this.#handleClickEvent.bind(this));
        combobox.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        combobox.addEventListener("select", this.#handleSelectEvent.bind(this));
        this.setExpanded(combobox, false);
        if (init !== void 0) {
            const {label, name, disabled, multiselectable} = init;
            if (label !== void 0) {
                this.setLabel(combobox, label);
            }
            if (name !== void 0) {
                this.setName(combobox, name);
            }
            if (disabled !== void 0) {
                this.setDisabled(combobox, disabled);
            }
            if (multiselectable !== void 0) {
                this.setMultiSelectable(combobox, multiselectable);
            }
        }
        return combobox;
    }

    slot(combobox: HTMLElement, name: string | null) {
        return this.#box(combobox);
    }

    slottedCallback(combobox: HTMLElement, slot: HTMLElement) {
        const {childNodes} = slot;
        Array.from(childNodes).forEach((child_i, i) => {
            if (child_i instanceof HTMLElement) {
                //gridRowWidget.setPosInSet(child_i, i);
            }
        });
    }

    #box(combobox: HTMLElement): HTMLElement {
        return combobox.querySelector<HTMLElement>(":scope > .box")!;
    }
    
    options(combobox: HTMLElement): HTMLElement[] {
        return Array.from(combobox.querySelectorAll<HTMLElement>(
            ":scope > :is(.box, .box > .optiongroup) > .option"
        ));
    }

    selectedOption(combobox: HTMLElement): HTMLElement | null {
        return combobox.querySelector<HTMLElement>(
            ":scope > :is(.box, .box > .optiongroup) > .option[aria-selected=true]"
        );
    }

    #getActiveOption(combobox: HTMLElement): HTMLElement | null {
        return combobox.querySelector<HTMLElement>(
            ":scope > :is(.box, .box > .optiongroup) > .option:focus-within"
        );
    }

    #value(combobox: HTMLElement): HTMLElement {
        return combobox.querySelector<HTMLElement>(":scope > .content > .value")!;
    }

    #label(combobox: HTMLElement): HTMLElement {
        return combobox.querySelector<HTMLElement>(":scope > .content > .label")!;
    }

    getLabel(combobox: HTMLElement): string {
        return this.#label(combobox).textContent ?? "";
    }

    setLabel(combobox: HTMLElement, value: string): void {
        this.#label(combobox).textContent = value;
    }
    
    getName(combobox: HTMLElement): string {
        return combobox.getAttribute("name") ?? "";
    }

    setName(combobox: HTMLElement, value: string): void {
        combobox.setAttribute("name", value);
    }

    getDisabled(combobox: HTMLElement): boolean {
        return combobox.hasAttribute("aria-disabled");
    }

    setDisabled(combobox: HTMLElement, value: boolean): void {
        combobox.toggleAttribute("aria-disabled", value);
    }

    setExpanded(combobox: HTMLElement, value: boolean): void {
        combobox.setAttribute("aria-expanded", value.toString());
    }

    getExpanded(combobox: HTMLElement): boolean {
        return JSON.parse(combobox.getAttribute("aria-expanded") ?? false.toString());
    }

    setMultiSelectable(combobox: HTMLElement, value: boolean): void {
        combobox.setAttribute("aria-multiselectable", value.toString());
    }

    getMultiSelectable(combobox: HTMLElement): boolean {
        return JSON.parse(combobox.getAttribute("aria-multiselectable") ?? false.toString());
    }

    expand(combobox: HTMLElement): void {
        const expanded = this.getExpanded(combobox);
        if (!expanded) {
            this.setExpanded(combobox, true);
            this.#positionBox(combobox);
            const selectedOption = this.selectedOption(combobox);
            if (selectedOption) {
                selectedOption.focus({preventScroll: true});
            }
        }
    }

    collapse(combobox: HTMLElement): void {
        const expanded = this.getExpanded(combobox);
        if (expanded) {
            this.setExpanded(combobox, false);
            combobox.focus();
        }
    }

    toggle(combobox: HTMLElement, force?: boolean): void {
        const expanded = this.getExpanded(combobox);
        const expand = force ?? !expanded;
        expand ? this.expand(combobox) : this.collapse(combobox);
    }

    #optionsMutationCallback(mutationsList: MutationRecord[]) {
        mutationsList.forEach((mutation: MutationRecord) => {
            const {target, type} = mutation;
            const targetCombobox = (<HTMLElement>target).closest<HTMLElement>(".combobox")!;
            if (targetCombobox instanceof HTMLElement) {
                switch (type) {
                    case "childList": {
                        const {addedNodes} = mutation;
                        const selector = ".option[aria-selected=true]";
                        for (let node of addedNodes) {
                            if (node instanceof HTMLElement) {
                                const selectedOption = node.matches(selector) ? node :
                                    node.querySelector<HTMLElement>(selector);
                                if (selectedOption) {
                                    this.#setSelectedOption(targetCombobox, selectedOption);
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        });
    }

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLElement) {
            const {classList} = node;
            if (classList.contains("option") && !optionWidget.getDisabled(node) && !node.hidden) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("optiongroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    }

    #firstOption(combobox: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = this.#box(combobox);
        return <HTMLElement | null>walker.firstChild();
    }

    #lastOption(combobox: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = this.#box(combobox);
        return <HTMLElement | null>walker.lastChild();
    }
    
    #previousOption(option: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = option;
        return <HTMLElement | null>walker.previousNode();
    }

    #nextOption(option: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = option;
        return <HTMLElement | null>walker.nextNode();
    }

    #selectOption(combobox: HTMLElement, option: HTMLElement) {
        const selectedOption = this.selectedOption(combobox);
        if (selectedOption && option !== selectedOption) {
            optionWidget.setSelected(selectedOption, false);
        }
        if (option && option !== selectedOption) {
            optionWidget.setSelected(option, true);
        }
    }
    
    #setSelectedOption(combobox: HTMLElement, option: HTMLElement) {
        this.#value(combobox).textContent = optionWidget.getLabel(option);
    }

    #positionBox(combobox: HTMLElement): void {
        const box = combobox.querySelector<HTMLElement>(":scope > .box")!;
        const {style: optionsStyle} = box;  
        const {bottom: selectBottom, left: selectLeft} = combobox.getBoundingClientRect();
        const {scrollX, scrollY} = window;
        optionsStyle.setProperty("top", `${selectBottom + scrollY}px`);
        optionsStyle.setProperty("left", `${selectLeft + scrollX}px`);
    }

    #handleClickEvent(event: MouseEvent): void {
        const {currentTarget, target} = event;
        const targetCombobox = <HTMLElement>currentTarget;
        this.toggle(targetCombobox);
        const expanded = this.getExpanded(targetCombobox);
        if (expanded) {
            const selectedOption = this.selectedOption(targetCombobox);
            (selectedOption ?? this.options(targetCombobox)[0])?.focus({preventScroll: true});
        }
        else {
            const targetOption = (<HTMLElement>target).closest<HTMLElement>(".option");
            if (targetOption) {
                this.#selectOption(targetCombobox, targetOption);
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetCombobox = <HTMLElement>currentTarget;
        const lostFocusWithin = !targetCombobox.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.collapse(targetCombobox);
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {currentTarget, key} = event;
        const targetCombobox = <HTMLElement>currentTarget;
        const expanded = this.getExpanded(targetCombobox);
        const activeOption = this.#getActiveOption(targetCombobox);
        const selectedOption = this.selectedOption(targetCombobox);
        switch (key) {
            case "ArrowUp": {
                if (expanded && activeOption !== null) {
                    const previousOption = this.#previousOption(activeOption) ?? this.#firstOption(targetCombobox);
                    if (previousOption) {
                        previousOption.focus({preventScroll: true});
                    }
                }
                else {
                    this.expand(targetCombobox);
                    selectedOption?.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (expanded && activeOption !== null) {
                    const nextOption = this.#nextOption(activeOption) ?? this.#lastOption(targetCombobox);
                    if (nextOption) {
                        nextOption.focus({preventScroll: true});
                    }
                }
                else {
                    this.expand(targetCombobox);
                    selectedOption?.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstOption = this.#firstOption(targetCombobox);
                if (firstOption && expanded) {
                    firstOption.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastOption = this.#lastOption(targetCombobox);
                if (lastOption && expanded) {
                    lastOption.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (expanded) {
                    this.collapse(targetCombobox);
                    if (activeOption) {
                        this.#selectOption(targetCombobox, activeOption);
                    }
                }
                else {
                    this.expand(targetCombobox);
                    selectedOption?.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                if (expanded) {
                    this.collapse(targetCombobox);
                }
                event.stopPropagation();
                break;
            }
            default: {
                const {length: keyLength} = key;
                if (keyLength == 1) {
                    const keyCode = key.charCodeAt(0);
                    const options = this.options(targetCombobox);
                    const activeIndex = activeOption ? options.indexOf(activeOption) : -1;
                    const matchingOption = options.find(
                        (option_i, i) => optionWidget.getLabel(option_i).toLowerCase().charCodeAt(0) == keyCode && i > activeIndex
                    ) ?? options.find(
                        (option_i) => optionWidget.getLabel(option_i).toLowerCase().charCodeAt(0) == keyCode
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

    #handleSelectEvent(event: Event): void {
        const {currentTarget, target} = event;
        const targetCombobox = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("option")) {
            this.#setSelectedOption(targetCombobox, target);
        }
    }
}));