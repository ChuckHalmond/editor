var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Theme_instances, _Theme_handleModelChangeEvent;
import DEFAULT_THEME_ARROW_RIGHT_IMAGE from "../../assets/arrow_right_FILL0_wght400_GRAD0_opsz48.svg";
import DEFAULT_THEME_ARROW_DROPDOWN_IMAGE from "../../assets/arrow_drop_down_FILL0_wght400_GRAD0_opsz48.svg";
import DEFAULT_THEME_ARROW_DROPUP_IMAGE from "../../assets/arrow_drop_up_FILL0_wght400_GRAD0_opsz48.svg";
import DEFAULT_THEME_CHECKED_IMAGE from "../../assets/done_FILL0_wght400_GRAD0_opsz48.svg";
import openSansTtf from "../../assets/fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf";
import { ModelObject, ReactiveProperty } from "../models/Model";
export { theme };
export { DEFAULT_THEME_HOVERED_ITEM_COLOR };
export { DEFAULT_THEME_FOCUSED_ITEM_COLOR };
export { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR };
export { DEFAULT_THEME_SELECTED_ITEM_COLOR };
export { DEFAULT_THEME_ACTIVATED_ITEM_COLOR };
export { DEFAULT_THEME_DROPTARGET_ITEM_COLOR };
export { DEFAULT_THEME_ARROW_RIGHT_IMAGE };
export { DEFAULT_THEME_ARROW_DROPDOWN_IMAGE };
export { DEFAULT_THEME_ARROW_DROPUP_IMAGE };
export { DEFAULT_THEME_CHECKED_IMAGE };
const DEFAULT_THEME_TINT = 203;
const DEFAULT_THEME_ACCENT_COLOR = `hsl(var(--theme-tint, ${DEFAULT_THEME_TINT}), 92%, 50%, 50%)`;
const DEFAULT_THEME_HOVERED_ITEM_COLOR = `hsl(var(--theme-tint, ${DEFAULT_THEME_TINT}), 92%, 80%, 50%)`;
const DEFAULT_THEME_FOCUSED_ITEM_COLOR = `hsl(var(--theme-tint, ${DEFAULT_THEME_TINT}), 92%, 50%, 50%)`;
const DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR = `hsl(var(--theme-tint, ${DEFAULT_THEME_TINT}), 92%, 50%)`;
const DEFAULT_THEME_SELECTED_ITEM_COLOR = `hsl(var(--theme-tint, ${DEFAULT_THEME_TINT}), 92%, 75%, 75%)`;
const DEFAULT_THEME_ACTIVATED_ITEM_COLOR = `hsl(var(--theme-tint, ${DEFAULT_THEME_TINT}), 92%, 50%, 50%)`;
const DEFAULT_THEME_DROPTARGET_ITEM_COLOR = `hsl(var(--theme-tint, ${DEFAULT_THEME_TINT}), 92%, 50%, 50%)`;
class Theme extends ModelObject {
    constructor() {
        super();
        _Theme_instances.add(this);
        this.stylesheet = new CSSStyleSheet();
        this.stylesheet.replace(/*css*/ `
            :root {
                --theme-accent-color: ${DEFAULT_THEME_ACCENT_COLOR};
                --theme-hovered-item-color: ${DEFAULT_THEME_HOVERED_ITEM_COLOR};
                --theme-focused-item-color: ${DEFAULT_THEME_FOCUSED_ITEM_COLOR};
                --theme-focused-item-outline-color: ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR};
                --theme-selected-item-color: ${DEFAULT_THEME_SELECTED_ITEM_COLOR};
                --theme-activated-item-color: ${DEFAULT_THEME_ACTIVATED_ITEM_COLOR};
                --theme-droptarget-item-color: ${DEFAULT_THEME_DROPTARGET_ITEM_COLOR};

                --theme-arrow-color: var(--font-color);
                --theme-arrow-icon-collapsed: var(--arrow-right);
                --theme-arrow-icon-expanded: var(--arrow-dropdown);

                --theme-sortorder-indicator-color: var(--font-color);
                --theme-sortorder-indicator-ascending: var(--arrow-dropup);
                --theme-sortorder-indicator-descending: var(--arrow-dropdown);
            }
            
            @font-face {
                font-family: "Open Sans";
                src: url(${openSansTtf}) format("truetype")
            }

            :root {
                font-size: 10px;
                font-family: "Open Sans";
                accent-color: var(--theme-accent-color);
            }

            ::selection {
                background-color: var(--theme-selected-item-color);
            }
        `);
        this.addEventListener("modelchange", __classPrivateFieldGet(this, _Theme_instances, "m", _Theme_handleModelChangeEvent).bind(this));
        this.tint = DEFAULT_THEME_TINT;
        this.arrowRightImage = DEFAULT_THEME_ARROW_RIGHT_IMAGE;
        this.arrowDropDownImage = DEFAULT_THEME_ARROW_DROPDOWN_IMAGE;
        this.arrowDropUpImage = DEFAULT_THEME_ARROW_DROPUP_IMAGE;
        this.checkedImage = DEFAULT_THEME_ARROW_DROPDOWN_IMAGE;
    }
    images() {
        return new Map([
            ["checkedImage", this.checkedImage],
            ["arrowRightImage", this.arrowRightImage],
            ["arrowDropDownImage", this.arrowDropDownImage],
            ["arrowDropUpImage", this.arrowDropUpImage],
        ]);
    }
}
_Theme_instances = new WeakSet(), _Theme_handleModelChangeEvent = function _Theme_handleModelChangeEvent() {
    const { stylesheet } = this;
    const variablesMap = stylesheet.cssRules[0].styleMap;
    const records = this.getRecords();
    records.forEach((record) => {
        const { propertyName, newValue } = record;
        switch (propertyName) {
            case "tint": {
                variablesMap.set("--theme-tint", String(newValue));
                break;
            }
            case "checkedImage": {
                variablesMap.set("--theme-checked-image", `url(${String(newValue)})`);
                break;
            }
            case "arrowRightImage": {
                variablesMap.set("--theme-arrow-right-image", `url(${String(newValue)})`);
                break;
            }
            case "arrowDropDown": {
                variablesMap.set("--theme-arrow-dropdown-image", `url(${String(newValue)})`);
                break;
            }
            case "arrowDropUp": {
                variablesMap.set("--theme-arrow-dropup-image", `url(${String(newValue)})`);
                break;
            }
        }
    });
};
__decorate([
    ReactiveProperty()
], Theme.prototype, "tint", void 0);
__decorate([
    ReactiveProperty()
], Theme.prototype, "checkedImage", void 0);
__decorate([
    ReactiveProperty()
], Theme.prototype, "arrowRightImage", void 0);
__decorate([
    ReactiveProperty()
], Theme.prototype, "arrowDropDownImage", void 0);
__decorate([
    ReactiveProperty()
], Theme.prototype, "arrowDropUpImage", void 0);
const theme = new Theme();
//# sourceMappingURL=Theme.js.map