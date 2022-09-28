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
    "__#46@#template": HTMLElement;
    "__#46@#walker": TreeWalker;
    "__#46@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#46@#walkerNodeFilter"(node: Node): number;
    "__#46@#collapseSubmenus"(menu: HTMLElement): void;
    "__#46@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#46@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#46@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#46@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#46@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#46@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#46@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#46@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#46@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#46@#clearItemTimeout"(item: HTMLElement): void;
    "__#46@#handleClickEvent"(event: MouseEvent): void;
    "__#46@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#46@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#46@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#46@#handleMouseOverEvent"(event: MouseEvent): void;
};
