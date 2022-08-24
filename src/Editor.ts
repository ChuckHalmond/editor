import { ActionType, HTMLEActionElement } from "./elements/containers/actions/Action";
//import { subtreeNodes } from "./elements/Element";
import { HotKey } from "./Input";

export { Editor };
export { EditorBase };

interface Action {
    name: string;
    type: ActionType;
    trigger: (oldValue: any, newValue: any) => void;
    key?: string;
    value?: string;
    checked?: boolean;
}

interface ButtonAction {
    name: string;
    type: "button";
    trigger: () => void;
}

interface RadioAction {
    name: string;
    type: "radio";
    trigger: (oldValue: string, newValue: string) => void;
    value: string;
    key?: string;
}

interface CheckboxAction {
    name: string;
    type: "checkbox";
    trigger: (oldValue: boolean, newValue: boolean) => void;
    checked: boolean;
    key?: string;
}

interface EditorConstructor {
    prototype: Editor;
    new(): Editor;
}

interface Editor {
    /*registerWidget(widget: Widget): void;
    unregisterWidget(widget: Widget): void;*/
    
    /*setPair(key: string, value: any): void;
    getPair<T>(key: string): T;
    addPairListener(key: string, listener: (oldValue: any, newValue: any) => void): void;
    removePairListener(key: string, listener: (oldValue: any, newValue: any) => void): void;*/

    registerButtonAction(
        name: string,
        trigger: () => void,
        init?: {
            hotkey?: HotKey;
            key?: string;
        }): ButtonAction;
    registerRadioAction(
        name: string,
        trigger: (oldValue: string, newValue: string) => void,
        init?: {
            hotkey?: HotKey;
            key?: string;
            value?: string;
        }): RadioAction;
    registerCheckboxAction(
        name: string,
        trigger: (oldValue: boolean, newValue: boolean) => void,
        init?: {
            hotkey?: HotKey;
            key?: string;
            checked?: boolean;
        }): CheckboxAction;
    
    executeButtonAction(name: string): void;
    executeCheckboxAction(name: string, newChecked: boolean): void;
    executeRadioAction(name: string, newValue: string): void;

    setCheckboxActionValue(name: string, checked: boolean): void;
    setRadioActionValue(name: string, value: string): void;

    unregisterActionElement(action: string, element: HTMLEActionElement): void;
    registerActionElement(action: string, element: HTMLEActionElement): void;
    setup(): void;
}

class EditorBase implements Editor {
    //private _widgets: Array<Widget>;
    private _actions: Array<Action>;
    private _actionElements: Array<Array<HTMLEActionElement>>;
    private _hotkeys: Array<HotKey>;
    private _pairs: Map<string, any>;
    private _pairsListeners: Map<string, Array<(oldValue: any, newValue: any) => void>>;

    private _actionsObserver: MutationObserver;

    constructor() {
        //this._widgets = new Array();
        this._actions = new Array();
        this._actionElements = new Array();
        this._hotkeys = new Array();
        this._pairs = new Map();
        this._pairsListeners = new Map();

        this._actionsObserver =  new MutationObserver(this._actionsObserverCallback.bind(this));
    }

    private _actionsObserverCallback(mutationsList: MutationRecord[]) {
        /*mutationsList.forEach((mutation: MutationRecord) => {
            mutation.addedNodes.forEach((node: Node) => {
                Array.from(subtreeNodes(node)).forEach((node) => {
                    if (node instanceof HTMLEActionElement) {
                        this.registerActionElement(node.name, node);
                    }
                });
            });
            mutation.removedNodes.forEach((node: Node) => {
                Array.from(subtreeNodes(node)).forEach((node) => {
                    if (node instanceof HTMLEActionElement) {
                        this.unregisterActionElement(node.name, node);
                    }
                });
            });
        });*/
    }
    
