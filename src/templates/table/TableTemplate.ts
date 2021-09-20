import { Element, TextNode } from "../../elements/HTMLElement";

export { HTMLTableTemplateDescription };
export { HTMLTableTemplate };

type HTMLTableTemplateDescription = Partial<Pick<HTMLTableElement, "id" | "className">> & {
    headerCells: (string | Node)[];

    bodyCells: ((string | Node) | {
        type: "header" | "data" | undefined
        content: Node | string
    })[][];

    footerCells: (string | Node | {
        type: "header" | "data" | undefined
        content: Node | string
    })[];
}

interface HTMLTableTemplate {
    (desc: HTMLTableTemplateDescription): HTMLTableElement;
}

const HTMLTableTemplate: HTMLTableTemplate = (desc: HTMLTableTemplateDescription) => {
    
    const thead = Element(
        "thead", {
            children: [
                Element(
                "tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.headerCells.map((cell) => {
                        return Element(
                            "th", {
                                props: {
                                    scope: "col" 
                                },
                                children: [
                                    (typeof cell === "string") ? TextNode(cell) : cell
                                ]
                            }
                        );
                    })
                })
            ]
        }
    );

    const tbody = Element(
        "tbody", {
            children: desc.bodyCells.map((row) => {
                return Element(
                "tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: row.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return Element(
                                        "td", {
                                            children: [
                                                (typeof cell.content === "string") ? TextNode(cell.content) : cell.content
                                            ]
                                        }
                                    );
                                case "header":
                                    return Element(
                                        "th", {
                                            props: {
                                                scope: "row" 
                                            },
                                            children: [
                                                (typeof cell.content === "string") ? TextNode(cell.content) : cell.content
                                            ]
                                        }
                                    );
                            }
                        }
                        else {
                            return Element(
                                "td", {
                                    children: [
                                        (typeof cell === "string") ? TextNode(cell) : cell
                                    ]
                                }
                            );
                        }
                    })
                })
            })
        }
    );

    const tfoot = Element(
        "tfoot", {
            children: [
                Element(
                "tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.footerCells.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return Element(
                                        "td", {
                                            children: [
                                                (typeof cell.content === "string") ? TextNode(cell.content) : cell.content
                                            ]
                                        }
                                    );
                                case "header":
                                    return Element(
                                        "th", {
                                            props: {
                                                scope: "row" 
                                            },
                                            children: [
                                                (typeof cell.content === "string") ? TextNode(cell.content) : cell.content
                                            ]
                                        }
                                    );
                            }
                        }
                        else {
                            return Element(
                                "td", {
                                    children: [
                                        (typeof cell === "string") ? TextNode(cell) : cell
                                    ]
                                }
                            );
                        }
                    })
                })
            ]
        }
    );

    const table = Element(
        "table", {
            props: {
                id: desc.id,
                className: desc.className,
            },
            children: [
                thead,
                tbody,
                tfoot
            ]
        }
    );

    return table;
}