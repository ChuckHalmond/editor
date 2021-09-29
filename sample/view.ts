import { ReactiveChildNodes, Element } from "../src/elements/HTMLElement";
import { ListModel, ListModelBase } from "../src/models/Model";
import { isNameView, isViewRoot, ReactiveViewBase } from "../src/views/View";

/*
interface ListItemData {
    label: string;
}

class SimpleListModel {
    readonly items: ListModel<ListItemData>;

    constructor() {
        this.items = new ListModelBase();
    }
}

export class SimpleListView extends ReactiveViewBase<SimpleListModel, HTMLElement> {
    constructor(model: SimpleListModel) {
        super(model);
    }

    name() {
        return "SimpleListView";
    }
    
    render() {
        return Element("ul", {
            children: ReactiveChildNodes(
                this.model.items,
                (item) => {
                    return Element("li", {
                        props: {
                            textContent: item.label
                        }
                    })
                }
            )
        })
    }
}

declare global {
    interface ViewNameMap {
        "SimpleListView": SimpleListView
    }
}

export const list = (window as any)["list"] = new SimpleListView(new SimpleListModel());
document.body.append(list.root);
console.log(list.root._view);
const root = list.root;
if (isViewRoot(root)) {
    const view = root._view;
    if (isView("SimpleListView", view)) {
        
    }
}*/