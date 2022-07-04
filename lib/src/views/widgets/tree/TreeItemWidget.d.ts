import { WidgetFactory } from "../Widget";
export { treeitemWidget };
declare type TreeItemType = "parent" | "leaf";
interface TreeItemWidgetFactory extends WidgetFactory {
    create(init?: {
        type: TreeItemType;
        label?: string;
        disabled?: boolean;
        draggable?: boolean;
    }): HTMLElement;
    group(item: HTMLElement): HTMLElement | null;
    setPosInSet(item: HTMLElement, value: number): void;
    getPosInSet(item: HTMLElement): number;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    setDropTarget(item: HTMLElement, value: boolean): void;
    getDropTarget(item: HTMLElement): boolean;
    setSelected(item: HTMLElement, value: boolean): void;
    getSelected(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    setDraggable(row: HTMLElement, value: boolean): void;
    getDraggable(item: HTMLElement): boolean;
    getType(item: HTMLElement): TreeItemType | null;
    setType(item: HTMLElement, value: TreeItemType): void;
    toggle(item: HTMLElement, force?: boolean): void;
}
declare global {
    interface WidgetNameMap {
        "treeitem": TreeItemWidgetFactory;
    }
}
declare var treeitemWidget: {
    "__#18927@#template": HTMLElement;
    "__#18927@#types": TreeItemType[];
    group(item: HTMLElement): HTMLElement | null;
    create(init?: {
        type: TreeItemType;
        label?: string | undefined;
        disabled?: boolean | undefined;
        draggable?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(item: HTMLElement, name: string | null): HTMLElement;
    "__#18927@#content"(item: HTMLElement): HTMLElement;
    "__#18927@#label"(item: HTMLElement): HTMLElement;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    setPosInSet(item: HTMLElement, value: number): void;
    getPosInSet(item: HTMLElement): number;
    getType(item: HTMLElement): TreeItemType | null;
    setType(item: HTMLElement, type: TreeItemType): void;
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    setDropTarget(item: HTMLElement, value: boolean): void;
    getDropTarget(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setDraggable(item: HTMLElement, value: boolean): void;
    getDraggable(item: HTMLElement): boolean;
    setSelected(item: HTMLElement, value: boolean): void;
    getSelected(item: HTMLElement): boolean;
    setLevel(item: HTMLElement, value: number): void;
    getLevel(item: HTMLElement): number;
    toggle(item: HTMLElement, force?: boolean | undefined): void;
    "__#18927@#handleClickEvent"(event: MouseEvent): void;
    readonly slots: string[];
};
