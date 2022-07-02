import { WidgetFactory } from "../Widget";
export { treeitemWidget };
declare type TreeItemType = "parent" | "leaf";
interface TreeItemWidgetFactory extends WidgetFactory {
    create(init?: {
        type: TreeItemType;
        label?: string;
        disabled?: boolean;
    }): HTMLElement;
    getGroup(item: HTMLElement): HTMLElement | null;
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
    "__#48@#arrowPartTemplate": HTMLElement;
    "__#48@#template": HTMLElement;
    "__#48@#types": TreeItemType[];
    "__#48@#typesFeatures": {
        parent: {
            role: string;
            hasArrow: boolean;
        };
        leaf: {
            role: string;
            hasArrow: boolean;
        };
    };
    getGroup(item: HTMLElement): HTMLElement | null;
    create(init?: {
        type: TreeItemType;
        label?: string | undefined;
        disabled?: boolean | undefined;
    } | undefined): HTMLElement;
    "__#48@#label"(item: HTMLElement): HTMLElement;
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
    setSelected(item: HTMLElement, value: boolean): void;
    getSelected(item: HTMLElement): boolean;
    setLevel(item: HTMLElement, value: number): void;
    getLevel(item: HTMLElement): number;
    toggle(item: HTMLElement, force?: boolean | undefined): void;
    "__#48@#handleClickEvent"(event: MouseEvent): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
