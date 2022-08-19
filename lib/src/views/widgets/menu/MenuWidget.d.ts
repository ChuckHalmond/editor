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
    "__#19@#template": HTMLElement;
    "__#19@#walker": TreeWalker;
    "__#19@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#19@#walkerNodeFilter"(node: Node): number;
    "__#19@#collapseSubmenus"(menu: HTMLElement): void;
    "__#19@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#19@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#19@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#19@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#19@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#19@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#19@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#19@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#19@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#19@#clearItemTimeout"(item: HTMLElement): void;
    "__#19@#handleClickEvent"(event: MouseEvent): void;
    "__#19@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#19@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#19@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#19@#handleMouseOverEvent"(event: MouseEvent): void;
};
