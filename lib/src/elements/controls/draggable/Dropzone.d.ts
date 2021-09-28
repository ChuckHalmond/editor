import { HTMLEDraggableElement } from "./Draggable";
export { EDataChangeEvent };
export { HTMLEDropzoneElement };
export { HTMLEDropzoneElementBase };
export { DropzoneDataBase };
export { DropzoneData };
interface HTMLEDropzoneElement extends HTMLElement {
    selectedDraggables: HTMLEDraggableElement[];
    draggables: HTMLEDraggableElement[];
    dragovered: DropzoneDragoveredType | null;
    name: string;
    type: string;
    multiple: boolean;
    disabled: boolean;
    placeholder: string;
    droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => void) | null;
    addDraggables(draggables: HTMLEDraggableElement[], position: number): void;
    removeDraggables(predicate: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
}
declare type DropzoneDragoveredType = "self" | "draggable" | "appendarea";
declare type EDataChangeEvent = CustomEvent<{
    action: "insert" | "remove";
    draggables: HTMLEDraggableElement[];
    position: number;
}>;
declare class HTMLEDropzoneElementBase extends HTMLElement implements HTMLEDropzoneElement {
    dragovered: DropzoneDragoveredType | null;
    placeholder: string;
    input: string;
    multiple: boolean;
    disabled: boolean;
    name: string;
    type: string;
    droptest: ((dropzone: HTMLEDropzoneElement, draggables: HTMLEDraggableElement[]) => boolean) | null;
    value: any;
    draggables: HTMLEDraggableElement[];
    selectedDraggables: HTMLEDraggableElement[];
    constructor();
    selectDraggable(draggable: HTMLEDraggableElement): void;
    unselectDraggable(draggable: HTMLEDraggableElement): void;
    clearSelection(): void;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    addDraggables(draggables: HTMLEDraggableElement[], position: number): HTMLEDraggableElement[] | null;
    removeDraggables(predicate?: (draggable: HTMLEDraggableElement, index: number) => boolean): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-dropzone": HTMLEDropzoneElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_datachange": EDataChangeEvent;
    }
}
interface DropzoneData {
    getData(): object | null;
}
interface DropzoneDataConstructor {
    readonly prototype: DropzoneData;
    new (dropzone: HTMLEDropzoneElement): DropzoneData;
}
declare class DropzoneDataBase {
    private _dropzone;
    constructor(dropzone: HTMLEDropzoneElement);
    getData(): object | null;
}
declare var DropzoneData: DropzoneDataConstructor;
