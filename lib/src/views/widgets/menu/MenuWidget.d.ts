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
        contextual?: boolean;
    }): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    getId(menu: HTMLElement): string;
    setId(menu: HTMLElement, value: string): void;
    items(menu: HTMLElement): HTMLElement[];
}
declare var menuWidget: {
    "__#50@#template": HTMLElement;
    "__#50@#walker": TreeWalker;
    "__#50@#toggleTimeouts": WeakMap<HTMLElement, {
        clear(): void;
    }>;
    create(properties?: {
        id?: string | undefined;
        contextual?: boolean | undefined;
    } | undefined): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    getId(menu: HTMLElement): string;
    setId(menu: HTMLElement, value: string): void;
    items(menu: HTMLElement): HTMLElement[];
    "__#50@#walkerNodeFilter"(node: Node): number;
    "__#50@#collapseSubmenus"(menu: HTMLElement): void;
    "__#50@#isClosestMenu"(menu: HTMLElement, target: HTMLElement): boolean;
    "__#50@#nearestItem"(menu: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#50@#firstItem"(menu: HTMLElement): HTMLElement | null;
    "__#50@#lastItem"(menu: HTMLElement): HTMLElement | null;
    "__#50@#previousItem"(item: HTMLElement): HTMLElement | null;
    "__#50@#nextItem"(item: HTMLElement): HTMLElement | null;
    "__#50@#firstChildItem"(item: HTMLElement): HTMLElement | null;
    "__#50@#getActiveItem"(menu: HTMLElement): HTMLElement | null;
    "__#50@#handleClickEvent"(event: MouseEvent): void;
    "__#50@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#50@#setItemTimeout"(item: HTMLElement, delay?: number | undefined): Promise<void>;
    "__#50@#clearItemTimeout"(item: HTMLElement): void;
    "__#50@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#50@#handleMouseOutEvent"(event: MouseEvent): void;
    "__#50@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#50@#handleTriggerEvent"(event: Event): void;
    slot(root: HTMLElement, name: string | null): HTMLElement;
    readonly slots: string[];
};
