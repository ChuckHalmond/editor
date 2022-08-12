import { ReactiveChildElements } from "../../elements/Element";
export { WidgetFactoryConstructor };
export { widget };
export { Widget };
export { WidgetFactory };
export { widgets };
declare global {
    interface WidgetNameMap {
    }
}
interface WidgetFactoryConstructor {
    prototype: WidgetFactory;
    new (): WidgetFactory;
}
interface WidgetFactory {
    create(properties?: object): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
}
declare var WidgetFactory: WidgetFactoryConstructor;
declare var widgets: Map<string, WidgetFactory>;
interface WidgetInit<K extends keyof WidgetNameMap> {
    properties?: Parameters<WidgetNameMap[K]["create"]>[0];
    attributes?: {
        [name: string]: number | string | boolean;
    };
    dataset?: {
        [property: string]: string | number | boolean;
    };
    slotted?: {
        [slot: string]: Node | string | (Node | string)[] | NodeList | ReactiveChildElements;
    } | (Node | string | (Node | string)[] | NodeList | ReactiveChildElements);
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];
    };
}
declare function widget<K extends keyof WidgetNameMap>(name: K, init?: WidgetInit<K>): ReturnType<WidgetNameMap[K]["create"]>;
interface WidgetDecorator {
    (init: {
        name: string;
    }): <W extends WidgetFactoryConstructor>(widget: W) => W;
}
declare const Widget: WidgetDecorator;
