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
    "__#40@#template": HTMLElement;
    "__#40@#walker": TreeWalker;
    "__#40@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#40@#walkerNodeFilter"(node: Node): number;
    "__#40@#collapseSubmenus"(menu: HTMLElement): void;
    "__#40@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#40@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#40@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#40@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#40@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#40@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#40@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#40@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#40@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#40@#clearItemTimeout"(item: HTMLElement): void;
    "__#40@#handleClickEvent"(event: MouseEvent): void;
    "__#40@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#40@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#40@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#40@#handleMouseOverEvent"(event: MouseEvent): void;
};
