import arrowRight from "../../assets/arrow_right_FILL0_wght400_GRAD0_opsz48.svg";
import arrowDropDown from "../../assets/arrow_drop_down_FILL0_wght400_GRAD0_opsz48.svg";
import arrowDropUp from "../../assets/arrow_drop_up_FILL0_wght400_GRAD0_opsz48.svg";
export { themeStylesheet };
const themeStylesheet = new CSSStyleSheet();
themeStylesheet.replace(/*css*/ `
    :root {
        --font-color: black;
        
        --icon-size: 18px;

        --line-height: 18px;
        --padded-line-height: 22px;

        --menu-box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px;

        --primary-color: white;
        --secondary-color: white;

        --text-color: white;
        --text-darker-color: white;
        --text-lighter-color: white;

        --content-background-color: white;
        --item-border-color: grey;
        --section-border-color: lightgrey;
        --padding-background-color: gainsboro;

        --accent-color: hsl(212, 100%, 50%);
        --hovered-item-color: hsl(203, 92%, 80%, 50%);
        --focused-item-color: hsl(203, 92%, 50%, 50%);
        --focused-item-outline-color: hsl(203, 92%, 50%);
        --selected-item-color: hsl(203, 92%, 75%, 75%);
        --activated-item-color: hsl(203, 92%, 50%, 50%);
        --droptarget-item-color: hsl(203, 92%, 50%, 50%);

        --arrow-color: var(--font-color);
        --arrow-icon-collapsed: url(${arrowRight});
        --arrow-icon-expanded: url(${arrowDropDown});

        --sortorder-indicator-color: var(--font-color);
        --sortorder-indicator-ascending: url(${arrowDropUp});
        --sortorder-indicator-descending: url(${arrowDropDown});
    }
`);
//# sourceMappingURL=Theme.js.map