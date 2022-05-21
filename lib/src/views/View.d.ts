import { ModelObject } from "../models/Model";
import { Widget } from "./widgets/Widget";
export { View };
interface View extends HTMLElement {
    readonly model: ModelObject | null;
    setModel(model: ModelObject): void;
    renderShadow(): Node | Widget | undefined;
    renderLight(): Node | Widget | undefined;
    refresh(): void;
}
interface ViewConstructor {
    readonly prototype: View;
    new (): View;
}
declare var View: ViewConstructor;
