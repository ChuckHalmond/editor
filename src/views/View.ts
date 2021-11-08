import { HTML } from "../elements/Element";
import { ReactiveNodesObserver } from "../observers/ReactiveNodesObserver";

export interface HTMLView extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    render(): HTMLElement;
    refresh(): void;
}

export interface ViewConstructor {
    readonly prototype: HTMLView;
    readonly styles: string | undefined;
}

export abstract class HTMLViewBase extends HTMLElement implements HTMLView {
    readonly shadowRoot!: ShadowRoot;

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const observer = new ReactiveNodesObserver();
        observer.observe(shadowRoot);
        setTimeout(() => {
            this.refresh();
        });
    }

    public static styles: string | undefined;
    public abstract render(): HTMLElement;

    public refresh(): void {
        const styles = (this.constructor as typeof HTMLViewBase).styles;
        if (styles !== void 0) {
            this.shadowRoot.replaceChildren(
                HTML("style", {
                    properties: {
                        textContent: styles,
                    }
                }),
                this.render()
            );
        }
        else {
            this.shadowRoot.replaceChildren(
                this.render()
            );
        }
    }
}