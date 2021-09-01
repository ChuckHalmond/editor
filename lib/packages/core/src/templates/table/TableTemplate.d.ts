export { HTMLTableTemplateDescription };
export { HTMLTableTemplate };
declare type HTMLTableTemplateDescription = Partial<Pick<HTMLTableElement, "id" | "className">> & {
    headerCells: (string | Node)[];
    bodyCells: ((string | Node) | {
        type: "header" | "data" | undefined;
        content: Node | string;
    })[][];
    footerCells: (string | Node | {
        type: "header" | "data" | undefined;
        content: Node | string;
    })[];
};
interface HTMLTableTemplate {
    (desc: HTMLTableTemplateDescription): HTMLTableElement;
}
declare const HTMLTableTemplate: HTMLTableTemplate;
