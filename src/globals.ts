export {}

declare global {
    interface ElementInternals {
        role: string;
    }

    interface CSSStyleRule {
        styleMap: Map<string, string>;
    }
}