import { CustomWidget, element } from "../../elements/Element";

export { menuItemGroupWidget };

declare global {
    interface WidgetNameMap {
        "menuitemgroup": typeof menuItemGroupWidget
    }
}

var menuItemGroupWidget = CustomWidget({
    name: "menuitemgroup"
})(Object.freeze({
    
    template: element("div", {
        properties: {
            className: "menuitemgroup"
        },
        attributes: {
            role: "group"
        }
    }),

    observer: new MutationObserver(
        (mutationsList: MutationRecord[]) => {
            mutationsList.forEach((mutation: MutationRecord) => {
                const {target, type} = mutation;
                if (target instanceof HTMLElement) {
                    switch (type) {
                        case "childList": {
                            const {addedNodes, removedNodes} = mutation;
                            if (addedNodes.length > 0) {
                                menuItemGroupWidget.childNodesAddedCallback(target, addedNodes);
                            }
                            if (removedNodes.length > 0) {
                                menuItemGroupWidget.childNodesRemovedCallback(target, addedNodes);
                            }
                            break;
                        }
                    }

                }
            });
        }
    ),

    create(init?: {
        name?: string;
    }): HTMLDivElement {
        return <typeof this.template>this.template.cloneNode(true);
    },

    childNodesAddedCallback(item: HTMLElement, childNodes: NodeList): void {
        childNodes.forEach(node_i => {
            if (node_i instanceof HTMLElement && node_i.classList.contains("menuitem")) {
                //this.setHasPopup(item, true);
            }
        });
    },

    childNodesRemovedCallback(item: HTMLElement, childNodes: NodeList): void {
        childNodes.forEach(node_i => {
            if (node_i instanceof HTMLElement && node_i.classList.contains("menuitem")) {
                //this.setHasPopup(item, false);
            }
        });
    }
}));