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
    "__#16@#template": HTMLElement;
    "__#16@#walker": TreeWalker;
    "__#16@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#16@#walkerNodeFilter"(node: Node): number;
    "__#16@#collapseSubmenus"(menu: HTMLElement): void;
    "__#16@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#16@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#16@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#16@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#16@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#16@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#16@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#16@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#16@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#16@#clearItemTimeout"(item: HTMLElement): void;
    "__#16@#handleClickEvent"(event: MouseEvent): void;
    "__#16@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#16@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#16@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#16@#handleMouseOverEvent"(event: MouseEvent): void;
};
