import { WidgetFactory } from "../Widget";
export { treeItemGroupWidget };
declare global {
    interface WidgetNameMap {
        "treeitemgroup": TreeItemGroupWidgetFactory;
    }
}
interface TreeItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var treeItemGroupWidget: {
    "__#63@#template": HTMLElement;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
