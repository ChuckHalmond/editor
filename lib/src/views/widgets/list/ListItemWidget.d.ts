import { WidgetFactory } from "../Widget";
export { listItemWidget };
interface ListItemWidgetFactory extends WidgetFactory {
    create(init?: {
        label?: string;
        disabled?: boolean;
    }): HTMLElement;
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
}
declare global {
    interface WidgetNameMap {
        "listitem": ListItemWidgetFactory;
    }
}
declare var listItemWidget: {
    "__#49@#template": HTMLElement;
    create(init?: {
        label?: string;
        disabled?: boolean;
    }): HTMLElement;
    slot(root: HTMLElement): HTMLElement | null;
    group(item: HTMLElement): HTMLElement | null;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    setPosInSet(item: HTMLElement, value: number): void;
    getPosInSet(item: HTMLElement): number;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    setDropTarget(item: HTMLElement, value: boolean): void;
    getDropTarget(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setSelected(row: HTMLElement, value: boolean): void;
    getSelected(row: HTMLElement): boolean;
    "__#49@#label"(item: HTMLElement): Node;
    readonly slots: string[];
};
