import { element, reactiveChildElements, Stylesheet, trimMultilineIndent } from "../../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../../models/Model";
import { MenuItemModel } from "./MenuItemWidget";

export class MenuModel extends ModelObject {
    readonly childItems: ModelList<MenuItemModel>;
    
    constructor()
    constructor(init: {items: MenuItemModel[]})
    constructor(init?: {items: MenuItemModel[]}) {
        super();
        const childItems = new ModelList(init?.items ?? []);
        childItems.setParent(this);
        this.childItems = childItems;
    }
}

function isMenuElement(obj: any): obj is HTMLElement {
    return obj instanceof HTMLElement &&
        obj.getAttribute("role") === "menu";
}

function isMenuItemElement(obj: any): obj is HTMLElement {
    return obj instanceof HTMLElement &&
        ["menuitem", "menuitemradio", "menuitemcheckbox"]
        .some(role_i => obj.getAttribute("role") === role_i);
}

export class MenuWidget {
    readonly menuElement: HTMLElement;
    readonly model: MenuModel;

    readonly items: MenuItemCollection;

    get activeItem(): HTMLElement | null {
        return this.items.item(this.#activeIndex);
    }

    get activeIndex(): number {
        return this.#activeIndex;
    }

    static {
        (document as any).adoptedStyleSheets.push(
            Stylesheet(trimMultilineIndent(/*css*/`
                .menuwidget {
                    margin: 0;
                }
            `))
        );
    }

    #activeIndex: number;
    #toggleTimeouts: WeakMap<HTMLElement, {clear(): void;}>;
    #walker: TreeWalker;

    static readonly map: WeakMap<HTMLElement, MenuWidget> = new WeakMap();

    constructor(model: MenuModel) {
        this.model = model;
        this.menuElement = this.render();
        const {menuElement} = this;
        this.items = new MenuItemCollection(menuElement);
        this.#activeIndex = -1;
        this.#toggleTimeouts = new WeakMap();
        this.#walker = document.createTreeWalker(
            this.menuElement, NodeFilter.SHOW_ELEMENT, <NodeFilter>this.#walkerNodeFilter.bind(this)
        );
        menuElement.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        menuElement.addEventListener("mouseout", this.#handleMouseOutEvent.bind(this));
        menuElement.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        menuElement.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        menuElement.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        //menuElement.addEventListener("trigger", this.#handleTriggerEvent.bind(this));
        MenuWidget.map.set(this.menuElement, this);
    }

    getWidget(menuElement: HTMLElement): MenuWidget | null {
        return MenuWidget.map.get(menuElement) ?? null;
    }

    #walkerNodeFilter(element: HTMLElement): number {
        switch (element.getAttribute("role")) {
            case "menuitem":
            case "menuitemcheckbox":
            case "menuitemradio":
                return NodeFilter.FILTER_ACCEPT;
            case "group":
                return NodeFilter.FILTER_SKIP;
            default:
                return NodeFilter.FILTER_REJECT;
        }
    }

    render() {
        const {model} = this;
        return element("ul", {
            properties: {
                className: "menuwidget"
            },
            attributes: {
                role: "menu"
            },
            children: reactiveChildElements(
                model.childItems,
                item_i => element("li", {
                    properties: {
                        tabIndex: -1,
                        className: "menuwidget__item",
                        textContent: item_i.label
                    },
                    attributes: {
                        role: "menuitem"
                    }
                })
            )
        });
    }

