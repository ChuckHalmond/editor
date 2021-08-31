define(["require", "exports", "src/editor/elements/HTMLElement", "src/editor/elements/view/View", "src/editor/model/Model"], function (require, exports, HTMLElement_1, View_1, Model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.temp = void 0;
    function temp() {
        class FieldModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
            }
        }
        class FieldsetModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
                this.fields = new Model_1.ListModelBase(data.fields.map(field => new FieldModel(field)));
            }
            getData() {
                return Object.assign(this.data, {
                    fields: this.fields.items.map(item => item.data)
                });
            }
        }
        class StatementLastExecutionModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
            }
        }
        class DataframeColumnModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
            }
        }
        class StatementResultModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
                this.columns = new Model_1.ListModelBase(data.columns.map((column) => new DataframeColumnModel(column)));
            }
            getData() {
                return Object.assign(this.data, {
                    columns: this.columns.items.map(item => item.data)
                });
            }
        }
        class Statement {
            constructor(parent, data) {
                this.parent = parent;
                this.children = data.children.map(child => new Statement(this, child));
                this.fieldsetModel = new FieldsetModel(data.fieldset);
                this.lastExecutionModel = new StatementLastExecutionModel(data.lastExecution);
                this.resultModel = new StatementResultModel(data.result);
                this.fieldsetView = new StatementFieldsetView(this.fieldsetModel);
                this.lastExecutionView = new StatementLastExecutionView(this.lastExecutionModel);
                this.resultView = new StatementResultView(this.resultModel);
            }
            execute() {
            }
            invalidate() {
            }
        }
        /*class Expression {
            draggable: HTMLEDraggableElement;
    
            constructor() {
            }
        }*/
        const fieldset = new FieldsetModel({
            box: "Transformer",
            signature: "replace_transformer",
            is_expression: false,
            label: "Replace",
            doc: "Replace...",
            fields: [
                {
                    label: "Column",
                    name: "column",
                    type: "any",
                    allows_expression: true,
                    type_constraint: {
                        name: "same_as",
                        other: "value"
                    },
                    optional: false
                },
                {
                    label: "Value",
                    name: "value",
                    type: "any",
                    type_constraint: {
                        name: "same_as",
                        other: "column"
                    },
                    allows_expression: true,
                    optional: false
                }
            ]
        });
        const plusOperatorFieldset = new FieldsetModel({
            box: "Operator",
            signature: "plus_operator",
            is_expression: false,
            label: "[left] + [right]",
            doc: "Plus...",
            fields: [
                {
                    label: "Left",
                    name: "left",
                    type: "any",
                    allows_expression: true,
                    type_constraint: {
                        name: "same_as",
                        other: "right"
                    },
                    optional: false
                },
                {
                    label: "Right",
                    name: "right",
                    type: "any",
                    type_constraint: {
                        name: "same_as",
                        other: "left"
                    },
                    allows_expression: true,
                    optional: false
                }
            ]
        });
        const FieldFragment = (fieldset, field) => (0, HTMLElement_1.Fragment)((0, HTMLElement_1.Element)("div", {
            children: [
                (0, HTMLElement_1.ReactiveNode)((0, HTMLElement_1.Element)(/*html*/ "label"), field, (div, property, oldValue, newValue) => {
                    switch (property) {
                        case "label":
                            if (newValue !== oldValue) {
                                div.textContent = field.data.label;
                            }
                            break;
                    }
                }),
                DropzoneInputFragment(fieldset, field)
            ]
        }));
        const DropzoneInputFragment = (host, field) => (0, HTMLElement_1.Fragment)((0, HTMLElement_1.Element)(/*html*/ "e-dropzoneinput", {
            children: [
                (0, HTMLElement_1.ReactiveNode)((0, HTMLElement_1.Element)("e-dropzone", {
                    props: {
                        className: "field__dropzone",
                        slot: "dropzone",
                        droptest: (dropzone, draggables) => {
                            let accepts = draggables.every(draggable => dropzone.type === "any" || draggable.type === dropzone.type);
                            if (!accepts) {
                                alert(`Only ${dropzone.type} draggables are allowed.`);
                            }
                            return accepts;
                        }
                    },
                    listeners: {
                        datachange: (event) => {
                            let dropzone = event.target;
                            let constraint = field.data.type_constraint;
                            if (constraint) {
                                switch (constraint.name) {
                                    case "same_as":
                                        let otherDropzone = host.querySelector(`e-dropzone[name=${constraint.other}]`);
                                        if (otherDropzone) {
                                            if (event.detail.action === "insert") {
                                                let draggable = event.detail.draggables[0];
                                                if (draggable) {
                                                    dropzone.type = otherDropzone.type = draggable.type;
                                                    dropzone.placeholder = otherDropzone.placeholder = draggable.type;
                                                }
                                            }
                                            else {
                                                if (otherDropzone.draggables.length === 0) {
                                                    dropzone.type = otherDropzone.type = "any";
                                                    dropzone.placeholder = otherDropzone.placeholder = "any";
                                                }
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }), field, (dropzone, property, oldValue, newValue) => {
                    switch (property) {
                        case "name":
                            if (newValue !== oldValue) {
                                dropzone.name = newValue;
                            }
                            break;
                        case "type":
                            if (newValue !== oldValue) {
                                dropzone.placeholder = newValue;
                                dropzone.type = newValue;
                            }
                            break;
                    }
                }),
                (0, HTMLElement_1.Element)("input", {
                    props: {
                        className: "field__input",
                        slot: "input"
                    }
                })
            ]
        }));
        class StatementFieldsetView extends View_1.ViewBase {
            constructor(model) {
                super(model);
            }
            render() {
                return (0, HTMLElement_1.Element)("fieldset", {
                    props: {
                        className: "statement-fieldset"
                    },
                    children: (0, HTMLElement_1.ReactiveChildNodes)(this.model.fields, (item) => FieldFragment(this.element, item))
                });
            }
        }
        class StatementLastExecutionView extends View_1.ViewBase {
            constructor(model) {
                super(model);
            }
            render() {
                return (0, HTMLElement_1.Element)("div", {
                    children: [
                        (0, HTMLElement_1.ReactiveNode)(document.createTextNode(`Last execution date : ${this.model.data.datetime}`), this.model, (node, property, oldValue, newValue) => {
                            if (property === "datetime") {
                                node.textContent = `Last execution date : ${newValue}`;
                            }
                        })
                    ]
                });
            }
        }
        class StatementResultView extends View_1.ViewBase {
            constructor(model) {
                super(model);
            }
            render() {
                return (0, HTMLElement_1.Element)("e-dragzone", {
                    children: (0, HTMLElement_1.ReactiveChildNodes)(this.model.columns, (item) => (0, HTMLElement_1.Element)("e-draggable", {
                        props: {
                            textContent: item.data.name
                        }
                    }))
                });
            }
        }
        class ExpressionDraggableView extends View_1.ViewBase {
            constructor(model) {
                super(model);
            }
            render() {
                return (0, HTMLElement_1.ReactiveNode)((0, HTMLElement_1.Element)("e-draggable"), this.model, (draggable, property, oldValue, newValue) => {
                    switch (property) {
                        case "label":
                            if (newValue !== oldValue) {
                                (0, HTMLElement_1.setElementChildren)(draggable, (0, HTMLElement_1.parseStringTemplate)(this.model.data.label, this.model.fields.items.reduce((obj, item) => ({
                                    ...obj,
                                    [item.data.name]: DropzoneInputFragment(this.element, item)
                                }), {})).childNodes);
                            }
                            break;
                    }
                });
            }
        }
        /*const view = new ExpressionDraggableView(fieldset);
        let extractButton = document.getElementById("extract-button");
        (window as any)["view"] = view;
        (window as any)["fieldset"] = fieldset;
        if (extractButton) {
            extractButton.after(view.element);
        }*/
        //let fieldsetView = new StatementFieldsetView(plusOperatorFieldset);
        //let draggable = HTML(/*html*/`<e-draggable>`, {children: [fieldsetView]});
        /*
            extractButton.after(fieldsetView);
        }
    
        (window as any)["fieldset"] = fieldset;*/
    }
    exports.temp = temp;
});
//# sourceMappingURL=temp.js.map