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
    "__#9@#template": HTMLElement;
    "__#9@#walker": TreeWalker;
    "__#9@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        contextual?: boolean | undefined;
        position?: {
            x: number;
            y: number;
        } | undefined;
    } | undefined): HTMLElement;
    slot(menu: HTMLElement): HTMLElement | null;
    setPosition(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#9@#walkerNodeFilter"(node: Node): number;
    "__#9@#collapseSubmenus"(menu: HTMLElement): void;
    "__#9@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#9@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#9@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#9@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#9@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#9@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#9@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#9@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#9@#setItemTimeout"(item: HTMLElement, delay?: number | undefined): Promise<void>;
    "__#9@#clearItemTimeout"(item: HTMLElement): void;
    "__#9@#handleClickEvent"(event: MouseEvent): void;
    "__#9@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#9@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#9@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#9@#handleMouseOverEvent"(event: MouseEvent): void;
};
