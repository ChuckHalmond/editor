import { AttributeProperty } from "../../Element";

export { HTMLEActionElement };
export { ActionType };

interface HTMLEActionElementConstructor {
    readonly prototype: HTMLEActionElement;
    new(): HTMLEActionElement;
}

interface HTMLEActionElement extends HTMLElement {
    name: string;
    value: string;
    checked: boolean;
    type: string;
    disabled: boolean;
    hotkey: string;

    trigger(): void;
    enable(): void;
    disable(): void;
}

declare global {
    interface HTMLElementEventMap {
        "trigger": Event;
    }
}

type ActionType = "button" | "checkbox" | "radio" | "select";

class HTMLEActionElementBase extends HTMLElement implements HTMLEActionElement {
    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    value!: string;

    @AttributeProperty({type: String})
    hotkey!: string;

    @AttributeProperty({type: String, defaultValue: "button"})
    type!: string;

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    @AttributeProperty({type: Boolean})
    checked!: boolean;

    trigger(): void {
        if (!this.disabled) {
            switch (this.type) {
                case "checkbox":
                    this.checked = !this.checked;
                    break;
                case "radio":
                    this.checked = true;
                    break;
            }
            this.dispatchEvent(new Event("trigger", {
                bubbles: true
            }));
        }
    }

    enable(): void {
        this.disabled = false;
    }

    disable(): void {
        this.disabled = true;
    }
}

var HTMLEActionElement: HTMLEActionElementConstructor = HTMLEActionElementBase;