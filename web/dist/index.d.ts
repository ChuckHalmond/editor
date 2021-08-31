declare module "libs/events/EventDispatcher" {
    export { EventBase };
    export { Event };
    export { EEvent };
    export { EventDispatcher };
    export { EventDispatcherBase };
    interface EventConstructor {
        readonly prototype: Event;
        new <T extends string, D extends any>(type: T, data: D): Event<T, D>;
    }
    interface Event<T extends string = string, D extends any = any> {
        readonly type: T;
        readonly data: D;
    }
    type EEvent<T extends string = string, D extends any = any> = Event<T, D>;
    class EventBase<T extends string, D extends any> implements Event<T, D> {
        readonly type: T;
        readonly data: D;
        constructor(type: T, data: D);
    }
    var Event: EventConstructor;
    interface EventDispatcher<Events extends {
        [K in Extract<keyof Events, string>]: Event<K>;
    } = {}> {
        addEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): (event: Events[K]) => void;
        addEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): (event: Event<K>) => void;
        removeEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): number;
        removeEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): number;
        dispatchEvent<K extends Extract<keyof Events, string>>(event: Events[K]): void;
        dispatchEvent<K extends string>(event: Event<K>): void;
    }
    interface EventDispatcherConstructor {
        readonly prototype: EventDispatcher<{}>;
        new <Events extends {
            [K in Extract<keyof Events, string>]: Event<K>;
        } = {}>(): EventDispatcher<Events>;
    }
    class EventDispatcherBase<Events extends {
        [K in Extract<keyof Events, string>]: Event<K>;
    } = {}> implements EventDispatcher<Events> {
        private _listeners;
        constructor();
        addEventListener<K extends string>(event: K, handler: (event: Event<K>) => void, once?: boolean): (event: Event<K>) => void;
        addEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): (event: Events[K]) => void;
        removeEventListener<K extends string>(event: string, handler: (event: Event<K>) => void, once?: boolean): number;
        removeEventListener<K extends Extract<keyof Events, string>>(event: K, handler: (event: Events[K]) => void, once?: boolean): number;
        dispatchEvent<K extends string>(event: Event<K>): void;
        dispatchEvent<K extends Extract<keyof Events, string>>(event: Events[K]): void;
    }
    const EventDispatcher: EventDispatcherConstructor;
}
declare module "editor/model/Model" {
    import { EventDispatcher } from "libs/events/EventDispatcher";
    export { ObjectModelChangeEvent };
    export { ObjectModel };
    export { ObjectModelBase };
    export { ListModelChangeEvent };
    export { ListModelChangeType };
    export { ListModel };
    export { ListModelBase };
    interface ObjectModelChangeEvent {
        type: "objectmodelchange";
        data: {
            property: string;
            oldValue: any;
            newValue: any;
        };
    }
    interface ObjectModelChangeEvents {
        "objectmodelchange": ObjectModelChangeEvent;
    }
    interface ObjectModel<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> {
        readonly data: Readonly<Data>;
        setData<K extends keyof Data>(key: K, value: Data[K]): void;
    }
    class ObjectModelBase<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> implements ObjectModel<Data> {
        private _data;
        constructor(data: Data);
        get data(): Readonly<Data>;
        setData<K extends keyof Data>(key: K, value: Data[K]): void;
    }
    type ListModelChangeType = "insert" | "remove" | "clear";
    interface ListModelChangeEvent {
        type: "listmodelchange";
        data: {
            index: number;
            addedItems: any[];
            removedItems: any[];
        };
    }
    interface ListModelEvents {
        "listmodelchange": ListModelChangeEvent;
    }
    interface ListModel<Item> extends EventDispatcher<ListModelEvents> {
        readonly items: ReadonlyArray<Item>;
        insertItem(index: number, item: Item): void;
        removeItem(index: number): void;
        clearItems(): void;
    }
    class ListModelBase<Item> extends EventDispatcher<ListModelEvents> implements ListModel<Item> {
        private _items;
        constructor(items: Item[]);
        get items(): ReadonlyArray<Item>;
        insertItem(index: number, item: Item): void;
        removeItem(index: number): void;
        clearItems(): void;
    }
}
declare module "editor/elements/Snippets" {
    export { forAllSubtreeElements };
    export { forAllSubtreeNodes };
    export { getPropertyFromPath };
    export { setPropertyFromPath };
    export { pointIntersectsWithDOMRect };
    function forAllSubtreeElements(element: Element, func: (element: Element) => void): void;
    function forAllSubtreeNodes(parent: Node & ParentNode, func: (childNode: Node & ChildNode, parentNode: Node & ParentNode) => void): void;
    function getPropertyFromPath(src: object, path: string): any;
    function setPropertyFromPath(src: object, path: string, value: any): object;
    function pointIntersectsWithDOMRect(x: number, y: number, rect: DOMRect): boolean;
}
declare module "editor/elements/HTMLElement" {
    import { ListModel, ListModelChangeEvent, ObjectModel, ObjectModelChangeEvent } from "editor/model/Model";
    export { isTagElement };
    export { RegisterCustomHTMLElement };
    export { GenerateAttributeAccessors };
    export { createTemplate };
    export { bindShadowRoot };
    export { HTMLElementDescription };
    export { setElementProperties };
    export { setElementAttributes };
    export { setElementChildren };
    export { HTMLElementConstructor };
    export { isParentNode };
    export { isReactiveNode };
    export { isReactiveParentNode };
    export { ReactiveNode };
    export { ReactiveParentNode };
    export { ReactiveChildNodes };
    export { isElement };
    export { Element };
    export { HTMLElementInit };
    export { AttributeMutationMixin };
    export { AttributeType };
    export { areAttributesMatching };
    export { AttributeMutationMixinBase };
    export { createMutationObserverCallback };
    export { Fragment };
    export { parseStringTemplate };
    function isTagElement<K extends keyof HTMLElementTagNameMap>(tagName: K, obj: any): obj is HTMLElementTagNameMap[K];
    interface RegisterCustomHTMLElementDecorator {
        (args: {
            name: string;
            observedAttributes?: string[];
            options?: ElementDefinitionOptions;
        }): <C extends CustomElementConstructor>(elementCtor: C) => C;
    }
    function parseStringTemplate(template: string, items: {
        [key: string]: Node | string;
    }): DocumentFragment;
    const RegisterCustomHTMLElement: RegisterCustomHTMLElementDecorator;
    interface GenerateAttributeAccessorsDecorator {
        (attributes: {
            name: string;
            type?: "string" | "number" | "boolean" | "json";
        }[]): <C extends CustomElementConstructor>(elementCtor: C) => C;
    }
    const GenerateAttributeAccessors: GenerateAttributeAccessorsDecorator;
    function createTemplate<E extends Element | DocumentFragment>(templateContent?: string): E;
    function bindShadowRoot(element: HTMLElement, templateContent?: string): ShadowRoot;
    function Fragment(...nodes: (Node | string)[]): DocumentFragment;
    type HTMLElementDescription<K extends keyof HTMLElementTagNameMap> = {
        tagName: K;
        init?: HTMLElementInit<K>;
    };
    type _IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
    type WritableKeys<T> = {
        [P in keyof T]-?: _IfEquals<{
            [Q in P]: T[P];
        }, {
            -readonly [Q in P]: T[P];
        }, P>;
    }[keyof T];
    interface HTMLElementInit<K extends keyof HTMLElementTagNameMap> {
        options?: ElementCreationOptions;
        props?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>;
        attrs?: {
            [name: string]: number | string | boolean;
        };
        children?: (Node | string)[];
        listeners?: {
            [ListenerEvent in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[ListenerEvent]) => any | [(event: HTMLElementEventMap[ListenerEvent]) => any, Partial<boolean | AddEventListenerOptions>];
        };
    }
    function HTMLElementConstructor<K extends keyof HTMLElementTagNameMap>(tagName: K, init?: HTMLElementInit<K>): HTMLElementTagNameMap[K];
    interface HTMLInit<K extends keyof HTMLElementTagNameMap> {
        options?: ElementCreationOptions;
        props?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>;
        attrs?: {
            [name: string]: number | string | boolean;
        };
        children?: Node[] | NodeList | ReactiveChildNodes;
        listeners?: {
            [ListenerEvent in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[ListenerEvent]) => any | [(event: HTMLElementEventMap[ListenerEvent]) => any, Partial<boolean | AddEventListenerOptions>];
        };
        styles?: {
            [property: string]: string | [string, string];
        };
    }
    function Element<K extends keyof HTMLElementTagNameMap>(tag: HTMLElementTag<K>, init?: HTMLInit<K>): HTMLElementTagNameMap[K];
    type ReactiveNode = Node & {
        _reactAttributes: {
            _reactModel: ObjectModel<object>;
            _reactEvent: "objectmodelchange";
            _reactListener: (event: ObjectModelChangeEvent) => void;
        };
    };
    function isParentNode(node: Node): node is Node & ParentNode;
    function isElement(node: Node): node is Element;
    function isReactiveNode(node: Node): node is ReactiveNode;
    type ReactiveParentNode = (Node & ParentNode) & {
        _reactAttributes: {
            _reactModel: ListModel<object>;
            _reactEvent: "listmodelchange";
            _reactListener: (event: ListModelChangeEvent) => void;
        };
    };
    function isReactiveParentNode(node: Node): node is ReactiveParentNode;
    function ReactiveNode<Data extends object, N extends Node>(node: N, object: ObjectModel<Data>, react: <K extends keyof Data>(node: N, property: K, oldValue: Data[K], newValue: Data[K]) => void): N;
    interface ReactiveChildNodes {
        (parent: Node & ParentNode): (Node | string)[];
    }
    function ReactiveChildNodes<Item extends object>(list: ListModel<Item>, map: (item: Item) => Node | string): ReactiveChildNodes;
    function setElementChildren<E extends Element>(element: E, children: (Node | string)[] | NodeList): E;
    function setElementProperties<E extends Element>(element: E, properties?: Partial<Pick<E, WritableKeys<E>>>): E;
    function setElementAttributes<E extends Element>(element: E, attributes?: {
        [attrName: string]: number | string | boolean;
    }): E;
    interface AttributeMutationMixin {
        readonly attributeName: string;
        readonly attributeValue: string;
        readonly attributeType: AttributeType;
        attach(element: Element): void;
        detach(element: Element): void;
    }
    type AttributeType = "string" | "boolean" | "listitem";
    function areAttributesMatching(refAttributeType: AttributeType, refAttrName: string, refAttrValue: string, attrName: string, attrValue: string | null): boolean;
    abstract class AttributeMutationMixinBase implements AttributeMutationMixin {
        readonly attributeName: string;
        readonly attributeValue: string;
        readonly attributeType: AttributeType;
        constructor(attributeName: string, attributeType?: AttributeType, attributeValue?: string);
        abstract attach(element: Element): void;
        abstract detach(element: Element): void;
    }
    function createMutationObserverCallback(mixins: AttributeMutationMixin[]): (mutationsList: MutationRecord[]) => void;
}
declare module "editor/elements/lib/controls/draggable/Draggable" {
    export { HTMLEDraggableElement };
    export { HTMLEDraggableElementBase };
    interface HTMLEDraggableElement extends HTMLElement {
        selected: boolean;
        dragged: boolean;
        type: string;
        dragovered: boolean;
    }
    class HTMLEDraggableElementBase extends HTMLElement implements HTMLEDraggableElement {
        selected: boolean;
        dragovered: boolean;
        dragged: boolean;
        disabled: boolean;
        type: string;
        constructor();
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-draggable": HTMLEDraggableElement;
        }
    }
}
declare module "editor/elements/lib/controls/draggable/Dragzone" {
    import { HTMLEDraggableElement } from "editor/elements/lib/controls/draggable/Draggable";
    export { HTMLEDragzoneElement };
    export { HTMLEDragzoneElementBase };
    interface HTMLEDragzoneElement extends HTMLElement {
        draggables: HTMLEDraggableElement[];
        selectedDraggables: HTMLEDraggableElement[];
        label: string;
        selectDraggable(draggable: HTMLEDraggableElement): void;
        unselectDraggable(draggable: HTMLEDraggableElement): void;
        clearSelection(): void;
    }
    class HTMLEDragzoneElementBase extends HTMLElement implements HTMLEDragzoneElement {
        label: string;
        draggables: HTMLEDraggableElement[];
        selectedDraggables: HTMLEDraggableElement[];
        constructor();
        selectDraggable(draggable: HTMLEDraggableElement): void;
        unselectDraggable(draggable: HTMLEDraggableElement): void;
        clearSelection(): void;
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-dragzone": HTMLEDragzoneElement;
        }
    }
}
declare module "editor/elements/lib/controls/draggable/Dropzone" {
    import { HTMLEDraggableElement } from "editor/elements/lib/controls/draggable/Draggable";
    export { DataChangeEvent };
    export { HTMLEDropzoneElement };
    export { HTMLEDropzoneElementBase };
    interface HTMLEDropzoneElement extends HTMLElement {
        selectedDraggables: HTMLEDraggableElement[];
        draggables: HTMLEDraggableElement[];
        dragovered: DropzoneDragoveredType | null;
        name: string;
        type: string;
        multiple: boolean;
        disabled: boolean;
        placeholder: string;
        droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => void) | null;
        addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
        removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
        selectDraggable(draggable: HTMLEDraggableElement): void;
        unselectDraggable(draggable: HTMLEDraggableElement): void;
        clearSelection(): void;
    }
    type DropzoneDragoveredType = "self" | "draggable" | "appendarea";
    type DataChangeEvent = CustomEvent<{
        action: "insert" | "remove";
        draggables: HTMLEDraggableElement[];
        position: number;
    }>;
    class HTMLEDropzoneElementBase extends HTMLElement implements HTMLEDropzoneElement {
        dragovered: DropzoneDragoveredType | null;
        placeholder: string;
        input: string;
        multiple: boolean;
        disabled: boolean;
        name: string;
        type: string;
        droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => boolean) | null;
        value: any;
        draggables: HTMLEDraggableElement[];
        selectedDraggables: HTMLEDraggableElement[];
        constructor();
        selectDraggable(draggable: HTMLEDraggableElement): void;
        unselectDraggable(draggable: HTMLEDraggableElement): void;
        clearSelection(): void;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        addDraggables(draggables: HTMLEDraggableElement[], position: number): HTMLEDraggableElement[] | null;
        removeDraggables(predicate?: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-dropzone": HTMLEDropzoneElement;
        }
    }
    global {
        interface HTMLElementEventMap {
            "datachange": DataChangeEvent;
        }
    }
}
declare module "editor/elements/lib/containers/menus/MenuBar" {
    import { HTMLEMenuItemElement } from "editor/elements/lib/containers/menus/MenuItem";
    export { HTMLEMenuBarElement };
    export { HTMLEMenuBarElementBase };
    interface HTMLEMenuBarElement extends HTMLElement {
        name: string;
        active: boolean;
        items: HTMLEMenuItemElement[];
        readonly activeIndex: number;
        readonly activeItem: HTMLEMenuItemElement | null;
        focusItemAt(index: number, childMenu?: boolean): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): void;
        reset(): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
    }
    class HTMLEMenuBarElementBase extends HTMLElement implements HTMLEMenuBarElement {
        name: string;
        active: boolean;
        items: HTMLEMenuItemElement[];
        private _activeIndex;
        constructor();
        get activeIndex(): number;
        get activeItem(): HTMLEMenuItemElement | null;
        connectedCallback(): void;
        focusItemAt(index: number, childMenu?: boolean): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): void;
        reset(): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-menubar": HTMLEMenuBarElement;
        }
    }
}
declare module "editor/elements/lib/containers/menus/MenuItemGroup" {
    import { HTMLEMenuItemElement } from "editor/elements/lib/containers/menus/MenuItem";
    import { HTMLEMenuElement } from "editor/elements/lib/containers/menus/Menu";
    export { HTMLEMenuItemGroupElement };
    export { HTMLEMenuItemGroupElementBase };
    interface HTMLEMenuItemGroupElement extends HTMLElement {
        name: string;
        label: string;
        type: "list" | "grid";
        rows: number;
        cells: number;
        parentMenu: HTMLEMenuElement | null;
        items: HTMLEMenuItemElement[];
        readonly activeIndex: number;
        readonly activeItem: HTMLEMenuItemElement | null;
        focusItemAt(index: number, childMenu?: boolean): void;
        reset(): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    }
    class HTMLEMenuItemGroupElementBase extends HTMLElement implements HTMLEMenuItemGroupElement {
        name: string;
        label: string;
        type: "list" | "grid";
        rows: number;
        cells: number;
        parentMenu: HTMLEMenuElement | null;
        items: HTMLEMenuItemElement[];
        private _activeIndex;
        constructor();
        get activeIndex(): number;
        get activeItem(): HTMLEMenuItemElement | null;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        focusItemAt(index: number, childMenu?: boolean): void;
        reset(): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-menuitemgroup": HTMLEMenuItemGroupElement;
        }
    }
}
declare module "editor/elements/lib/containers/menus/MenuItem" {
    import { HotKey } from "engine/core/input/Input";
    import { HTMLEMenuElement } from "editor/elements/lib/containers/menus/Menu";
    import { HTMLEMenuBarElement } from "editor/elements/lib/containers/menus/MenuBar";
    import { HTMLEMenuItemGroupElement } from "editor/elements/lib/containers/menus/MenuItemGroup";
    export { EMenuItemElementType };
    export { HTMLEMenuItemElement };
    export { HTMLEMenuItemElementBase };
    export { HotKeyChangeEvent };
    type EMenuItemElementType = "button" | "radio" | "checkbox" | "menu" | "submenu";
    interface HTMLEMenuItemElement extends HTMLElement {
        name: string;
        label: string;
        type: EMenuItemElementType;
        disabled: boolean;
        checked: boolean;
        value: string;
        icon: string;
        group: HTMLEMenuItemGroupElement | null;
        parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
        childMenu: HTMLEMenuElement | null;
        hotkey: HotKey | null;
        command: string | null;
        commandArgs: any;
        trigger(): void;
    }
    class HTMLEMenuItemElementBase extends HTMLElement implements HTMLEMenuItemElement {
        name: string;
        label: string;
        type: EMenuItemElementType;
        disabled: boolean;
        checked: boolean;
        value: string;
        icon: string;
        group: HTMLEMenuItemGroupElement | null;
        parentMenu: HTMLEMenuElement | HTMLEMenuBarElement | null;
        childMenu: HTMLEMenuElement | null;
        command: string | null;
        commandArgs: any;
        private _hotkey;
        constructor();
        get hotkey(): HotKey | null;
        set hotkey(hotkey: HotKey | null);
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        trigger(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-menuitem": HTMLEMenuItemElement;
        }
    }
    type HotKeyChangeEvent = CustomEvent<{
        oldHotKey: HotKey | null;
        newHotKey: HotKey | null;
    }>;
    global {
        interface HTMLElementEventMap {
            "hotkeychange": HotKeyChangeEvent;
        }
    }
    global {
        interface HTMLElementEventMap {
            "trigger": Event;
        }
    }
    global {
        interface HTMLElementEventMap {
            "radiochangerequest": Event;
        }
    }
    global {
        interface HTMLElementEventMap {
            "change": Event;
        }
    }
}
declare module "editor/elements/lib/containers/menus/Menu" {
    import { HTMLEMenuItemElement } from "editor/elements/lib/containers/menus/MenuItem";
    import { HTMLEMenuItemGroupElement } from "editor/elements/lib/containers/menus/MenuItemGroup";
    export { HTMLEMenuElement };
    export { HTMLEMenuElementBase };
    interface HTMLEMenuElement extends HTMLElement {
        name: string;
        expanded: boolean;
        overflowing: boolean;
        parentItem: HTMLEMenuItemElement | null;
        items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
        readonly activeIndex: number;
        readonly activeItem: HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null;
        focusItemAt(index: number, childMenu?: boolean): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
        reset(): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    }
    class HTMLEMenuElementBase extends HTMLElement implements HTMLEMenuElement {
        name: string;
        expanded: boolean;
        overflowing: boolean;
        parentItem: HTMLEMenuItemElement | null;
        items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
        private _activeIndex;
        constructor();
        get activeIndex(): number;
        get activeItem(): HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        focusItemAt(index: number, childMenu?: boolean): void;
        focusItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): void;
        reset(): void;
        findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-menu": HTMLEMenuElement;
        }
    }
}
declare module "editor/elements/lib/containers/menus/MenuButton" {
    import { HTMLEMenuElement } from "editor/elements/lib/containers/menus/Menu";
    export { HTMLEMenuButtonElement };
    export { HTMLEMenuButtonElementBase };
    interface HTMLEMenuButtonElement extends HTMLElement {
        name: string;
        label: string;
        disabled: boolean;
        icon: string;
        active: boolean;
        childMenu: HTMLEMenuElement | null;
        trigger(): void;
    }
    class HTMLEMenuButtonElementBase extends HTMLElement implements HTMLEMenuButtonElement {
        name: string;
        label: string;
        disabled: boolean;
        icon: string;
        active: boolean;
        childMenu: HTMLEMenuElement | null;
        constructor();
        trigger(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        connectedCallback(): void;
    }
}
declare module "editor/elements/lib/containers/tabs/TabPanel" {
    export { isHTMLETabPanelElement };
    export { HTMLETabPanelElement };
    export { BaseHTMLETabPanelElement };
    interface HTMLETabPanelElement extends HTMLElement {
        name: string;
    }
    function isHTMLETabPanelElement(obj: any): obj is BaseHTMLETabPanelElement;
    class BaseHTMLETabPanelElement extends HTMLElement implements HTMLETabPanelElement {
        name: string;
        constructor();
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-tabpanel": HTMLETabPanelElement;
        }
    }
}
declare module "editor/elements/lib/containers/tabs/Tab" {
    import { HTMLETabPanelElement } from "editor/elements/lib/containers/tabs/TabPanel";
    export { HTMLETabElement };
    export { BaseHTMLETabElement };
    interface HTMLETabElement extends HTMLElement {
        name: string;
        active: boolean;
        disabled: boolean;
        controls: string;
        panel: HTMLETabPanelElement | null;
    }
    class BaseHTMLETabElement extends HTMLElement implements HTMLETabElement {
        name: string;
        disabled: boolean;
        active: boolean;
        controls: string;
        panel: HTMLETabPanelElement | null;
        constructor();
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-tab": HTMLETabElement;
        }
    }
}
declare module "editor/elements/lib/containers/tabs/TabList" {
    import { HTMLETabElement } from "editor/elements/lib/containers/tabs/Tab";
    export { TabChangeEvent };
    export { HTMLETabListElement };
    export { BaseHTMLETabListElement };
    interface HTMLETabListElement extends HTMLElement {
        readonly activeTab: HTMLETabElement | null;
        tabs: HTMLETabElement[];
    }
    type TabChangeEvent = CustomEvent<{
        tab: HTMLETabElement;
    }>;
    class BaseHTMLETabListElement extends HTMLElement implements HTMLETabListElement {
        tabs: HTMLETabElement[];
        private _activeIndex;
        constructor();
        get activeTab(): HTMLETabElement | null;
        connectedCallback(): void;
        findTab(predicate: (tab: HTMLETabElement) => boolean): HTMLETabElement | null;
        activateTab(predicate: (tab: HTMLETabElement) => boolean): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-tablist": HTMLETabListElement;
        }
    }
    global {
        interface HTMLElementEventMap {
            "tabchange": TabChangeEvent;
        }
    }
}
declare module "editor/elements/lib/controls/draggable/DropzoneInput" {
    import { HTMLEDropzoneElement } from "editor/elements/lib/controls/draggable/Dropzone";
    interface HTMLEDropzoneInputElement extends HTMLElement {
        dropzone: HTMLEDropzoneElement | null;
        input: HTMLInputElement | null;
        converter: ((dropzone: HTMLEDropzoneElement) => string) | null;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-dropzoneinput": HTMLEDropzoneInputElement;
        }
    }
}
declare module "editor/elements/lib/utils/Import" {
    export { HTMLEImportElement };
    export { HTMLEImportElementBase };
    interface HTMLEImportElement extends HTMLElement {
        src: string;
    }
    class HTMLEImportElementBase extends HTMLElement {
        src: string;
        constructor();
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-import": HTMLEImportElement;
        }
    }
    global {
        interface HTMLElementEventMap {
            "e-load": CustomEvent;
        }
    }
}
declare module "editor/elements/lib/utils/Loader" {
    export { HTMLELoaderElement };
    export { HTMLELoaderElementBase };
    type LoaderType = "bar" | "circle";
    interface HTMLELoaderElement extends HTMLElement {
        type: LoaderType;
        promise: Promise<any> | null;
    }
    class HTMLELoaderElementBase extends HTMLElement implements HTMLELoaderElement {
        type: LoaderType;
        private _promise;
        constructor();
        set promise(promise: Promise<any> | null);
        get promise(): Promise<any> | null;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-loader": HTMLELoaderElement;
        }
    }
}
declare module "editor/elements/lib/utils/WidthSash" {
    export { HTMLEWidthSashElement };
    export { HTMLEWidthSashElementBase };
    interface HTMLEWidthSashElement extends HTMLElement {
        controls: string;
    }
    class HTMLEWidthSashElementBase extends HTMLElement implements HTMLEWidthSashElement {
        controls: string;
        private _target;
        private _targetStyle;
        constructor();
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-wsash": HTMLEWidthSashElement;
        }
    }
    global {
        interface HTMLElementEventMap {
            "resize": CustomEvent;
        }
    }
}
declare module "editor/elements/lib/utils/HeightSash" {
    export { HTMLEHeightSashElement };
    export { HTMLEHeightSashElementBase };
    interface HTMLEHeightSashElement extends HTMLElement {
        controls: string;
    }
    class HTMLEHeightSashElementBase extends HTMLElement implements HTMLEHeightSashElement {
        controls: string;
        private _target;
        private _targetStyle;
        constructor();
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-hsash": HTMLEHeightSashElement;
        }
    }
    global {
        interface HTMLElementEventMap {
            "resize": CustomEvent;
        }
    }
}
declare module "editor/elements/lib/containers/treeview/TreeViewItem" {
    import { HTMLETreeViewListElement } from "editor/elements/lib/containers/treeview/TreeViewList";
    export { HTMLETreeViewItemElement };
    export { HTMLETreeViewItemElementBase };
    interface HTMLETreeViewItemElement extends HTMLElement {
        name: string;
        label: string;
        expanded: boolean;
        indent: number;
        icon: string;
        active: boolean;
        items: HTMLETreeViewItemElement[];
        parent: HTMLETreeViewItemElement | HTMLETreeViewListElement | null;
        deepestVisibleChildItem(): HTMLETreeViewItemElement;
        previousVisibleItem(): HTMLETreeViewItemElement;
        nextVisibleItem(): HTMLETreeViewItemElement;
        nearestParentItem(): HTMLETreeViewItemElement;
        toggle(): void;
        trigger(): void;
    }
    class HTMLETreeViewItemElementBase extends HTMLElement implements HTMLETreeViewItemElement {
        name: string;
        label: string;
        indent: number;
        expanded: boolean;
        value: string;
        icon: string;
        active: boolean;
        leaf: boolean;
        items: HTMLETreeViewItemElement[];
        parent: HTMLETreeViewItemElement | HTMLETreeViewListElement | null;
        private _toggleArrow;
        constructor();
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        deepestVisibleChildItem(): HTMLETreeViewItemElement;
        previousVisibleItem(): HTMLETreeViewItemElement;
        nextVisibleItem(): HTMLETreeViewItemElement;
        nearestParentItem(): HTMLETreeViewItemElement;
        toggle(): void;
        trigger(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-treeviewitem": HTMLETreeViewItemElement;
        }
    }
    global {
        interface HTMLElementEventMap {
            "e-toggle": Event;
        }
    }
    global {
        interface HTMLElementEventMap {
            "e-trigger": Event;
        }
    }
}
declare module "editor/elements/lib/containers/treeview/TreeViewList" {
    import { HTMLETreeViewItemElement } from "editor/elements/lib/containers/treeview/TreeViewItem";
    export { HTMLETreeViewListElement };
    export { HTMLETreeViewListElementBase };
    interface HTMLETreeViewListElement extends HTMLElement {
        name: string;
        items: HTMLETreeViewItemElement[];
        readonly activeItem: HTMLETreeViewItemElement | null;
    }
    class HTMLETreeViewListElementBase extends HTMLElement implements HTMLETreeViewListElement {
        active: boolean;
        name: string;
        items: HTMLETreeViewItemElement[];
        private _activeItem;
        constructor();
        get activeItem(): HTMLETreeViewItemElement | null;
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-treeviewlist": HTMLETreeViewListElement;
        }
    }
}
declare module "editor/elements/lib/controls/breadcrumb/BreadcrumbItem" {
    export { HTMLEBreadcrumbItemElement };
    export { HTMLEBreadcrumbItemElementBase };
    interface HTMLEBreadcrumbItemElement extends HTMLElement {
        label: string;
        active: boolean;
    }
    class HTMLEBreadcrumbItemElementBase extends HTMLElement implements HTMLEBreadcrumbItemElement {
        label: string;
        active: boolean;
        constructor();
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-breadcrumbitem": HTMLEBreadcrumbItemElement;
        }
    }
}
declare module "editor/elements/lib/controls/breadcrumb/BreadcrumbTrail" {
    import { HTMLEBreadcrumbItemElement } from "editor/elements/lib/controls/breadcrumb/BreadcrumbItem";
    export { HTMLEBreadcrumbTrailElement };
    export { HTMLEBreadcrumbTrailElementBase };
    interface HTMLEBreadcrumbTrailElement extends HTMLElement {
        items: HTMLEBreadcrumbItemElement[];
        activateItem(item: HTMLEBreadcrumbItemElement): void;
    }
    class HTMLEBreadcrumbTrailElementBase extends HTMLElement implements HTMLEBreadcrumbTrailElement {
        items: HTMLEBreadcrumbItemElement[];
        constructor();
        activateItem(item: HTMLEBreadcrumbItemElement): void;
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-breadcrumbtrail": HTMLEBreadcrumbTrailElement;
        }
    }
}
declare module "editor/elements/view/View" {
    export { ViewBase };
    export { View };
    interface View<M extends object, E extends HTMLElement> {
        readonly element: E;
        readonly model: M;
        close(): void;
        render(): E;
    }
    abstract class ViewBase<M extends object, E extends HTMLElement> implements View<M, E> {
        private _element;
        private _model;
        private _observer;
        constructor(model: M);
        get element(): E;
        close(): void;
        get model(): M;
        abstract render(): E;
        private _addReactiveListeners;
        private _removeReactiveListeners;
    }
}
declare module "samples/scenes/temp" {
    export { temp };
    function temp(): void;
}
declare module "libs/commands/Command" {
    export { isCommand };
    export { isUndoCommand };
    export { Command };
    export { UndoCommand };
    function isCommand(obj: any): obj is Command;
    function isUndoCommand(obj: any): obj is UndoCommand;
    interface Command {
        exec: (args?: any) => void;
        undo?: (args?: any) => void;
    }
    interface UndoCommand {
        exec: (args?: any) => void;
        undo: (args?: any) => void;
    }
}
declare module "editor/elements/lib/containers/status/StatusItem" {
    export { HTMLEStatusItemElement };
    export { HTMLEStatusItemElementBase };
    interface HTMLEStatusItemElement extends HTMLElement {
    }
    type EStatusElementType = "button" | "widget";
    class HTMLEStatusItemElementBase extends HTMLElement implements HTMLEStatusItemElement {
        name: string;
        type: EStatusElementType;
        icon: string;
        command: string | null;
        private _stateMap;
        get stateMap(): ((state: any) => {
            content: string;
        }) | null;
        set stateMap(stateMap: ((state: any) => {
            content: string;
        }) | null);
        update(newValue: any): void;
        constructor();
        activate(): void;
        connectedCallback(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-statusitem": HTMLEStatusItemElement;
        }
    }
}
declare module "editor/elements/lib/containers/status/StatusBar" {
    import { HTMLEStatusItemElement } from "editor/elements/lib/containers/status/StatusItem";
    export { HTMLEStatusBarElement };
    export { HTMLEStatusBarElementBase };
    interface HTMLEStatusBarElement extends HTMLElement {
        items: HTMLEStatusItemElement[];
    }
    class HTMLEStatusBarElementBase extends HTMLElement implements HTMLEStatusBarElement {
        name: string;
        active: boolean;
        items: HTMLEStatusItemElement[];
        _selectedItemIndex: number;
        constructor();
        connectedCallback(): void;
        get selectedItemIndex(): number;
        get selectedItem(): HTMLEStatusItemElement | null;
        insertItem(index: number, item: HTMLEStatusItemElement): void;
        findItem(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement | null;
        findItems(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement[];
        selectItem(index: number): void;
        clearSelection(): void;
    }
    global {
        interface HTMLElementTagNameMap {
            "e-statusbar": HTMLEStatusBarElement;
        }
    }
}
declare module "editor/Input" {
    export { Key };
    export { KeyModifier };
    export { HotKey };
    export { MouseButton };
    enum Key {
        A = "a",
        B = "b",
        C = "c",
        D = "d",
        E = "e",
        F = "f",
        G = "g",
        H = "h",
        I = "i",
        J = "j",
        K = "k",
        L = "l",
        M = "m",
        O = "o",
        P = "p",
        Q = "q",
        R = "r",
        S = "s",
        T = "t",
        U = "u",
        V = "v",
        W = "w",
        X = "x",
        Y = "y",
        Z = "z",
        ENTER = "Enter",
        BACKSPACE = "Backspace",
        ARROW_DOWN = "ArrowDown",
        ARROW_LEFT = "ArrowLeft",
        ARROW_RIGHT = "ArrowRight",
        ARROW_UP = "ArrowUp",
        SHIFT = "Shift"
    }
    enum KeyModifier {
        Alt = "Alt",
        Control = "Control",
        Shift = "Shift"
    }
    enum MouseButton {
        LEFT = 1,
        WHEEL = 2,
        RIGHT = 3,
        FORWARD = 4,
        BACK = 5
    }
    class HotKey {
        readonly key: Key;
        readonly mod1?: KeyModifier;
        readonly mod2?: KeyModifier;
        constructor(key: Key, mod1?: KeyModifier, mod2?: KeyModifier);
        toString(): string;
        test(event: KeyboardEvent): boolean;
    }
}
declare module "editor/templates/menus/MenuItemGroupTemplate" {
    import { HTMLEMenuItemGroupElement } from "editor/elements/lib/containers/menus/MenuItemGroup";
    import { HTMLEMenuItemTemplateDescription } from "editor/templates/menus/MenuItemTemplate";
    export { HTMLEMenuItemGroupTemplateDescription };
    export { HTMLEMenuItemGroupTemplate };
    type HTMLEMenuItemGroupTemplateDescription = Partial<Pick<HTMLEMenuItemGroupElement, 'id' | 'className' | 'name' | 'label'>> & {
        isGroup: true;
        items: HTMLEMenuItemTemplateDescription[];
    };
    interface HTMLEMenuItemGroupTemplate {
        (desc: HTMLEMenuItemGroupTemplateDescription): HTMLEMenuItemGroupElement;
    }
    const HTMLEMenuItemGroupTemplate: HTMLEMenuItemGroupTemplate;
}
declare module "editor/templates/menus/MenuTemplate" {
    import { HTMLEMenuElement } from "editor/elements/lib/containers/menus/Menu";
    import { HTMLEMenuItemGroupTemplateDescription } from "editor/templates/menus/MenuItemGroupTemplate";
    import { HTMLEMenuItemTemplateDescription } from "editor/templates/menus/MenuItemTemplate";
    export { HTMLEMenuTemplateDescription };
    export { HTMLEMenuTemplate };
    type HTMLEMenuTemplateDescription = Partial<Pick<HTMLEMenuElement, 'id' | 'className' | 'name'>> & {
        items: (HTMLEMenuItemTemplateDescription | HTMLEMenuItemGroupTemplateDescription)[];
    };
    interface HTMLEMenuTemplate {
        (desc: HTMLEMenuTemplateDescription): HTMLEMenuElement;
    }
    const HTMLEMenuTemplate: HTMLEMenuTemplate;
}
declare module "editor/templates/menus/MenuItemTemplate" {
    import { HTMLEMenuItemElement } from "editor/elements/lib/containers/menus/MenuItem";
    import { Key, KeyModifier } from "editor/Input";
    import { HTMLEMenuTemplateDescription } from "editor/templates/menus/MenuTemplate";
    export { HTMLEMenuItemTemplateDescription };
    export { HTMLEMenuItemTemplate };
    type HTMLEMenuItemTemplateDescription = Pick<HTMLEMenuItemElement, 'name'> & Partial<Pick<HTMLEMenuItemElement, 'id' | 'className' | 'title' | 'type' | 'disabled'>> & {
        label?: string;
        icon?: string;
        command?: string;
        commandArgs?: any;
        hotkey?: {
            key: Key;
            mod1?: KeyModifier;
            mod2?: KeyModifier;
        };
        value?: string;
        checked?: boolean;
        statekey?: string;
        menu?: HTMLEMenuTemplateDescription;
        disabled?: boolean;
    };
    interface HTMLEMenuItemTemplate {
        (args: HTMLEMenuItemTemplateDescription): HTMLEMenuItemElement;
    }
    const HTMLEMenuItemTemplate: HTMLEMenuItemTemplate;
}
declare module "editor/templates/menus/MenubarTemplate" {
    import { HTMLEMenuBarElement } from "editor/elements/lib/containers/menus/MenuBar";
    import { HTMLEMenuItemTemplateDescription } from "editor/templates/menus/MenuItemTemplate";
    export { HTMLEMenubarTemplateDescription };
    export { HTMLEMenubarTemplate };
    type HTMLEMenubarTemplateDescription = Partial<Pick<HTMLEMenuBarElement, 'id' | 'className' | 'tabIndex'>> & {
        items: HTMLEMenuItemTemplateDescription[];
    };
    interface HTMLEMenubarTemplate {
        (desc: HTMLEMenubarTemplateDescription): HTMLEMenuBarElement;
    }
    const HTMLEMenubarTemplate: HTMLEMenubarTemplate;
}
declare module "editor/Editor" {
    import { Command } from "libs/commands/Command";
    import { EEvent, EventDispatcher } from "libs/events/EventDispatcher";
    import { HTMLEMenuBarElement } from "editor/elements/lib/containers/menus/MenuBar";
    import { HTMLEStatusBarElement } from "editor/elements/lib/containers/status/StatusBar";
    import { HotKey } from "editor/Input";
    export { Editor };
    export { EditorBase };
    export { EditorCommand };
    export { EditorHotKey };
    type EditorEventsMap = {
        "e-context-change": EEvent<"e-context-change">;
    };
    interface Editor extends EventDispatcher<EditorEventsMap> {
        getState(key: string): any;
        setState(key: string, value: any): void;
        addStateListener(statekey: string, listener: (newValue: any) => void): number;
        removeStateListener(statekey: string, listener: (newValue: any) => void): void;
        addHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
        removeHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
        readonly statusbar: HTMLEStatusBarElement | null;
        readonly menubar: HTMLEMenuBarElement | null;
        registerCommand(name: string, command: EditorCommand): void;
        executeCommand(name: string, args?: any, opts?: {
            undo?: boolean;
        }): void;
        undoLastCommand(): void;
        redoLastCommand(): void;
        setContext(context: string): void;
        setup(): Promise<void>;
    }
    interface EditorCommand extends Command {
        context: string;
    }
    interface EditorHotKey extends HotKey {
    }
    class EditorBase<State extends object> extends EventDispatcher<EditorEventsMap> implements Editor {
        private _commands;
        private _hotkeys;
        private _undoCommandsCallStack;
        private _redoCommandsCallStack;
        private _context;
        private _state;
        private _stateListeners;
        menubar: HTMLEMenuBarElement | null;
        statusbar: HTMLEStatusBarElement | null;
        constructor();
        get context(): string;
        setup(): Promise<any>;
        setContext(context: string): void;
        getState(key: string): any;
        setState(key: string, value: any): void;
        addStateListener(statekey: string, listener: (newValue: any) => void): number;
        removeStateListener(statekey: string, listener: (newValue: any) => void): void;
        registerCommand(name: string, command: EditorCommand): void;
        executeCommand(name: string, args?: any, opts?: {
            undo?: boolean;
        }): void;
        undoLastCommand(): void;
        redoLastCommand(): void;
        addHotkeyExec(hotkey: EditorHotKey, exec: () => void): number;
        removeHotkeyExec(hotkey: EditorHotKey, exec: () => void): void;
    }
}
declare module "samples/scenes/Mockup" {
    import "editor/elements/lib/containers/menus/Menu";
    import "editor/elements/lib/containers/menus/MenuButton";
    import "editor/elements/lib/containers/menus/MenuBar";
    import "editor/elements/lib/containers/menus/MenuItem";
    import "editor/elements/lib/containers/menus/MenuItemGroup";
    import "editor/elements/lib/containers/tabs/Tab";
    import "editor/elements/lib/containers/tabs/TabList";
    import "editor/elements/lib/containers/tabs/TabPanel";
    import "editor/elements/lib/controls/draggable/Draggable";
    import "editor/elements/lib/controls/draggable/Dragzone";
    import "editor/elements/lib/controls/draggable/Dropzone";
    import "editor/elements/lib/controls/draggable/DropzoneInput";
    import "editor/elements/lib/utils/Import";
    import "editor/elements/lib/utils/Loader";
    import "editor/elements/lib/utils/WidthSash";
    import "editor/elements/lib/utils/HeightSash";
    import "editor/elements/lib/containers/treeview/TreeViewList";
    import "editor/elements/lib/containers/treeview/TreeViewItem";
    import "editor/elements/lib/controls/breadcrumb/BreadcrumbItem";
    import "editor/elements/lib/controls/breadcrumb/BreadcrumbTrail";
    global {
        var marked: (src: string) => string;
    }
    export function mockup(): Promise<void>;
}
declare module "samples/Sandbox" {
    export function sandbox(): Promise<void>;
}
declare module "boot" {
    export function boot(): Promise<void>;
}
declare module "editor/Application" { }
declare module "editor/elements/forms/Snippets" {
    export { FormState };
    export { getFormState };
    export { setFormState };
    interface FormState {
        [name: string]: ({
            type: "checkbox";
            checked: boolean;
        } | {
            type: "radio";
            nodes: [{
                value: string;
                checked: boolean;
            }];
        } | {
            value: string;
        });
    }
    const getFormState: (form: HTMLFormElement) => FormState;
    const setFormState: (form: HTMLFormElement, state: FormState) => void;
}
declare module "editor/elements/forms/StructuredFormData" {
    export { StructuredFormData };
    class StructuredFormData {
        form: HTMLFormElement;
        constructor(form: HTMLFormElement);
        private resolveElementScope;
        getScopedData(): object;
    }
}
declare module "editor/elements/lib/builtins/inputs/NumberInput" {
    export { NumberInputElement };
    class NumberInputElement extends HTMLInputElement {
        cache: string;
        constructor();
        isValueValid(value: string): boolean;
        parseValue(value: string): string;
        connectedCallback(): void;
    }
}
declare module "editor/elements/lib/containers/panels/Panel" {
    export { PanelElement };
    class PanelElement extends HTMLElement {
        label: string;
        state: 'opened' | 'closed';
        constructor();
        render(): Promise<void>;
        connectedCallback(): void;
    }
}
declare module "editor/elements/lib/containers/panels/PanelGroup" {
    export { PanelGroupElement };
    class PanelGroupElement extends HTMLElement {
        label: string;
        state: 'opened' | 'closed';
        static readonly observedAttributes: string[];
        constructor();
        connectedCallback(): void;
    }
}
declare module "editor/elements/lib/containers/toolbar/Toolbar" {
    export { HTMLEMenuBarElement };
    export { isHTMLEMenuBarElement };
    function isHTMLEMenuBarElement(elem: Element): elem is HTMLEMenuBarElement;
    class HTMLEMenuBarElement extends HTMLElement {
    }
}
declare module "editor/elements/lib/containers/toolbar/ToolbarItem" {
    export { HTMLEMenuItemElement };
    export { isHTMLEMenuItemElement };
    function isHTMLEMenuItemElement(elem: Element): elem is HTMLEMenuItemElement;
    class HTMLEMenuItemElement extends HTMLElement {
    }
}
declare module "editor/elements/lib/containers/toolbar/ToolbarItemGroup" {
    export { isHTMLEMenuItemGroupElement };
    export { HTMLEMenuItemGroupElement };
    function isHTMLEMenuItemGroupElement(elem: Element): elem is HTMLEMenuItemGroupElement;
    class HTMLEMenuItemGroupElement extends HTMLElement {
    }
}
declare module "editor/elements/lib/math/Vector3Input" {
    import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
    export { Vector3InputElement };
    class Vector3InputElement extends HTMLElement {
        readonly vector: Vector3;
        label: string;
        tooltip: string;
        constructor();
        refresh(): void;
        connectedCallback(): void;
    }
}
declare module "editor/elements/lib/misc/Palette" {
    export { PaletteElement };
    class PaletteElement extends HTMLElement {
        colors: Array<string>;
        constructor();
        connectedCallback(): void;
    }
}
declare module "editor/objects/StructuredFormData" {
    export { StructuredFormData };
    class StructuredFormData {
        form: HTMLFormElement;
        constructor(form: HTMLFormElement);
        getStructuredFormData(): {};
    }
}
declare module "editor/templates/other/DraggableInputTemplate" {
    import { HTMLEDraggableElement } from "editor/elements/lib/controls/draggable/Draggable";
    export { HTMLDraggableInputTemplateDescription };
    export { HTMLDraggableInputTemplate };
    type HTMLDraggableInputTemplateDescription = Partial<Pick<HTMLEDraggableElement, 'id' | 'className'>> & Partial<Pick<HTMLInputElement, 'name'>>;
    interface HTMLDraggableInputTemplate {
        (desc: HTMLDraggableInputTemplateDescription): HTMLEDraggableElement;
    }
    const HTMLDraggableInputTemplate: HTMLDraggableInputTemplate;
}
declare module "editor/templates/table/TableTemplate" {
    export { HTMLTableTemplateDescription };
    export { HTMLTableTemplate };
    type HTMLTableTemplateDescription = Partial<Pick<HTMLTableElement, "id" | "className">> & {
        headerCells: (string | Node)[];
        bodyCells: ((string | Node) | {
            type: "header" | "data" | undefined;
            content: Node | string;
        })[][];
        footerCells: (string | Node | {
            type: "header" | "data" | undefined;
            content: Node | string;
        })[];
    };
    interface HTMLTableTemplate {
        (desc: HTMLTableTemplateDescription): HTMLTableElement;
    }
    const HTMLTableTemplate: HTMLTableTemplate;
}
