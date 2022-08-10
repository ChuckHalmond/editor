import { ModelObject } from "../models/Model";

export { View };

interface View extends HTMLElement {
    readonly model: ModelObject | null;
    setModel(model: ModelObject): void;
    renderShadow(): Node | undefined;
    renderLight(): Node | undefined;
    refresh(): void;
}

interface ViewConstructor {
    prototype: View;
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

    renderLight(): Node | undefined {
        return;
    }

    renderShadow(): Node | undefined {
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
                shadowRoot.replaceChildren(shadow);
            }
        }
        const light = this.renderLight();
        if (light) {
            this.replaceChildren(light);
        }
    }
}

var View: ViewConstructor = ViewBase;