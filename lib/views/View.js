var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ViewBase_model;
export { View };
class ViewBase extends HTMLElement {
    constructor() {
        super();
        _ViewBase_model.set(this, void 0);
        __classPrivateFieldSet(this, _ViewBase_model, null, "f");
    }
    get model() {
        return __classPrivateFieldGet(this, _ViewBase_model, "f");
    }
    setModel(model) {
        if (model !== __classPrivateFieldGet(this, _ViewBase_model, "f")) {
            __classPrivateFieldSet(this, _ViewBase_model, model, "f");
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
_ViewBase_model = new WeakMap();
var View = ViewBase;
//# sourceMappingURL=View.js.map