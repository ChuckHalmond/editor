import { HTMLEMenuItemGroupElement } from "editor/elements/containers/menus/MenuItemGroup";
import { HTMLEMenuItemTemplateDescription } from "./MenuItemTemplate";
export { HTMLEMenuItemGroupTemplateDescription };
export { HTMLEMenuItemGroupTemplate };
declare type HTMLEMenuItemGroupTemplateDescription = Partial<Pick<HTMLEMenuItemGroupElement, 'id' | 'className' | 'name' | 'label'>> & {
    isGroup: true;
    items: HTMLEMenuItemTemplateDescription[];
};
interface HTMLEMenuItemGroupTemplate {
    (desc: HTMLEMenuItemGroupTemplateDescription): HTMLEMenuItemGroupElement;
}
declare const HTMLEMenuItemGroupTemplate: HTMLEMenuItemGroupTemplate;
