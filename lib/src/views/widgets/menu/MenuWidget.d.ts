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
    "__#22602@#template": HTMLElement;
    "__#22602@#walker": TreeWalker;
    "__#22602@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(init?: {
        contextual?: boolean | undefined;
    } | undefined): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#22602@#walkerNodeFilter"(node: Node): number;
    "__#22602@#collapseSubmenus"(menu: HTMLElement): void;
    "__#22602@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#22602@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#22602@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#22602@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#22602@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#22602@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#22602@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#22602@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#22602@#setItemTimeout"(item: HTMLElement, delay?: number | undefined): Promise<void>;
    "__#22602@#clearItemTimeout"(item: HTMLElement): void;
    "__#22602@#handleClickEvent"(event: MouseEvent): void;
    "__#22602@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#22602@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#22602@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#22602@#handleMouseOverEvent"(event: MouseEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
