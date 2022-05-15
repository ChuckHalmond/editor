import { ModelObject } from "./src/models/Model";
export { View };
interface View extends HTMLElement {
    readonly model: ModelObject | null;
    setModel(model: ModelObject): void;
    renderShadow(): Node | undefined;
    renderLight(): Node | undefined;
    refresh(): void;
}
interface ViewConstructor {
    readonly prototype: View;
    new (): View;
}
declare var View: ViewConstructor;
