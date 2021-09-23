import { ReactiveChildNodes, Element } from "../src/elements/HTMLElement";
import { ListModelBase } from "../src/models/Model";
import { ReactiveViewBase } from "../src/views/View";
class SimpleListModel {
    constructor() {
        this.items = new ListModelBase();
    }
}
export class SimpleListView extends ReactiveViewBase {
    constructor(model) {
        super(model);
    }
    render() {
        return Element("ul", {
            children: ReactiveChildNodes(this.model.items, (item) => {
                return Element("li", {
                    props: {
                        textContent: item.label
                    }
                });
            })
        });
    }
}
export const list = window["list"] = new SimpleListView(new SimpleListModel());
document.body.append(list.root);
//# sourceMappingURL=view.js.map