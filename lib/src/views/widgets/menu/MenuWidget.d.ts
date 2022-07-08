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
    "__#17144@#template": HTMLElement;
    "__#17144@#walker": TreeWalker;
    "__#17144@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(init?: {
        contextual?: boolean | undefined;
    } | undefined): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#17144@#walkerNodeFilter"(node: Node): number;
    "__#17144@#collapseSubmenus"(menu: HTMLElement): void;
    "__#17144@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#17144@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#17144@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#17144@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#17144@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#17144@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#17144@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#17144@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#17144@#setItemTimeout"(item: HTMLElement, delay?: number | undefined): Promise<void>;
    "__#17144@#clearItemTimeout"(item: HTMLElement): void;
    "__#17144@#handleClickEvent"(event: MouseEvent): void;
    "__#17144@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#17144@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#17144@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#17144@#handleMouseOverEvent"(event: MouseEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
