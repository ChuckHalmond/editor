import { HTMLEDraggableElement } from "./Draggable";
import { HTMLEDragzoneElement } from "./Dragzone";
export { HTMLEDropzoneElement };
export { EDataChangeEvent };
interface HTMLEDropzoneElementConstructor {
    readonly prototype: HTMLEDropzoneElement;
    new (): HTMLEDropzoneElement;
    readonly observedAttributes: string[];
}
interface HTMLEDropzoneElement extends HTMLEDragzoneElement {
    dragovered: DropzoneDragoveredType | null;
    name: string;
    multiple: boolean;
    placeholder: string;
    droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => void) | null;
    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
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
