import { ModelObject } from "../models/Model";
export { View };
interface View extends HTMLElement {
    readonly model: ModelObject | null;
    setModel(model: ModelObject): void;
    renderShadow(): Node | undefined;
    renderLight(): Node | undefined;
    render(): void;
}
interface ViewConstructor {
    prototype: View;
    new (): View;
}
declare var View: ViewConstructor;
