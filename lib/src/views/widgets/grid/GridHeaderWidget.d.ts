import { WidgetFactory } from "../Widget";
export { gridHeaderWidget };
interface GridHeaderWidgetFactory extends WidgetFactory {
    create(init: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
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
declare var gridHeaderWidget: {
    "__#58@#template": HTMLElement;
    create(init?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        label?: string | undefined;
    } | undefined): HTMLElement;
    slot(header: HTMLElement): HTMLElement | null;
    getLabel(header: HTMLElement): string;
    setLabel(header: HTMLElement, value: string): void;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    "__#58@#label"(header: HTMLElement): HTMLElement;
};
