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
    "__#58@#template": HTMLElement;
    "__#58@#targets": WeakMap<HTMLElement, HTMLElement | null>;
    "__#58@#onCaptureFlags": WeakMap<HTMLElement, boolean>;
    "__#58@#queuedPointerCallbacks": WeakMap<HTMLElement, FrameRequestCallback | null>;
    "__#58@#pointerMovements": WeakMap<HTMLElement, number>;
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
    "__#58@#handlePointerUpEvent"(event: PointerEvent): void;
    "__#58@#handlePointerDownEvent"(event: PointerEvent): void;
    "__#58@#handlePointerMoveEvent"(event: PointerEvent): void;
    "__#58@#pointerMoveCallback"(sash: HTMLElement): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
