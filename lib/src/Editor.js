import { HTMLEActionElement } from "./elements/containers/actions/Action";
import { subtreeNodes } from "./elements/Element";
export { Editor };
export { EditorBase };
class EditorBase {
    _widgets;
    _actions;
    _actionElements;
    _hotkeys;
    _pairs;
    _pairsListeners;
    _actionsObserver;
    constructor() {
        this._widgets = new Array();
        this._actions = new Array();
        this._actionElements = new Array();
        this._hotkeys = new Array();
        this._pairs = new Map();
        this._pairsListeners = new Map();
        this._actionsObserver = new MutationObserver(this._actionsObserverCallback.bind(this));
    }
    _actionsObserverCallback(mutationsList) {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                Array.from(subtreeNodes(node)).forEach((node) => {
                    if (node instanceof HTMLEActionElement) {
                        this.registerActionElement(node.name, node);
                    }
                });
            });
            mutation.removedNodes.forEach((node) => {
                Array.from(subtreeNodes(node)).forEach((node) => {
                    if (node instanceof HTMLEActionElement) {
                        this.unregisterActionElement(node.name, node);
                    }
                });
            });
        });
    }
    setup() {
        document.body.addEventListener("keydown", this);
        document.body.addEventListener("trigger", this);
        this._actionsObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    /*public getPair<T>(key: string): T {
        return this._pairs.get(key) as T;
    }

    public setPair(key: string, value: any): void {
        const oldValue = this._pairs.get(key);
        this._pairs.set(key, value);
        const listeners = this._pairsListeners.get(key);
        if (typeof listeners !== "undefined") {
            listeners.forEach((listener_i) => {
                listener_i(oldValue, value);
            });
        }
    }

    public addPairListener(key: string, listener: (oldValue: any, newValue: any) => void): void {
        const listeners = this._pairsListeners.get(key);
        if (typeof listeners !== "undefined") {
            listeners.push(listener);
        }
        else {
            this._pairsListeners.set(key, [listener]);
        }
    }

    public removePairListener(name: string, listener: (oldValue: any, newValue: any) => void): void {
        const listeners = this._pairsListeners.get(name);
        if (typeof listeners !== "undefined") {
            const listenerIndex = listeners.findIndex(listener_i => listener_i === listener);
            if (listenerIndex > -1) {
                listeners.copyWithin(listenerIndex, listenerIndex + 1);
                listeners.length--;
            }
        }
    }*/
    registerWidget(widget) {
        widget.element.addEventListener("focusin", this);
        this._widgets.push(widget);
    }
    unregisterWidget(widget) {
        if (this._widgets.includes(widget)) {
            widget.element.removeEventListener("focusin", this);
            this._widgets.splice(this._widgets.indexOf(widget), 1);
        }
    }
    handleEvent(event) {
        const target = event.target;
        switch (event.type) {
            case "keydown":
                const actionsIndices = this._hotkeys
                    .map((hotkey_i, i) => hotkey_i.test(event) ? i : -1)
                    .filter(i => i > -1);
                actionsIndices.forEach((index) => {
                    const { name, type, value, checked } = this._actions[index];
                    switch (type) {
                        case "button":
                            this.executeButtonAction(name);
                            break;
                        case "checkbox":
                            this.executeCheckboxAction(name, checked);
                            break;
                        case "radio":
                            this.executeRadioAction(name, value);
                            break;
                    }
                });
                break;
            case "trigger":
                if (target instanceof HTMLEActionElement) {
                    switch (target.type) {
                        case "button":
                            this.executeButtonAction(target.name);
                            break;
                        case "checkbox":
                            this.executeCheckboxAction(target.name, target.checked);
                            break;
                        case "radio":
                        case "select":
                            this.executeRadioAction(target.name, target.value);
                            break;
                    }
                }
                break;
        }
    }
    registerButtonAction(name, trigger, init) {
        return this.registerAction(name, trigger, "button", init);
    }
    registerRadioAction(name, trigger, init) {
        return this.registerAction(name, trigger, "radio", init);
    }
    registerCheckboxAction(name, trigger, init) {
        return this.registerAction(name, trigger, "checkbox", init);
    }
    registerAction(name, trigger, type, init) {
        const hotkey = init?.hotkey;
        const key = init?.key;
        const value = init?.value;
        const checked = init?.checked;
        const action = { name, trigger, key, type };
        if (value ?? false) {
            action.value = value;
        }
        if (key !== void 0 && value !== void 0) {
            localStorage.setItem(key, value);
        }
        if (checked ?? false) {
            action.checked = checked;
        }
        const index = this._actions.push(action) - 1;
        if (hotkey) {
            this._hotkeys[index] = hotkey;
        }
        return action;
    }
    executeButtonAction(name) {
        this.executeAction(name, "button");
    }
    executeCheckboxAction(name, newChecked) {
        this.executeAction(name, "checkbox", newChecked);
    }
    executeRadioAction(name, newValue) {
        this.executeAction(name, "radio", newValue);
    }
    executeAction(name, type, newValue) {
        const actionIndex = this._actions.findIndex(action_i => action_i.name === name);
        if (actionIndex > -1) {
            const action = this._actions[actionIndex];
            let oldValue;
            switch (type) {
                case "radio":
                    oldValue = action.value ?? "";
                    break;
                case "checkbox":
                    oldValue = action.value ?? false;
                    break;
            }
            action.trigger(oldValue, newValue);
            this.setActionValue(name, newValue);
            /*action.value = newValue;
            
            const actionElements = this._actionElements[actionIndex];
            if (actionElements) {
                switch (type) {
                    case "radio":
                        actionElements.forEach((actionElement_i) => {
                            if (actionElement_i.type === "radio") {
                                actionElement_i.checked = (actionElement_i.value === newValue);
                            }
                            else if (actionElement_i.type === "select") {
                                actionElement_i.value = newValue;
                            }
                        });
                        break;
                    case "checkbox":
                        actionElements.forEach((actionElement_i) => {
                            actionElement_i.checked = newValue;
                        });
                        break;
                }
            }*/
        }
    }
    setCheckboxActionValue(name, checked) {
        this.setActionValue(name, checked);
    }
    setRadioActionValue(name, value) {
        this.setActionValue(name, value);
    }
    setActionValue(name, value) {
        const actionIndex = this._actions.findIndex(action_i => action_i.name === name);
        if (actionIndex > -1) {
            const action = this._actions[actionIndex];
            const { type, key } = action;
            action.value = value;
            if (key) {
                localStorage.setItem(key, value);
            }
            const actionElements = this._actionElements[actionIndex];
            if (actionElements) {
                switch (type) {
                    case "radio":
                        actionElements.forEach((actionElement_i) => {
                            if (actionElement_i.type === "radio") {
                                actionElement_i.checked = (actionElement_i.value === value);
                            }
                            else if (actionElement_i.type === "select") {
                                actionElement_i.value = value;
                            }
                        });
                        break;
                    case "checkbox":
                        actionElements.forEach((actionElement_i) => {
                            actionElement_i.checked = value;
                        });
                        break;
                }
            }
        }
    }
    registerActionElement(name, element) {
        const actionIndex = this._actions.findIndex(action_i => action_i.name === name);
        if (actionIndex > -1) {
            const elements = this._actionElements[actionIndex];
            if (elements) {
                if (!elements.includes(element)) {
                    elements.push(element);
                }
            }
            else {
                this._actionElements[actionIndex] = [element];
            }
            const action = this._actions[actionIndex];
            const { type, value, checked } = action;
            switch (type) {
                case "radio":
                    if (element.type === "radio") {
                        element.checked = (element.value === value);
                    }
                    else if (element.type === "select") {
                        element.value = value;
                    }
                    break;
                case "checkbox":
                    element.checked = checked;
                    break;
            }
            const hotkey = this._hotkeys[actionIndex];
            if (hotkey) {
                element.hotkey = hotkey.toString();
            }
        }
    }
    unregisterActionElement(name, element) {
        const actionIndex = this._actions.findIndex(action_i => action_i.name === name);
        if (actionIndex > -1) {
            const elements = this._actionElements[actionIndex];
            if (elements) {
                const elementIndex = elements.findIndex(element_i => element_i === element);
                if (elementIndex > -1) {
                    elements.copyWithin(elementIndex, elementIndex + 1);
                    elements.length--;
                }
            }
        }
    }
}
var Editor = EditorBase;
//# sourceMappingURL=Editor.js.map