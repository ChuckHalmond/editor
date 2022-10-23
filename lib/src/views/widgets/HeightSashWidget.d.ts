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
    "__#51@#template": HTMLElement;
    "__#51@#targets": WeakMap<HTMLElement, HTMLElement | null>;
    "__#51@#onCaptureFlags": WeakMap<HTMLElement, boolean>;
    "__#51@#queuedPointerCallbacks": WeakMap<HTMLElement, FrameRequestCallback | null>;
    "__#51@#pointerMovements": WeakMap<HTMLElement, number>;
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
    "__#51@#handlePointerUpEvent"(event: PointerEvent): void;
    "__#51@#handlePointerDownEvent"(event: PointerEvent): void;
    "__#51@#handlePointerMoveEvent"(event: PointerEvent): void;
    "__#51@#pointerMoveCallback"(sash: HTMLElement): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
