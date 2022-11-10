import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_COLOR } from "./Theme";

export { resetStylesheet };

const resetStylesheet = new CSSStyleSheet();
resetStylesheet.replace(/*css*/`
    
    html.fullscreen,
    html.fullscreen > body {
        height: 100%;
    }

    dialog {
        overflow: visible;
    }

    body {
        font-size: 13px;
        margin: 0;
    }

    ::backdrop {
        background-color: rgba(120, 120, 120, 0.2);
    }

    ::selection {
        background-color: ${DEFAULT_THEME_SELECTED_ITEM_COLOR};
    }
    
    input,
    output,
    button,
    select,
    textarea {
        margin: 0;
        font-family: inherit;
        font-size: inherit;
        box-sizing: content-box;
    }

    dialog {
        box-sizing: border-box;
    }

    input {
        border: 1px solid grey;
    }

    legend {
        padding: 0 6px;
    }

    select,
    progress {
        height: 22px;
    }

    input {
        height: 18px;
    }

    input:is([type="radio"], [type="checkbox"]) {
        width: 18px; 
    }

    input[type="color" i] {
        border: none;
        padding: 0;
    }

    ::-webkit-color-swatch {
        border: none;
    }

    ::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    ::-webkit-search-cancel-button {
        appearance: none;
    }

    dialog,
    fieldset {
        padding: 8px;
        border: 1px solid lightgrey;
    }

    button[type="submit"] {
        border-width: 2px;
    }

    button:hover {
        background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
    }

    button:not([aria-pressed]):focus,
    button[aria-pressed="true"] {
        background-color: var(--theme-focused-item-color, ${DEFAULT_THEME_FOCUSED_ITEM_COLOR});
    }

    button {
        height: 18px;
        appearance: none;
        background: none;
        border: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
    }

    table {
        border-spacing: 0;
    }

    ul {
        padding: 0;
        margin: 0;
    }
`);