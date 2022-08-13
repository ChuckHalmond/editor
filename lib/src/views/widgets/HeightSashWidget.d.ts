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
    "__#59@#template": HTMLElement;
    "__#59@#targets": WeakMap<HTMLElement, HTMLElement | null>;
    "__#59@#onCaptureFlags": WeakMap<HTMLElement, boolean>;
    "__#59@#queuedPointerCallbacks": WeakMap<HTMLElement, FrameRequestCallback | null>;
    "__#59@#pointerMovements": WeakMap<HTMLElement, number>;
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
    "__#59@#handlePointerUpEvent"(event: PointerEvent): void;
    "__#59@#handlePointerDownEvent"(event: PointerEvent): void;
    "__#59@#handlePointerMoveEvent"(event: PointerEvent): void;
    "__#59@#pointerMoveCallback"(sash: HTMLElement): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
