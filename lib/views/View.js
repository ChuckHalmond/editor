export { View };
class ViewBase extends HTMLElement {
    #model;
    constructor() {
        super();
        this.#model = null;
    }
    get model() {
        return this.#model;
    }
    setModel(model) {
        if (model !== this.#model) {
            this.#model = model;
        }
    }
    renderLight() {
        return;
    }
    renderShadow() {
        return;
    }
    render() {
        const { shadowRoot } = this;
        if (shadowRoot !== null) {
            const shadow = this.renderShadow();
            if (shadow) {
                shadowRoot.replaceChildren(shadow);
            }
        }
        const light = this.renderLight();
        if (light) {
            this.replaceChildren(light);
        }
    }
}
var View = ViewBase;
//# sourceMappingURL=View.js.map