import { HTMLElementConstructor } from "../../elements/HTMLElement";
export { HTMLDraggableInputTemplate };
const HTMLDraggableInputTemplate = (desc) => {
    return HTMLElementConstructor("e-draggable", {
        props: {
            id: desc.id,
            className: desc.className
        },
        children: [
            HTMLElementConstructor("input", {
                props: {
                    name: desc.name,
                    hidden: true
                }
            })
        ]
    });
};
//# sourceMappingURL=DraggableInputTemplate.js.map