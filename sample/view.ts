import { ReactiveChildNodes, Element } from "../src/elements/HTMLElement";
import { ListModel, ListModelBase } from "../src/models/Model";
import { ReactiveViewBase } from "../src/views/View";


interface ListItemData {
    label: string;
}

class SimpleListModel {
    readonly items: ListModel<ListItemData>;

    constructor() {
        this.items = new ListModelBase();
    }
}

export class SimpleListView extends ReactiveViewBase<SimpleListModel> {
    constructor(model: SimpleListModel) {
        super(model);
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

export const list = (window as any)["list"] = new SimpleListView(new SimpleListModel());
document.body.append(list.root);