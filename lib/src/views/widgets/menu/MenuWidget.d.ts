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
    "__#39@#template": HTMLElement;
    "__#39@#walker": TreeWalker;
    "__#39@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#39@#walkerNodeFilter"(node: Node): number;
    "__#39@#collapseSubmenus"(menu: HTMLElement): void;
    "__#39@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#39@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#39@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#39@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#39@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#39@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#39@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#39@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#39@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#39@#clearItemTimeout"(item: HTMLElement): void;
    "__#39@#handleClickEvent"(event: MouseEvent): void;
    "__#39@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#39@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#39@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#39@#handleMouseOverEvent"(event: MouseEvent): void;
};
