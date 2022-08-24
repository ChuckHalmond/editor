import { WidgetFactory } from "../Widget";
export { gridRowWidget };
interface GridRowWidgetFactory extends WidgetFactory {
    create(init?: {
        disabled?: boolean;
    }): HTMLElement;
    cells(row: HTMLElement): HTMLElement[];
    setPosInSet(row: HTMLElement, value: number): void;
    getPosInSet(row: HTMLElement): number;
    setActive(row: HTMLElement, value: boolean): void;
    getActive(row: HTMLElement): boolean;
    setDropTarget(row: HTMLElement, value: boolean): void;
    getDropTarget(row: HTMLElement): boolean;
    setSelected(row: HTMLElement, value: boolean): void;
    getSelected(row: HTMLElement): boolean;
    setDisabled(row: HTMLElement, value: boolean): void;
    getDisabled(row: HTMLElement): boolean;
}
declare global {
    interface WidgetNameMap {
        "gridrow": GridRowWidgetFactory;
    }
}
declare var gridRowWidget: {
    "__#63@#template": HTMLElement;
    create(init?: {
        disabled?: boolean;
    }): HTMLElement;
    slot(row: HTMLElement): HTMLElement | null;
    cells(row: HTMLElement): HTMLElement[];
    setPosInSet(row: HTMLElement, value: number): void;
    getPosInSet(row: HTMLElement): number;
    setActive(row: HTMLElement, value: boolean): void;
    getActive(row: HTMLElement): boolean;
    setDropTarget(row: HTMLElement, value: boolean): void;
    getDropTarget(row: HTMLElement): boolean;
    setDisabled(row: HTMLElement, value: boolean): void;
    getDisabled(row: HTMLElement): boolean;
    setSelected(row: HTMLElement, value: boolean): void;
    getSelected(row: HTMLElement): boolean;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
};
