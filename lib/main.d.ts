import "./index";
declare global {
    interface ElementInternals {
        role: string;
    }
    interface ShadowRoot {
        adoptedStyleSheets: StyleSheet[];
    }
    interface CSSStyleSheet {
        replace(css: string): void;
    }
}
export declare function main(): Promise<void>;
