import { HTMLEDraggableElement } from "src/editor/elements/lib/controls/draggable/Draggable";
export { HTMLDraggableInputTemplateDescription };
export { HTMLDraggableInputTemplate };
declare type HTMLDraggableInputTemplateDescription = Partial<Pick<HTMLEDraggableElement, 'id' | 'className'>> & Partial<Pick<HTMLInputElement, 'name'>>;
interface HTMLDraggableInputTemplate {
    (desc: HTMLDraggableInputTemplateDescription): HTMLEDraggableElement;
}
declare const HTMLDraggableInputTemplate: HTMLDraggableInputTemplate;
