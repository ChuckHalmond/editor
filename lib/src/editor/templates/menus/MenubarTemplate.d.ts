import { HTMLEMenuBarElement } from "src/editor/elements/lib/containers/menus/MenuBar";
import { HTMLEMenuItemTemplateDescription } from "./MenuItemTemplate";
export { HTMLEMenubarTemplateDescription };
export { HTMLEMenubarTemplate };
declare type HTMLEMenubarTemplateDescription = Partial<Pick<HTMLEMenuBarElement, 'id' | 'className' | 'tabIndex'>> & {
    items: HTMLEMenuItemTemplateDescription[];
};
interface HTMLEMenubarTemplate {
    (desc: HTMLEMenubarTemplateDescription): HTMLEMenuBarElement;
}
declare const HTMLEMenubarTemplate: HTMLEMenubarTemplate;