    #collapseSubmenus(): void {
        Array.from(this.items.values())
            .forEach((item_i) => {
                item_i.removeAttribute("aria-expanded")
            });
    }

    #firstItem(): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLElement | null>walker.firstChild();
    }

    #lastItem(): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLElement | null>walker.previousNode();
    }

    #nextItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLElement | null>walker.nextNode();
    }

    #firstChildItem(item: HTMLElement): HTMLElement | null {
        const menuElement = item.querySelector<HTMLElement>(":scope > [role=menu]");
        const menuWidget = menuElement ?
            MenuWidget.map.get(menuElement) :
            null;
        return menuWidget ?
            menuWidget.#firstItem() :
            null;
    }

    #setActiveItem(item: HTMLElement | null): void {
        const {activeItem, items} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.toggleAttribute("aria-active", false);
        }
        if (item !== null && activeItem !== item) {
            item.toggleAttribute("aria-active", true);
            this.#activeIndex = Array.from(items.values()).indexOf(item);
        }
        if (item == null) {
            this.#activeIndex = -1;
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const {items} = this;
        const targetClosestItem = Array.from(items.values()).find(
            item_i => item_i.contains(<Node>target)
        ) ?? null;
        if (targetClosestItem) {
            this.#setActiveItem(targetClosestItem);
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const {menuElement} = this;
        const lostFocusWithin = !menuElement.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            /*const {contextual} = this;
            if (contextual) {
                this.remove();
            }
            else {*/
                const {activeItem} = this;
                activeItem?.removeAttribute("aria-expanded");
                this.#setActiveItem(null);
            //}
        }
    }

    async #setItemTimeout(item: HTMLElement, delay?: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                resolve(void 0);
            }, delay ?? 0);
            this.#toggleTimeouts.set(item, {
                clear: () => {
                    clearTimeout(timeout);
                    reject();
                }
            });
        }).then(() => {
            this.#toggleTimeouts.delete(item);
        });
    }

    #clearItemTimeout(item: HTMLElement): void {
        const timeout = this.#toggleTimeouts.get(item);
        if (typeof timeout !== "undefined") {
            this.#toggleTimeouts.delete(item);
            timeout.clear();
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {key} = event;
        const {menuElement, activeItem} = this;
        switch (key) {
            case "ArrowUp": {
                const previousItem = activeItem ?
                    this.#previousItem(activeItem) ?? this.#lastItem() :
                    this.#firstItem();
                previousItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                const nextItem = activeItem ?
                    this.#nextItem(activeItem) ?? this.#firstItem() :
                    this.#firstItem();
                nextItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.#firstItem();
                firstItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem();
                lastItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (activeItem) {
                    const hasPopUp = activeItem.hasAttribute("aria-haspopup");
                    if (hasPopUp) {
                        activeItem.toggleAttribute("aria-expanded", true);
                        const firstChildItem = this.#firstChildItem(activeItem);
                        firstChildItem?.focus({preventScroll: true});
                    }
                    else {
                        activeItem.click();
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "Escape": {
                if (activeItem) {
                    const isClosestTargetMenu = event.composedPath().find(
                        target_i => isMenuElement(target_i)
                    ) == menuElement;
                    if (!isClosestTargetMenu) {
                        activeItem.toggleAttribute("aria-expanded", false);
                        activeItem.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const isClosestTargetMenu = event.composedPath().find(
                        target_i => isMenuElement(target_i)
                    ) == menuElement;
                    if (!isClosestTargetMenu) {
                        activeItem.toggleAttribute("aria-expanded", false);
                        activeItem.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowRight": {
                if (activeItem) {
                    const hasPopUp = activeItem.hasAttribute("aria-haspopup");
                    if (hasPopUp) {
                        activeItem.toggleAttribute("aria-expanded", true);
                        const firstChildItem = this.#firstChildItem(activeItem);
                        firstChildItem?.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
        }
    }

    #handleMouseOutEvent(event: MouseEvent): void {
        const {target, relatedTarget} = event;
        const {items, menuElement} = this;
        const targetClosestItem = Array.from(items.values()).find(
            item_i => item_i.contains(<Node>target)
        ) ?? null;
        if (targetClosestItem?.hasAttribute("aria-haspopup") && !targetClosestItem.hasAttribute("aria-expanded")) {
            this.#clearItemTimeout(targetClosestItem);
        }
        const isTargetClosestMenu = event.composedPath().find(
            target_i => isMenuElement(target_i)
            ) == menuElement;
        if (isTargetClosestMenu) {
            const {clientX, clientY} = event;
            const {left, right, top, bottom} = menuElement.getBoundingClientRect();
            const intersectsWithMouse = !(
                left > clientX || right < clientX || top > clientY || bottom < clientY
            );
            const containsRelatedTarget = menuElement.contains(<Node>relatedTarget);
            if (intersectsWithMouse && containsRelatedTarget) {
                if (isMenuElement(relatedTarget) && relatedTarget !== menuElement) {
                    relatedTarget.focus({preventScroll: true});
                }
                else {
                    const activeIndex = this.#activeIndex;
                    menuElement.focus({preventScroll: true});
                    this.#activeIndex = activeIndex;
                }
            }
            if (!intersectsWithMouse) {
                menuElement.focus({preventScroll: true});
            }
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        const {items, menuElement} = this;
        const targetClosestItem = Array.from(items.values()).find(
            item_i => item_i.contains(<Node>target)
        ) ?? null;
        if (targetClosestItem?.hasAttribute("aria-haspopup") && targetClosestItem.hasAttribute("aria-expanded")) {
            this.#clearItemTimeout(targetClosestItem);
        }
        const isTargetClosestMenu = event.composedPath().find(
            target_i => isMenuElement(target_i)
        ) == menuElement;
        if (isTargetClosestMenu) {
            const {activeItem} = this;
            if (activeItem?.hasAttribute("aria-haspopup") && activeItem.hasAttribute("aria-expanded") && 
                !activeItem.contains(<Node>target)) {
                this.#clearItemTimeout(activeItem);
                this.#setItemTimeout(activeItem, 500)
                    .then(() => {
                        activeItem.toggleAttribute("aria-expanded", false)
                    })
                    .catch(() => void 0);
            }
            if (targetClosestItem !== null) {
                targetClosestItem.focus({preventScroll: true});
                if (targetClosestItem.hasAttribute("aria-haspopup")) {
                    if (!targetClosestItem.hasAttribute("aria-expanded")) {
                        this.#clearItemTimeout(targetClosestItem);
                        this.#setItemTimeout(targetClosestItem, 200)
                            .then(() => {
                                const {activeItem} = this;
                                this.#collapseSubmenus();
                                if (activeItem) {
                                    this.#clearItemTimeout(activeItem);
                                    activeItem.toggleAttribute("aria-expanded", true);
                                    const menuElement = activeItem.querySelector<HTMLElement>(":scope > [role=menu]");
                                    menuElement?.focus({preventScroll: true});
                                }
                            })
                            .catch(() => void 0);
                    }
                    else {
                        const menuElement = targetClosestItem.querySelector<HTMLElement>(":scope > [role=menu]");
                        menuElement?.focus({preventScroll: true});
                    }
                }
            }
        }
    }

    /*#handleTriggerEvent(event: Event): void {
        const {target} = event;
        const composedPath = event.composedPath();
        const {menuElement} = this;
        if (isMenuItemElement(target)) {
            const isClosestTargetMenu = composedPath.find(
                target_i => isMenuElement(target_i)
            ) == menuElement;
            if (isClosestTargetMenu) {
                const {type, name, value} = target;
                if (type == "radio") {
                    Array.from(new HTMLEMenuItemRadioList(this, name).values()).forEach((radio_i) => {
                        radio_i.checked = radio_i.value == value;
                    });
                }
            }
            if (contextual) {
                this.remove();
            }
        }
    }*/
}

export { MenuItemRadioList };
export { MenuItemCollection };

interface MenuItemCollectionConstructor {
    readonly prototype: MenuItemCollection;
    new(root: HTMLElement): MenuItemCollection;
}

interface MenuItemCollection {
    length: number;
    item(index: number): HTMLElement | null;
    namedItem(name: string): HTMLElement | MenuItemRadioList | null;
    values(): IterableIterator<HTMLElement>;
}

interface MenuItemRadioListConstructor {
    readonly prototype: MenuItemRadioList;
    new(root: HTMLElement, name: string): MenuItemRadioList;
}

interface MenuItemRadioList {
    value: string;
    values(): IterableIterator<HTMLElement>;
}

class MenuItemCollectionBase implements MenuItemCollection {
    #walker: TreeWalker;

    get length(): number {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let length = 0;
        while (walker.nextNode() !== null) length++;
        return length;
    }

    constructor(root: HTMLElement) {
        this.#walker = document.createTreeWalker(
            root, NodeFilter.SHOW_ELEMENT, <NodeFilter>this.#walkerNodeFilter.bind(this)
        );
    }

    #walkerNodeFilter(element: HTMLElement): number {
        switch (element.getAttribute("role")) {
            case "menuitem":
            case "menuitemcheckbox":
            case "menuitemradio":
                return NodeFilter.FILTER_ACCEPT;
            case "group":
                return NodeFilter.FILTER_SKIP;
            default:
                return NodeFilter.FILTER_REJECT;
        }
    }

    item(index: number): HTMLElement | null {
        if (index < 0) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        let i = 0;
        while (i < index && currentNode !== null) {
            currentNode = walker.nextNode();
            i++;
        }
        return <HTMLElement | null>currentNode;
    }

    namedItem(name: string): HTMLElement | MenuItemRadioList | null {
        if (!name) {
            return null;
        }
        const walker = this.#walker;
        const {root} = walker;
        walker.currentNode = root;
        let currentNode = <HTMLElement | null>walker.nextNode();
        while (currentNode !== null && !(currentNode.getAttribute("name") == name)) {
            currentNode = <HTMLElement | null>walker.nextNode();
        }
        if (currentNode?.getAttribute("role") == "menuitemradio") {
            return new MenuItemRadioList(<HTMLElement>root, name);
        }
        return <HTMLElement | null>currentNode;
    }

    *values(): IterableIterator<HTMLElement> {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield <HTMLElement>currentNode;
            currentNode = walker.nextNode();
        }
    }

    static MenuItemRadioListBase? = class MenuItemRadioListBase implements MenuItemRadioList {
        #walker: TreeWalker;
        #name: string;

        get value(): string {
            const name = this.#name;
            const walker = this.#walker;
            walker.currentNode = walker.root;
            let currentNode = <HTMLElement | null>walker.nextNode();
            while (currentNode !== null) {
                if (currentNode.getAttribute("name") == name && currentNode.getAttribute("role") == "menuitemradio" && currentNode.getAttribute("role") == "menuitemradio") {
                    return currentNode.getAttribute("value") ?? "";
                }
                currentNode = <HTMLElement | null>walker.nextNode();
            }
            return "";
        }

        constructor(root: HTMLElement, name: string) {
            this.#walker = document.createTreeWalker(
                root, NodeFilter.SHOW_ELEMENT, <NodeFilter>this.#walkerNodeFilter.bind(this)
            );
            this.#name = name;
        }
        
        #walkerNodeFilter(element: HTMLElement): number {
            switch (element.getAttribute("role")) {
                case "menuitem":
                case "menuitemcheckbox":
                case "menuitemradio":
                    return NodeFilter.FILTER_ACCEPT;
                case "group":
                    return NodeFilter.FILTER_SKIP;
                default:
                    return NodeFilter.FILTER_REJECT;
            }
        }

        *values(): IterableIterator<HTMLElement> {
            const name = this.#name;
            const walker = this.#walker;
            walker.currentNode = walker.root;
            let currentNode = <HTMLElement | null>walker.nextNode();
            while (currentNode !== null) {
                const itemName = currentNode.getAttribute("name");
                const itemRole = currentNode.getAttribute("role");
                if (itemName == name && itemRole == "menuitemradio") {
                    yield currentNode;
                }
                currentNode = <HTMLElement | null>walker.nextNode();
            }
        }
    }
}

var MenuItemCollection: MenuItemCollectionConstructor =  MenuItemCollectionBase;
var MenuItemRadioList: MenuItemRadioListConstructor = MenuItemCollectionBase.MenuItemRadioListBase!;
delete MenuItemCollectionBase.MenuItemRadioListBase;