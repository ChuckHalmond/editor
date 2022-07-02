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
    "__#50@#template": HTMLElement;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    readonly slots: string[];
};
