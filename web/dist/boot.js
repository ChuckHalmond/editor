define(["require", "exports", "./samples/Sandbox"], function (require, exports, Sandbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boot = void 0;
    async function boot() {
        await (0, Sandbox_1.sandbox)();
    }
    exports.boot = boot;
});
//# sourceMappingURL=boot.js.map