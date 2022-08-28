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
    "__#48@#template": HTMLElement;
    "__#48@#walker": TreeWalker;
    "__#48@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#48@#walkerNodeFilter"(node: Node): number;
    "__#48@#collapseSubmenus"(menu: HTMLElement): void;
    "__#48@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#48@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#48@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#48@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#48@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#48@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#48@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#48@#clearItemTimeout"(item: HTMLElement): void;
    "__#48@#handleClickEvent"(event: MouseEvent): void;
    "__#48@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#48@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#48@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#48@#handleMouseOverEvent"(event: MouseEvent): void;
};
