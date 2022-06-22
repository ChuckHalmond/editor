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
    "__#20549@#template": HTMLElement;
    "__#20549@#walker": TreeWalker;
    "__#20549@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(init?: {
        contextual?: boolean | undefined;
    } | undefined): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#20549@#walkerNodeFilter"(node: Node): number;
    "__#20549@#collapseSubmenus"(menu: HTMLElement): void;
    "__#20549@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#20549@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#20549@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#20549@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#20549@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#20549@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#20549@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#20549@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#20549@#setItemTimeout"(item: HTMLElement, delay?: number | undefined): Promise<void>;
    "__#20549@#clearItemTimeout"(item: HTMLElement): void;
    "__#20549@#handleClickEvent"(event: MouseEvent): void;
    "__#20549@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#20549@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#20549@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#20549@#handleMouseOverEvent"(event: MouseEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
