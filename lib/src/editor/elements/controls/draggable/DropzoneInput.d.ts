import { HTMLEDropzoneElement } from "./Dropzone";
interface HTMLEDropzoneInputElement extends HTMLElement {
    dropzone: HTMLEDropzoneElement | null;
    input: HTMLInputElement | null;
    converter: ((dropzone: HTMLEDropzoneElement) => string) | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-dropzoneinput": HTMLEDropzoneInputElement;
    }
}
export {};
