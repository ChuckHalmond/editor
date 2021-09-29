import { ListModel } from "../src/models/Model";
import { ReactiveViewBase } from "../src/views/View";
interface ListItemData {
    label: string;
}
declare class SimpleListModel {
    readonly items: ListModel<ListItemData>;
    constructor();
}
export declare class SimpleListView extends ReactiveViewBase<SimpleListModel, HTMLElement> {
    constructor(model: SimpleListModel);
    name(): string;
    render(): HTMLUListElement;
}
declare global {
    interface ViewNameMap {
        "SimpleListView": SimpleListView;
    }
}
export declare const list: SimpleListView;
export {};
