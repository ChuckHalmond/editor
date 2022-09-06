import { WidgetFactory } from "../Widget";
export { menuWidget };
declare global {
    interface WidgetNameMap {
        "menu": MenuWidgetFactory;
    }
}
interface MenuWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        contextual?: boolean;
        position?: {
            x: number;
            y: number;
        };
    }): HTMLElement;
    setPosition(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
}
declare var menuWidget: {
    "__#47@#template": HTMLElement;
    "__#47@#walker": TreeWalker;
    "__#47@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        contextual?: boolean;
        position?: {
            x: number;
            y: number;
        };
    }): HTMLElement;
    slot(menu: HTMLElement): HTMLElement | null;
    setPosition(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#47@#walkerNodeFilter"(node: Node): number;
    "__#47@#collapseSubmenus"(menu: HTMLElement): void;
    "__#47@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#47@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#47@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#47@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#47@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#47@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#47@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#47@#clearItemTimeout"(item: HTMLElement): void;
    "__#47@#handleClickEvent"(event: MouseEvent): void;
    "__#47@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#47@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#47@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#47@#handleMouseOverEvent"(event: MouseEvent): void;
};
