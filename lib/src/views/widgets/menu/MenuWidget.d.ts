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
    "__#38@#template": HTMLElement;
    "__#38@#walker": TreeWalker;
    "__#38@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#38@#walkerNodeFilter"(node: Node): number;
    "__#38@#collapseSubmenus"(menu: HTMLElement): void;
    "__#38@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#38@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#38@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#38@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#38@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#38@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#38@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#38@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#38@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#38@#clearItemTimeout"(item: HTMLElement): void;
    "__#38@#handleClickEvent"(event: MouseEvent): void;
    "__#38@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#38@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#38@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#38@#handleMouseOverEvent"(event: MouseEvent): void;
};
