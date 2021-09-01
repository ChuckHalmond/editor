import { HTMLEMenuItemElement } from "src/editor/elements/lib/containers/menus/MenuItem";
import { Key, KeyModifier } from "src/editor/Input";
import { HTMLEMenuTemplateDescription } from "./MenuTemplate";
export { HTMLEMenuItemTemplateDescription };
export { HTMLEMenuItemTemplate };
declare type HTMLEMenuItemTemplateDescription = Pick<HTMLEMenuItemElement, 'name'> & Partial<Pick<HTMLEMenuItemElement, 'id' | 'className' | 'title' | 'type' | 'disabled'>> & {
    label?: string;
    icon?: string;
    command?: string;
    commandArgs?: any;
    hotkey?: {
        key: Key;
        mod1?: KeyModifier;
        mod2?: KeyModifier;
    };
    value?: string;
    checked?: boolean;
    statekey?: string;
    menu?: HTMLEMenuTemplateDescription;
    disabled?: boolean;
};
interface HTMLEMenuItemTemplate {
    (args: HTMLEMenuItemTemplateDescription): HTMLEMenuItemElement;
}
declare const HTMLEMenuItemTemplate: HTMLEMenuItemTemplate;
