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
    @ReactiveProperty()
    declare tint: number;

    @ReactiveProperty()
    declare checkedImage: string;

    @ReactiveProperty()
    declare arrowRightImage: string;

    @ReactiveProperty()
    declare arrowDropDownImage: string;

    @ReactiveProperty()
    declare arrowDropUpImage: string;

    stylesheet: CSSStyleSheet;

    images(): Map<string, string> {
        return new Map([
            ["checkedImage", this.checkedImage],
            ["arrowRightImage", this.arrowRightImage],
            ["arrowDropDownImage", this.arrowDropDownImage],
            ["arrowDropUpImage", this.arrowDropUpImage],
        ])
    }

    constructor() {
        super();
        this.stylesheet = new CSSStyleSheet();
        this.stylesheet.replace(/*css*/`
            :root {
                --theme-accent-color: ${DEFAULT_THEME_ACCENT_COLOR};
                --theme-hovered-item-color: ${DEFAULT_THEME_HOVERED_ITEM_COLOR};
                --theme-focused-item-color: ${DEFAULT_THEME_FOCUSED_ITEM_COLOR};
                --theme-focused-item-outline-color: ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR};
                --theme-selected-item-color: ${DEFAULT_THEME_SELECTED_ITEM_COLOR};
                --theme-activated-item-color: ${DEFAULT_THEME_ACTIVATED_ITEM_COLOR};
                --theme-droptarget-item-color: ${DEFAULT_THEME_DROPTARGET_ITEM_COLOR};

                --theme-tint: ${DEFAULT_THEME_TINT};
                --theme-arrow-right-image: url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE});
                --theme-arrow-dropdown-image: url(${DEFAULT_THEME_ARROW_DROPDOWN_IMAGE});
                --theme-arrow-dropup-image: url(${DEFAULT_THEME_ARROW_DROPUP_IMAGE});
                --theme-checked-image: url(${DEFAULT_THEME_ARROW_DROPDOWN_IMAGE});

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
        this.addEventListener("modelchange", this.#handleModelChangeEvent.bind(this));
        this.tint = DEFAULT_THEME_TINT;
        this.arrowRightImage = DEFAULT_THEME_ARROW_RIGHT_IMAGE;
        this.arrowDropDownImage = DEFAULT_THEME_ARROW_DROPDOWN_IMAGE;
        this.arrowDropUpImage = DEFAULT_THEME_ARROW_DROPUP_IMAGE;
        this.checkedImage = DEFAULT_THEME_ARROW_DROPDOWN_IMAGE;
    }

    #handleModelChangeEvent() {
        const {stylesheet} = this;
        const variablesMap = (<CSSStyleRule>stylesheet.cssRules[0]).styleMap;
        const records = this.getRecords();
        records.forEach((record) => {
            const {propertyName, newValue} = record;
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
    }
}

const theme = new Theme();