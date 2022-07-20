import { WidgetFactory } from "../Widget";
export { gridcellWidget };
interface GridHeaderWidgetFactory extends WidgetFactory {
    create(init: {
        label?: string;
    }): HTMLElement;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
}
declare global {
    interface WidgetNameMap {
        "gridheader": GridHeaderWidgetFactory;
    }
}
declare var gridcellWidget: {
    "__#58@#template": HTMLElement;
    create(init?: {
        label?: string;
    }): HTMLElement;
    getLabel(header: HTMLElement): string;
    setLabel(header: HTMLElement, value: string): void;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    "__#58@#label"(header: HTMLElement): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};