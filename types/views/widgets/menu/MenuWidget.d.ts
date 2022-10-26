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
    "__#60@#template": HTMLElement;
    "__#60@#walker": TreeWalker;
    "__#60@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#60@#walkerNodeFilter"(node: Node): number;
    "__#60@#collapseSubmenus"(menu: HTMLElement): void;
    "__#60@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#60@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#60@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#60@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#60@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#60@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#60@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#60@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#60@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#60@#clearItemTimeout"(item: HTMLElement): void;
    "__#60@#handleClickEvent"(event: MouseEvent): void;
    "__#60@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#60@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#60@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#60@#handleMouseOverEvent"(event: MouseEvent): void;
};
