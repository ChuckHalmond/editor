import { HTMLEMenuElement } from "src/editor/elements/lib/containers/menus/Menu";
import { HTMLEMenuItemGroupTemplateDescription } from "./MenuItemGroupTemplate";
import { HTMLEMenuItemTemplateDescription } from "./MenuItemTemplate";
export { HTMLEMenuTemplateDescription };
export { HTMLEMenuTemplate };
declare type HTMLEMenuTemplateDescription = Partial<Pick<HTMLEMenuElement, 'id' | 'className' | 'name'>> & {
    items: (HTMLEMenuItemTemplateDescription | HTMLEMenuItemGroupTemplateDescription)[];
};
interface HTMLEMenuTemplate {
    (desc: HTMLEMenuTemplateDescription): HTMLEMenuElement;
}
declare const HTMLEMenuTemplate: HTMLEMenuTemplate;
