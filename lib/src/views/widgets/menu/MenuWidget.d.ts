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
    "__#9496@#template": HTMLElement;
    "__#9496@#walker": TreeWalker;
    "__#9496@#toggleTimeouts": WeakMap<HTMLElement, {
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
    "__#9496@#walkerNodeFilter"(node: Node): number;
    "__#9496@#collapseSubmenus"(menu: HTMLElement): void;
    "__#9496@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#9496@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#9496@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#9496@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#9496@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#9496@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#9496@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#9496@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#9496@#setItemTimeout"(item: HTMLElement, delay?: number | undefined): Promise<void>;
    "__#9496@#clearItemTimeout"(item: HTMLElement): void;
    "__#9496@#handleClickEvent"(event: MouseEvent): void;
    "__#9496@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#9496@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#9496@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#9496@#handleMouseOverEvent"(event: MouseEvent): void;
};
