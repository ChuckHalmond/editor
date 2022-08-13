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
    "__#56@#template": HTMLElement;
    "__#56@#targets": WeakMap<HTMLElement, HTMLElement | null>;
    "__#56@#onCaptureFlags": WeakMap<HTMLElement, boolean>;
    "__#56@#queuedPointerCallbacks": WeakMap<HTMLElement, FrameRequestCallback | null>;
    "__#56@#pointerMovements": WeakMap<HTMLElement, number>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        controls?: string | undefined;
        growDir?: "top" | "bottom" | undefined;
    } | undefined): HTMLElement;
    getGrowDir(sash: HTMLElement): "top" | "bottom";
    setGrowDir(sash: HTMLElement, value: "top" | "bottom"): void;
    getControls(sash: HTMLElement): string | null;
    setControls(sash: HTMLElement, value: string): void;
    setHeight(sash: HTMLElement, height: number): void;
    "__#56@#handlePointerUpEvent"(event: PointerEvent): void;
    "__#56@#handlePointerDownEvent"(event: PointerEvent): void;
    "__#56@#handlePointerMoveEvent"(event: PointerEvent): void;
    "__#56@#pointerMoveCallback"(sash: HTMLElement): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
