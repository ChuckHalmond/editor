import { WidgetFactory } from "../Widget";
export { gridCellWidget };
interface GridCellWidgetFactory extends WidgetFactory {
    create(init: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        disabled?: boolean;
        headers?: string;
    }): HTMLElement;
    getHeaders(item: HTMLElement): string;
    setHeaders(item: HTMLElement, value: string): void;
    setPosInSet(item: HTMLElement, value: number): void;
    getPosInSet(item: HTMLElement): number;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    setDropTarget(item: HTMLElement, value: boolean): void;
    getDropTarget(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setSelected(item: HTMLElement, value: boolean): void;
    getSelected(item: HTMLElement): boolean;
}
declare global {
    interface WidgetNameMap {
        "gridcell": GridCellWidgetFactory;
    }
}
declare var gridCellWidget: {
    "__#57@#template": HTMLElement;
    create(init?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        disabled?: boolean | undefined;
        headers?: string | undefined;
    } | undefined): HTMLElement;
    slot(cell: HTMLElement): HTMLElement | null;
    getHeaders(item: HTMLElement): string;
    setHeaders(item: HTMLElement, value: string): void;
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
    setSelected(item: HTMLElement, value: boolean): void;
    getSelected(item: HTMLElement): boolean;
    "__#57@#label"(item: HTMLElement): HTMLElement;
};
