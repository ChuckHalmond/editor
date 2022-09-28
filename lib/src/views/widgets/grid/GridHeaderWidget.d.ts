import { WidgetFactory } from "../Widget";
export { gridHeaderWidget };
interface GridHeaderWidgetFactory extends WidgetFactory {
    create(init: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
}
declare global {
    interface WidgetNameMap {
        "gridheader": GridHeaderWidgetFactory;
    }
}
declare var gridHeaderWidget: {
    "__#64@#template": HTMLElement;
    create(init?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    slot(header: HTMLElement): HTMLElement | null;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
};
