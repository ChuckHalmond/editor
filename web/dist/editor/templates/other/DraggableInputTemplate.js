define(["require", "exports", "src/editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLDraggableInputTemplate = void 0;
    const HTMLDraggableInputTemplate = (desc) => {
        return (0, HTMLElement_1.HTMLElementConstructor)("e-draggable", {
            props: {
                id: desc.id,
                className: desc.className
            },
            children: [
                (0, HTMLElement_1.HTMLElementConstructor)("input", {
                    props: {
                        name: desc.name,
                        hidden: true
                    }
                })
            ]
        });
    };
    exports.HTMLDraggableInputTemplate = HTMLDraggableInputTemplate;
});
//# sourceMappingURL=DraggableInputTemplate.js.map