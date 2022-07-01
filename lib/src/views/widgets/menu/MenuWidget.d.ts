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
    "__#49@#template": HTMLElement;
    "__#49@#walker": TreeWalker;
    "__#49@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(init?: {
        contextual?: boolean;
    }): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#49@#walkerNodeFilter"(node: Node): number;
    "__#49@#collapseSubmenus"(menu: HTMLElement): void;
    "__#49@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#49@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#49@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#49@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#49@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#49@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#49@#setItemTimeout"(item: HTMLElement, delay?: number): Promise<void>;
    "__#49@#clearItemTimeout"(item: HTMLElement): void;
    "__#49@#handleClickEvent"(event: MouseEvent): void;
    "__#49@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#49@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#49@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#49@#handleMouseOverEvent"(event: MouseEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
