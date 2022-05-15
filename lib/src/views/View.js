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
        this.#model = model;
        this.#render();
    }
    beforeRender() { }
    renderLight() {
        throw new TypeError("Not implemented method.");
    }
    renderShadow() {
        throw new TypeError("Not implemented method.");
    }
    #render() {
        const { shadowRoot } = this;
        if (shadowRoot) {
            shadowRoot.replaceChildren(this.renderShadow());
        }
        this.replaceChildren(this.renderLight());
    }
}
var View = ViewBase;
//# sourceMappingURL=View.js.map