    public setup(): void {
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
            const listenerIndex = listeners.findIndex(listener_i => listener_i == listener);
            if (listenerIndex > -1) {
                listeners.copyWithin(listenerIndex, listenerIndex + 1);
                listeners.length--;
            }
        }
    }*/
    
    /*public registerWidget(widget: Widget): void {
        widget.element.addEventListener("focusin", this);
        this._widgets.push(widget);
    }

    public unregisterWidget(widget: Widget): void {
        if (this._widgets.includes(widget)) {
            widget.element.removeEventListener("focusin", this);
            this._widgets.splice(this._widgets.indexOf(widget), 1);
        }
    }*/

    public handleEvent(event: Event): void {
        const target = event.target;
        switch (event.type) {
            case "keydown":
                const actionsIndices = this._hotkeys
                    .map((hotkey_i, i) => hotkey_i.test(event as KeyboardEvent) ? i : -1)
                    .filter(i => i > -1);
                actionsIndices.forEach((index) => {
                    const {name, type, value, checked} = this._actions[index];
                    switch (type) {
                        case "button":
                            this.executeButtonAction(name);
                            break;
                        case "checkbox":
                            this.executeCheckboxAction(name, checked!);
                            break;
                        case "radio":
                            this.executeRadioAction(name, value!);
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
    
    public registerButtonAction(
        name: string,
        trigger: () => void,
        init?: {
            hotkey?: HotKey;
            key?: string;
        }): ButtonAction {
            return this.registerAction(name, trigger, "button", init);
    }

    public registerRadioAction(
        name: string,
        trigger: (oldValue: string, newValue: string) => void,
        init?: {
            hotkey?: HotKey;
            key?: string;
            value?: string;
        }): RadioAction {
            return this.registerAction(name, trigger, "radio", init);
    }

    public registerCheckboxAction(
        name: string,
        trigger: (oldValue: boolean, newValue: boolean) => void,
        init?: {
            hotkey?: HotKey;
            key?: string;
            checked?: boolean;
        }): CheckboxAction {
            return this.registerAction(name, trigger, "checkbox", init);
    }

    public registerAction(
        name: string,
        trigger: () => void,
        type: "button",
        init?: {
            hotkey?: HotKey;
            key?: string;
        }): ButtonAction;
    public registerAction(
        name: string,
        trigger: (oldValue: boolean, newValue: boolean) => void,
        type: "checkbox",
        init?: {
            hotkey?: HotKey;
            key?: string;
            checked?: boolean;
        }): CheckboxAction;
    public registerAction(
        name: string,
        trigger: (oldValue: string, newValue: string) => void,
        type: "radio",
        init?: {
            hotkey?: HotKey;
            key?: string;
            value?: string;
        }): RadioAction;
    public registerAction(
        name: string,
        trigger: (oldValue: any, newValue: any) => void,
        type: ActionType,
        init?: {
            hotkey?: HotKey;
            key?: string;
            value?: string;
            checked?: boolean;
        }): Action {
        const hotkey = init?.hotkey;
        const key = init?.key;
        const value = init?.value;
        const checked = init?.checked;
        const action: Action = {name, trigger, key, type};
        if (value ?? false) {
            action.value = value;
        }
        if (key !== undefined && value !== undefined) {
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

    public executeButtonAction(name: string): void {
        this.executeAction(name, "button");
    }

    public executeCheckboxAction(name: string, newChecked: boolean): void {
        this.executeAction(name, "checkbox", newChecked);
    }

    public executeRadioAction(name: string, newValue: string): void {
        this.executeAction(name, "radio", newValue);
    }

    public executeAction(name: string, type: "button"): void;
    public executeAction(name: string, type: "checkbox", newChecked: boolean): void;
    public executeAction(name: string, type: "radio", newValue: string): void;
    public executeAction(name: string, type: ActionType, newValue?: any): void {
        const actionIndex = this._actions.findIndex(
            action_i => action_i.name == name
        );
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
                            if (actionElement_i.type == "radio") {
                                actionElement_i.checked = (actionElement_i.value == newValue);
                            }
                            else if (actionElement_i.type == "select") {
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

    public setCheckboxActionValue(name: string, checked: boolean): void {
        this.setActionValue(name, checked);
    }

    public setRadioActionValue(name: string, value: string): void {
        this.setActionValue(name, value);
    }

    public setActionValue(name: string, value?: any): void {
        const actionIndex = this._actions.findIndex(
            action_i => action_i.name == name
        );
        if (actionIndex > -1) {
            const action = this._actions[actionIndex];
            const {type, key} = action;
            action.value = value;
            if (key) {
                localStorage.setItem(key, value);
            }
            
            const actionElements = this._actionElements[actionIndex];
            if (actionElements) {
                switch (type) {
                    case "radio":
                        actionElements.forEach((actionElement_i) => {
                            if (actionElement_i.type == "radio") {
                                actionElement_i.checked = (actionElement_i.value == value);
                            }
                            else if (actionElement_i.type == "select") {
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

    public registerActionElement(name: string, element: HTMLEActionElement): void {
        const actionIndex = this._actions.findIndex(action_i => action_i.name == name);
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
            const {type, value, checked} = action;
            switch (type) {
                case "radio":
                    if (element.type == "radio") {
                        element.checked = (element.value == value!);
                    }
                    else if (element.type == "select") {
                        element.value = value!;
                    }
                    break;
                case "checkbox":
                    element.checked = checked!;
                    break;
            }

            const hotkey = this._hotkeys[actionIndex];
            if (hotkey) {
                element.hotkey = hotkey.toString();
            }
        }
    }

    public unregisterActionElement(name: string, element: HTMLEActionElement): void {
        const actionIndex = this._actions.findIndex(action_i => action_i.name == name);
        if (actionIndex > -1) {
            const elements = this._actionElements[actionIndex];
            if (elements) {
                const elementIndex = elements.findIndex(element_i => element_i == element);
                if (elementIndex > -1) {
                    elements.copyWithin(elementIndex, elementIndex + 1);
                    elements.length--;
                }
            }
        }
    }
}

var Editor: EditorConstructor = EditorBase;