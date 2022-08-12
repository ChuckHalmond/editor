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
    "__#55@#template": HTMLElement;
    "__#55@#targets": WeakMap<HTMLElement, HTMLElement | null>;
    "__#55@#onCaptureFlags": WeakMap<HTMLElement, boolean>;
    "__#55@#queuedPointerCallbacks": WeakMap<HTMLElement, FrameRequestCallback | null>;
    "__#55@#pointerMovements": WeakMap<HTMLElement, number>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        controls?: string | undefined;
        growDir?: "left" | "right" | undefined;
    } | undefined): HTMLElement;
    getGrowDir(sash: HTMLElement): "right" | "left";
    setGrowDir(sash: HTMLElement, value: "right" | "left"): void;
    getControls(sash: HTMLElement): string | null;
    setControls(sash: HTMLElement, value: string): void;
    setWidth(sash: HTMLElement, width: number): void;
    "__#55@#handlePointerUpEvent"(event: PointerEvent): void;
    "__#55@#handlePointerDownEvent"(event: PointerEvent): void;
    "__#55@#handlePointerMoveEvent"(event: PointerEvent): void;
    "__#55@#pointerMoveCallback"(sash: HTMLElement): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
