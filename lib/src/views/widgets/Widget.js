export { Widget };
class WidgetBase extends EventTarget {
    element;
    constructor(element) {
        super();
        this.element = element;
    }
}
var Widget = WidgetBase;
//# sourceMappingURL=Widget.js.map