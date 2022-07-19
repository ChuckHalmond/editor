import { WidgetFactory } from "../Widget";
export { menuWidget };
declare global {
    interface WidgetNameMap {
        "menu": MenuWidgetFactory;
    }
}
interface MenuWidgetFactory extends WidgetFactory {
    create(properties?: {
        contextual?: boolean;
    }): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
}
declare var menuWidget: {
    "__#17277@#template": HTMLElement;
    "__#17277@#walker": TreeWalker;
    "__#17277@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(init?: {
        contextual?: boolean;
    }): HTMLElement;
    slot(menu: HTMLElement): HTMLElement | null;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#17277@#walkerNodeFilter"(node: Node): number;
    "__#17277@#collapseSubmenus"(menu: HTMLElement): void;
    "__#17277@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#17277@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#17277@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#17277@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#17277@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#17277@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#17277@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#17277@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#17277@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#17277@#clearItemTimeout"(item: HTMLElement): void;
    "__#17277@#handleClickEvent"(event: MouseEvent): void;
    "__#17277@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#17277@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#17277@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#17277@#handleMouseOverEvent"(event: MouseEvent): void;
};
