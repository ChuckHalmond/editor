define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLTableTemplate = void 0;
    const HTMLTableTemplate = (desc) => {
        const thead = (0, HTMLElement_1.HTMLElementConstructor)("thead", {
            children: [
                (0, HTMLElement_1.HTMLElementConstructor)("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.headerCells.map((cell) => {
                        return (0, HTMLElement_1.HTMLElementConstructor)("th", {
                            props: {
                                scope: "col"
                            },
                            children: [
                                cell
                            ]
                        });
                    })
                })
            ]
        });
        const tbody = (0, HTMLElement_1.HTMLElementConstructor)("tbody", {
            children: desc.bodyCells.map((row) => {
                return (0, HTMLElement_1.HTMLElementConstructor)("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: row.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return (0, HTMLElement_1.HTMLElementConstructor)("td", {
                                        children: [
                                            cell.content
                                        ]
                                    });
                                case "header":
                                    return (0, HTMLElement_1.HTMLElementConstructor)("th", {
                                        props: {
                                            scope: "row"
                                        },
                                        children: [
                                            cell.content
                                        ]
                                    });
                            }
                        }
                        else {
                            return (0, HTMLElement_1.HTMLElementConstructor)("td", {
                                children: [
                                    cell
                                ]
                            });
                        }
                    })
                });
            })
        });
        const tfoot = (0, HTMLElement_1.HTMLElementConstructor)("tfoot", {
            children: [
                (0, HTMLElement_1.HTMLElementConstructor)("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.footerCells.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return (0, HTMLElement_1.HTMLElementConstructor)("td", {
                                        children: [
                                            cell.content
                                        ]
                                    });
                                case "header":
                                    return (0, HTMLElement_1.HTMLElementConstructor)("th", {
                                        props: {
                                            scope: "row"
                                        },
                                        children: [
                                            cell.content
                                        ]
                                    });
                            }
                        }
                        else {
                            return (0, HTMLElement_1.HTMLElementConstructor)("td", {
                                children: [
                                    cell
                                ]
                            });
                        }
                    })
                })
            ]
        });
        const table = (0, HTMLElement_1.HTMLElementConstructor)("table", {
            props: {
                id: desc.id,
                className: desc.className,
            },
            children: [
                thead,
                tbody,
                tfoot
            ]
        });
        return table;
    };
    exports.HTMLTableTemplate = HTMLTableTemplate;
});
//# sourceMappingURL=TableTemplate.js.map