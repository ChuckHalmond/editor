var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HTMLEImportElementBase_instances, _HTMLEImportElementBase_importRequest;
import { CustomElement, AttributeProperty } from "../Element";
export { HTMLEImportElement };
let HTMLEImportElementBase = class HTMLEImportElementBase extends HTMLElement {
    constructor() {
        super(...arguments);
        _HTMLEImportElementBase_instances.add(this);
    }
    connectedCallback() {
        const { src } = this;
        if (src) {
            __classPrivateFieldGet(this, _HTMLEImportElementBase_instances, "m", _HTMLEImportElementBase_importRequest).call(this, src);
        }
    }
};
_HTMLEImportElementBase_instances = new WeakSet(), _HTMLEImportElementBase_importRequest = function _HTMLEImportElementBase_importRequest(src) {
    return __awaiter(this, void 0, void 0, function* () {
        this.outerHTML = yield fetch(src).then((response) => {
            if (response.ok) {
                return response.text();
            }
            else {
                throw new Error(response.statusText);
            }
        });
        this.dispatchEvent(new Event("load", { bubbles: true }));
    });
};
__decorate([
    AttributeProperty({ type: String })
], HTMLEImportElementBase.prototype, "src", void 0);
HTMLEImportElementBase = __decorate([
    CustomElement({
        name: "e-import"
    })
], HTMLEImportElementBase);
var HTMLEImportElement = HTMLEImportElementBase;
//# sourceMappingURL=Import.js.map