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
    "__#52@#template": HTMLElement;
    "__#52@#walker": TreeWalker;
    "__#52@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#52@#walkerNodeFilter"(node: Node): number;
    "__#52@#collapseSubmenus"(menu: HTMLElement): void;
    "__#52@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#52@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#52@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#52@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#52@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#52@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#52@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#52@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#52@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#52@#clearItemTimeout"(item: HTMLElement): void;
    "__#52@#handleClickEvent"(event: MouseEvent): void;
    "__#52@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#52@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#52@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#52@#handleMouseOverEvent"(event: MouseEvent): void;
};
