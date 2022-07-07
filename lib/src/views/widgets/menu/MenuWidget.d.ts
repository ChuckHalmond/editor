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
    "__#14168@#template": HTMLElement;
    "__#14168@#walker": TreeWalker;
    "__#14168@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(init?: {
        contextual?: boolean;
    }): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#14168@#walkerNodeFilter"(node: Node): number;
    "__#14168@#collapseSubmenus"(menu: HTMLElement): void;
    "__#14168@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#14168@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#14168@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#14168@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#14168@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#14168@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#14168@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#14168@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#14168@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#14168@#clearItemTimeout"(item: HTMLElement): void;
    "__#14168@#handleClickEvent"(event: MouseEvent): void;
    "__#14168@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14168@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#14168@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#14168@#handleMouseOverEvent"(event: MouseEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
