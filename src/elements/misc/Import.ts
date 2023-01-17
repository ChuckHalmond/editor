import { CustomElement, AttributeProperty } from "../Element";

export { HTMLEImportElement };

interface HTMLEImportElementConstructor {
    prototype: HTMLEImportElement;
    new(): HTMLEImportElement;
}

interface HTMLEImportElement extends HTMLElement {
    src: string;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-import": HTMLEImportElement;
    }
    interface HTMLElementEventMap {
        "load": Event;
    }
}

@CustomElement({
    name: "e-import"
})
class HTMLEImportElementBase extends HTMLElement implements HTMLEImportElement {

    @AttributeProperty({type: String})
    declare src: string;
    
    connectedCallback(): void {
        const {src} = this;
        if (src) {
            this.#importRequest(src);
        }
    }

    async #importRequest(src: string): Promise<void> {
        this.outerHTML = await fetch(src).then((response: Response) => {
            if (response.ok) {
                return response.text();
            }
            else {
                throw new Error(response.statusText);
            }
        });
        this.dispatchEvent(new Event("load", {bubbles: true}));
    }
}

var HTMLEImportElement: HTMLEImportElementConstructor = HTMLEImportElementBase;