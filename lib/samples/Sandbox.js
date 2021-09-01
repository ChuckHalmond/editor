define(["require", "exports", "src/editor/elements/HTMLElement", "./Mockup", "./temp"], function (require, exports, HTMLElement_1, Mockup_1, temp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sandbox = void 0;
    class DataClassMixin extends HTMLElement_1.AttributeMutationMixinBase {
        constructor(attributeValue) {
            super("data-class", "listitem", attributeValue);
        }
    }
    class TestDataClassMixin extends DataClassMixin {
        constructor() {
            super("test");
        }
        attach(element) {
            element.addEventListener("click", TestDataClassMixin._clickEventListener);
        }
        detach(element) {
            element.removeEventListener("click", TestDataClassMixin._clickEventListener);
        }
    }
    TestDataClassMixin._clickEventListener = () => {
        alert("data-class test");
    };
    class InputDropzoneDataClassMixin extends DataClassMixin {
        constructor() {
            super("input-dropzone");
            this.datatransferEventListener = ((event) => {
                let target = event.target;
                if ((0, HTMLElement_1.isTagElement)("e-dropzone", target)) {
                    this.handlePostdatatransferInputNaming(target);
                }
            });
        }
        attach(element) {
            if ((0, HTMLElement_1.isTagElement)("e-dropzone", element)) {
                this.handlePostdatatransferInputNaming(element);
            }
            element.addEventListener("datachange", this.datatransferEventListener);
        }
        detach(element) {
            element.removeEventListener("datachange", this.datatransferEventListener);
        }
        handlePostdatatransferInputNaming(dropzone) {
            let name = dropzone.getAttribute("data-input-dropzone-name");
            if (name) {
                if (dropzone.multiple) {
                    let inputs = Array.from(dropzone.querySelectorAll("input"));
                    inputs.forEach((input, index) => {
                        input.name = `${name}[${index}]`;
                    });
                }
                else {
                    let input = dropzone.querySelector("input");
                    if (input) {
                        input.name = name;
                    }
                }
            }
        }
    }
    class TogglerSelectDataClassMixin extends DataClassMixin {
        constructor() {
            super("toggler-select");
            this.changeEventListener = (event) => {
                let target = event.target;
                if ((0, HTMLElement_1.isTagElement)("select", target)) {
                    this.handlePostchangeToggle(target);
                }
            };
        }
        attach(element) {
            element.addEventListener("change", this.changeEventListener);
            this.handlePostchangeToggle(element);
        }
        detach(element) {
            element.removeEventListener("change", this.changeEventListener);
        }
        handlePostchangeToggle(select) {
            const closestFieldset = select.closest("fieldset");
            let toToggleElement = null;
            if (closestFieldset) {
                Array.from(select.options).forEach((option, index) => {
                    toToggleElement = closestFieldset.querySelector(`[name=${option.value}]`);
                    if (toToggleElement) {
                        toToggleElement.hidden = (index !== select.selectedIndex);
                    }
                });
            }
        }
    }
    class DuplicaterInputDataClassMixin extends DataClassMixin {
        constructor() {
            super("duplicater-input");
            this.changeEventListener = (event) => {
                let target = event.target;
                if ((0, HTMLElement_1.isTagElement)("input", target)) {
                    this.handlePostchangeDuplicate(target);
                }
            };
        }
        attach(element) {
            element.addEventListener("change", this.changeEventListener);
            this.handlePostchangeDuplicate(element);
        }
        detach(element) {
            element.removeEventListener("change", this.changeEventListener);
        }
        handlePostchangeDuplicate(input) {
            const closestFieldset = input.closest("fieldset");
            const template = input.getAttribute("data-duplicater-template");
            const inputValue = parseInt(input.value);
            if (closestFieldset && template) {
                const duplicateElements = Array.from(closestFieldset.querySelectorAll(`[name=${template}]`));
                if (duplicateElements.length > 0) {
                    const lastElement = duplicateElements[duplicateElements.length - 1];
                    const templateElement = duplicateElements.splice(0, 1)[0];
                    templateElement.hidden = true;
                    while (duplicateElements.length > Math.max(inputValue, 0)) {
                        duplicateElements.pop().remove();
                    }
                    while (duplicateElements.length < inputValue) {
                        let newDuplicateElement = templateElement.cloneNode(true);
                        newDuplicateElement.hidden = false;
                        let duplicateIndex = newDuplicateElement.querySelector("[data-duplicater-index]");
                        if (duplicateIndex) {
                            duplicateIndex.textContent = (duplicateElements.length + 1).toString();
                        }
                        lastElement.insertAdjacentElement("afterend", newDuplicateElement);
                        duplicateElements.push(newDuplicateElement);
                    }
                }
            }
        }
    }
    class EnablerInputDataClassMixin extends DataClassMixin {
        constructor() {
            super("enabler-input");
            this.changeEventListener = (event) => {
                let target = event.target;
                if ((0, HTMLElement_1.isTagElement)("input", target)) {
                    this.handlePostchangeDuplicate(target);
                }
            };
        }
        attach(element) {
            element.addEventListener("change", this.changeEventListener);
            this.handlePostchangeDuplicate(element);
        }
        detach(element) {
            element.removeEventListener("change", this.changeEventListener);
        }
        handlePostchangeDuplicate(input) {
            const closestFieldset = input.closest("fieldset");
            const template = input.getAttribute("data-duplicater-template");
            const inputValue = parseInt(input.value);
            if (closestFieldset && template) {
                const duplicateElements = Array.from(closestFieldset.querySelectorAll(`[name=${template}]`));
                if (duplicateElements.length > 0) {
                    const lastDuplicateElement = duplicateElements[duplicateElements.length - 1];
                    const templateElement = duplicateElements.splice(0, 1)[0];
                    templateElement.hidden = true;
                    while (duplicateElements.length > Math.max(inputValue, 0)) {
                        duplicateElements.pop().remove();
                    }
                    while (duplicateElements.length < inputValue) {
                        let newDuplicateElement = templateElement.cloneNode(true);
                        newDuplicateElement.hidden = false;
                        let duplicateIndex = newDuplicateElement.querySelector("[data-duplicater-index]");
                        if (duplicateIndex) {
                            duplicateIndex.textContent = (duplicateElements.length + 1).toString();
                        }
                        lastDuplicateElement.insertAdjacentElement("afterend", newDuplicateElement);
                        duplicateElements.push(newDuplicateElement);
                    }
                }
            }
        }
    }
    class DynamicInputMixin extends HTMLElement_1.AttributeMutationMixinBase {
        constructor() {
            super("data-dynamic-input");
        }
        onInputEventCallback(event) {
            DynamicInputMixin.resizeInputElement(event.target);
        }
        static resizeInputElement(element) {
            let length = (element.value.length > 0) ? element.value.length : (element.placeholder.length > 0) ? element.placeholder.length : 0;
            length += (element.type === "number") ? 3 : (element.type === "text") ? 2 : 0;
            element.style.width = `${length * parseFloat(window.getComputedStyle(element).getPropertyValue("font-size")) * 0.60}px`;
        }
        attach(element) {
            if ((0, HTMLElement_1.isTagElement)("input", element)) {
                element.addEventListener("input", this.onInputEventCallback);
                DynamicInputMixin.resizeInputElement(element);
            }
        }
        detach(element) {
            if ((0, HTMLElement_1.isTagElement)("input", element)) {
                element.removeEventListener("input", this.onInputEventCallback);
            }
        }
    }
    const attributeMutationMixins = [
        new TestDataClassMixin(),
        new InputDropzoneDataClassMixin(),
        new TogglerSelectDataClassMixin(),
        new DuplicaterInputDataClassMixin(),
        new DynamicInputMixin()
    ];
    const mainObserver = new MutationObserver((0, HTMLElement_1.createMutationObserverCallback)(attributeMutationMixins));
    mainObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: attributeMutationMixins.map((mixin => mixin.attributeName))
    });
    async function sandbox() {
        // let tree = new TreeModel<MyNodeModel>({label: "lol", items: [{label: "hey"}]});
        // tree.addEventListener("modified", (event: ModelModifiedEvent) => {
        //   console.log(event);
        // });
        // console.log(tree);
        // tree.setItemProperty({row: 0}, "label", "lol");
        // console.log(tree.getItemProperty({row: 0}, "label"));
        await (0, Mockup_1.mockup)();
        //await start();
        (0, temp_1.temp)();
        /*editor.registerCommand("test", {
          exec: () => {
            alert("test");
          },
          context: "default"
        });*/
        /*window.addEventListener("blur", () => {
          document.body.focus();
        });*/
        /*const myWindow = window.open("http://localhost:8080/", "MsgWindow", "width=200,height=100");
        if (myWindow) {
        myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
        myWindow.addEventListener("message", (event) => {
            myWindow.document.body.innerHTML = event.data;
        }, false);
      
        setTimeout(() => {
            myWindow.postMessage("The user is 'bob' and the password is 'secret'", "http://localhost:8080/");
        }, 100);
      }*/
    }
    exports.sandbox = sandbox;
});
//# sourceMappingURL=Sandbox.js.map