import { WidgetFactory } from "../Widget";
export { gridCellWidget };
interface GridCellWidgetFactory extends WidgetFactory {
    create(init: {
        label?: string;
        disabled?: boolean;
        headers?: string;
    }): HTMLElement;
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
}
declare global {
    interface WidgetNameMap {
        "gridcell": GridCellWidgetFactory;
    }
}
declare var gridCellWidget: {
    "__#29033@#template": HTMLElement;
    create(init?: {
        label?: string | undefined;
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
    "__#29033@#label"(item: HTMLElement): HTMLElement;
};
