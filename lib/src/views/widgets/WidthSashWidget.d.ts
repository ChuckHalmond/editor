import { WidgetFactory } from "./Widget";
export { widthSashWidget };
declare global {
    interface WidgetNameMap {
        "widthsash": WidthSashWidgetFactory;
    }
}
interface WidthSashWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        controls?: string;
        growDir?: "left" | "right";
    }): HTMLElement;
}
declare var widthSashWidget: {
    "__#60@#template": HTMLElement;
    "__#60@#targets": WeakMap<HTMLElement, HTMLElement | null>;
    "__#60@#onCaptureFlags": WeakMap<HTMLElement, boolean>;
    "__#60@#queuedPointerCallbacks": WeakMap<HTMLElement, FrameRequestCallback | null>;
    "__#60@#pointerMovements": WeakMap<HTMLElement, number>;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        controls?: string;
        growDir?: "left" | "right";
    }): HTMLElement;
    getGrowDir(sash: HTMLElement): "right" | "left";
    setGrowDir(sash: HTMLElement, value: "right" | "left"): void;
    getControls(sash: HTMLElement): string | null;
    setControls(sash: HTMLElement, value: string): void;
    setWidth(sash: HTMLElement, width: number): void;
    "__#60@#handlePointerUpEvent"(event: PointerEvent): void;
    "__#60@#handlePointerDownEvent"(event: PointerEvent): void;
    "__#60@#handlePointerMoveEvent"(event: PointerEvent): void;
    "__#60@#pointerMoveCallback"(sash: HTMLElement): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
