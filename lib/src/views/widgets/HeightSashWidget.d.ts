import { WidgetFactory } from "./Widget";
export { heightSashWidget };
declare global {
    interface WidgetNameMap {
        "heightsash": HeightSashWidgetFactory;
    }
}
interface HeightSashWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        controls?: string;
        growDir?: "top" | "bottom";
    }): HTMLElement;
}
declare var heightSashWidget: {
    "__#61@#template": HTMLElement;
    "__#61@#targets": WeakMap<HTMLElement, HTMLElement | null>;
    "__#61@#onCaptureFlags": WeakMap<HTMLElement, boolean>;
    "__#61@#queuedPointerCallbacks": WeakMap<HTMLElement, FrameRequestCallback | null>;
    "__#61@#pointerMovements": WeakMap<HTMLElement, number>;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        controls?: string;
        growDir?: "top" | "bottom";
    }): HTMLElement;
    getGrowDir(sash: HTMLElement): "top" | "bottom";
    setGrowDir(sash: HTMLElement, value: "top" | "bottom"): void;
    getControls(sash: HTMLElement): string | null;
    setControls(sash: HTMLElement, value: string): void;
    setHeight(sash: HTMLElement, height: number): void;
    "__#61@#handlePointerUpEvent"(event: PointerEvent): void;
    "__#61@#handlePointerDownEvent"(event: PointerEvent): void;
    "__#61@#handlePointerMoveEvent"(event: PointerEvent): void;
    "__#61@#pointerMoveCallback"(sash: HTMLElement): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
