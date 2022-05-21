import { ModelObject } from "../models/Model";
import { Widget } from "./widgets/Widget";

export { View };

interface View extends HTMLElement {
    readonly model: ModelObject | null;
    setModel(model: ModelObject): void;
    renderShadow(): Node | Widget | undefined;
    renderLight(): Node | Widget | undefined;
    refresh(): void;
}

interface ViewConstructor {
    readonly prototype: View;
    new(): View;
}

class ViewBase extends HTMLElement implements View {
    #model: ModelObject | null;

    constructor() {
        super();
        this.#model = null;
    }

    get model(): ModelObject | null {
        return this.#model;
    }
    
    setModel(model: ModelObject): void {
        this.#model = model;
        this.#render();            
    }

    renderLight(): Node | Widget | undefined {
        return;
    }

    renderShadow(): Node | Widget | undefined {
        return;
    }

    refresh(): void {
        this.#render();
    }

    #render(): void {
        const {shadowRoot} = this;
        const shadow = this.renderShadow();
        if (shadow) {
            if (shadowRoot) {
                shadowRoot.replaceChildren(
                    shadow instanceof Widget ? shadow.rootElement : shadow
                );
            }
        }
        const light = this.renderLight();
        if (light) {
            this.replaceChildren(
                light instanceof Widget ? light.rootElement : light
            );
        }
    }
}

var View: ViewConstructor = ViewBase;