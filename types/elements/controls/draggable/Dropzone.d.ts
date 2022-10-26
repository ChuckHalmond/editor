import { HTMLEDraggableElement } from "./Draggable";
import { HTMLEDragzoneElement } from "./Dragzone";
export { HTMLEDropzoneElement };
export { EDataChangeEvent };
interface HTMLEDropzoneElementConstructor {
    prototype: HTMLEDropzoneElement;
    new (): HTMLEDropzoneElement;
}
interface HTMLEDropzoneElement extends HTMLEDragzoneElement {
    readonly shadowRoot: ShadowRoot;
    dragovered: DropzoneDragoveredType | null;
    name: string;
    multiple: boolean;
    placeholder: string;
    droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => void) | null;
    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
declare type DropzoneDragoveredType = "self" | "draggable" | "appendarea";
declare type EDataChangeEvent = CustomEvent<{
    action: "insert" | "remove";
    draggables: HTMLEDraggableElement[];
    position: number;
}>;
declare global {
    interface HTMLElementTagNameMap {
        "e-dropzone": HTMLEDropzoneElement;
    }
    interface HTMLElementEventMap {
        "e_datachange": EDataChangeEvent;
    }
}
declare var HTMLEDropzoneElement: HTMLEDropzoneElementConstructor;
