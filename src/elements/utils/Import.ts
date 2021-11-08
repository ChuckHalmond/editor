import { CustomElement, AttributeProperty } from "../Element";

export { HTMLEImportElement };
export { HTMLEImportElementBase };

interface HTMLEImportElement extends HTMLElement {
    src: string;
}

@CustomElement({
    name: "e-import"
})
class HTMLEImportElementBase extends HTMLElement {

    @AttributeProperty({type: "string"})
    public src!: string;

    constructor() {
        super();
    }
    
    public connectedCallback(): void {
        const importRequest = async (src: string) => {
            this.outerHTML = await fetch(src).then((response: Response) => {
                if (response.ok) {
                    return response.text();
                }
                else {
                    throw new Error(response.statusText);
                }
            });
            this.dispatchEvent(new CustomEvent("e_load"));
        }
        if (this.src) {
            importRequest(this.src);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-import": HTMLEImportElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e_load": CustomEvent
    }
}