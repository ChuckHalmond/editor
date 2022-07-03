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
    "__#14052@#template": HTMLElement;
    "__#14052@#walker": TreeWalker;
    "__#14052@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(init?: {
        contextual?: boolean;
    }): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#14052@#walkerNodeFilter"(node: Node): number;
    "__#14052@#collapseSubmenus"(menu: HTMLElement): void;
    "__#14052@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#14052@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#14052@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#14052@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#14052@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#14052@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#14052@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#14052@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#14052@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#14052@#clearItemTimeout"(item: HTMLElement): void;
    "__#14052@#handleClickEvent"(event: MouseEvent): void;
    "__#14052@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14052@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#14052@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#14052@#handleMouseOverEvent"(event: MouseEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
