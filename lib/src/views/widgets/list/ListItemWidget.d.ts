import { WidgetFactory } from "../Widget";
export { listitemWidget };
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
declare var listitemWidget: {
    "__#28411@#template": HTMLElement;
    create(init?: {
        label?: string;
        disabled?: boolean;
    }): HTMLElement;
    group(item: HTMLElement): HTMLElement | null;
    "__#28411@#label"(item: HTMLElement): HTMLElement;
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
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
