import { ModelList, ModelObject } from "../models/Model";
import { View } from "./View";
export { ListModel };
export { ListItemModel };
export { ListView };
declare class ListModel extends ModelObject {
    readonly items: ModelList<ListItemModel>;
    sortFunction: ((item_a: ListItemModel, item_b: ListItemModel) => number) | null;
    constructor();
    constructor(init: {
        items: ListItemModel[];
        sortFunction?: (item_a: ListItemModel, item_b: ListItemModel) => number;
    });
    getItemByIndex(index: number): ListItemModel | null;
}
interface TreeItem {
    show(): void;
    hide(): void;
    display(): void;
    remove(): void;
}
declare class ListItemModel extends ModelObject implements TreeItem {
    readonly label: string;
    visibility: boolean;
    constructor(init: {
        label: string;
    });
    get index(): number;
    show(): void;
    hide(): void;
    display(): void;
    remove(): void;
}
interface ListViewConstructor {
    prototype: ListView;
    new (): ListView;
    new (model: ListModel): ListView;
}
interface ListView extends View {
    model: ListModel;
}
declare global {
    interface HTMLElementTagNameMap {
        "v-list": ListView;
    }
}
declare var ListView: ListViewConstructor;
