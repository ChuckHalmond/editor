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
    }): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
}
declare var menuWidget: {
    "__#44@#template": HTMLElement;
    "__#44@#walker": TreeWalker;
    "__#44@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        contextual?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(menu: HTMLElement): HTMLElement | null;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#44@#walkerNodeFilter"(node: Node): number;
    "__#44@#collapseSubmenus"(menu: HTMLElement): void;
    "__#44@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#44@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#44@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#44@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#44@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#44@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#44@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#44@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#44@#setItemTimeout"(item: HTMLElement, delay?: number | undefined): Promise<void>;
    "__#44@#clearItemTimeout"(item: HTMLElement): void;
    "__#44@#handleClickEvent"(event: MouseEvent): void;
    "__#44@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#44@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#44@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#44@#handleMouseOverEvent"(event: MouseEvent): void;
};
