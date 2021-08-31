import "src/editor/elements/lib/containers/menus/Menu";
import "src/editor/elements/lib/containers/menus/MenuButton";
import "src/editor/elements/lib/containers/menus/MenuBar";
import "src/editor/elements/lib/containers/menus/MenuItem";
import "src/editor/elements/lib/containers/menus/MenuItemGroup";
import "src/editor/elements/lib/containers/tabs/Tab";
import { HTMLETabElement } from "src/editor/elements/lib/containers/tabs/Tab";
import "src/editor/elements/lib/containers/tabs/TabList";
import "src/editor/elements/lib/containers/tabs/TabPanel";
import "src/editor/elements/lib/controls/draggable/Draggable";
import "src/editor/elements/lib/controls/draggable/Dragzone";
import "src/editor/elements/lib/controls/draggable/Dropzone";
import "src/editor/elements/lib/controls/draggable/DropzoneInput";
import "src/editor/elements/lib/utils/Import";
import "src/editor/elements/lib/utils/Loader";
import "src/editor/elements/lib/utils/WidthSash";
import "src/editor/elements/lib/utils/HeightSash";
import "src/editor/elements/lib/containers/treeview/TreeViewList";
import "src/editor/elements/lib/containers/treeview/TreeViewItem";

import "src/editor/elements/lib/controls/breadcrumb/BreadcrumbItem"
import "src/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail"

import { HTMLEDropzoneElement } from "src/editor/elements/lib/controls/draggable/Dropzone";
import { temp } from "./temp";
import { HTMLEMenuItemElement } from "src/editor/elements/lib/containers/menus/MenuItem";
import { Editor, EditorBase } from "src/editor/Editor";
import { Element, isTagElement } from "src/editor/elements/HTMLElement";
import { HTMLEMenuElement } from "src/editor/elements/lib/containers/menus/Menu";
import { HTMLETreeViewListElement } from "src/editor/elements/lib/containers/treeview/TreeViewList";
import { HTMLETreeViewItemElement } from "src/editor/elements/lib/containers/treeview/TreeViewItem";
import { HotKey, Key, KeyModifier } from "src/editor/Input";


const body = /*template*/`
    <link rel="stylesheet" href="../css/mockup.css"/>
    <div id="root" class="flex-rows">
        <!--<header id="header" class="flex-cols flex-none padded">
            <e-menubar tabindex="0">
                <e-menuitem name="file-menu" type="menu" label="File" tabindex="-1" aria-label="File">
                    <e-menu slot="menu" tabindex="-1">
                            <e-menuitem id="file-import-menu-button" name="file-import-menu-button" type="button" label="Import file"
                                tabindex="-1" aria-label="Import file"></e-menuitem>
                            <e-menuitem id="file-export-menu-button" name="file-export-menu-button" type="button" label="Export file"
                            tabindex="-1" aria-label="Export file"></e-menuitem>
                    </e-menu>
                </e-menuitem>
                <e-menuitem name="view-menu" type="menu" label="Preferences" tabindex="-1" aria-label="Preferences">
                    <e-menu slot="menu" tabindex="-1">
                        <e-menuitem name="view-boolean-menuitem" type="checkbox" label="Advanced User"
                        tabindex="-1" aria-label="Advanced User"></e-menuitem>
                        <e-menuitem name="view-layout-menuitem" type="submenu" label="Layout"
                        tabindex="-1" aria-label="Layout">
                            <e-menu slot="menu" name="view-layout-menu">
                                <e-menuitemgroup>
                                    <e-menuitem name="view-layout-standard-menuitem" type="radio" label="Standard"
                                    tabindex="-1" aria-label="Standard" checked></e-menuitem>
                                </e-menuitemgroup>
                            </e-menu>
                        </e-menuitem>
                    </e-menu>
                </e-menuitem>
            </e-menubar>
        </header>-->
        <main class="flex-cols flex-auto padded">
            <div id="tabs-col" class="flex-none">
                <e-tablist id="tablist">
                    <e-tab name="timeline" controls="timeline-panel" title="Timeline" tabindex="-1"><span class="tab__label">Timeline</span></e-tab>
                    <e-tab name="extract" controls="extract-panel" title="Extract" active tabindex="-1"><span class="tab__label">Extract</span></e-tab>
                    <e-tab name="transform" controls="transform-panel" title="Transform" tabindex="-1"><span class="tab__label">Transform</span></e-tab>
                    <e-tab name="export" controls="export-panel" title="Export" tabindex="-1"><span class="tab__label">Export</span></e-tab>
                </e-tablist>
            </div>
            <div id="data-col" class="flex-none">
                <e-tabpanel id="timeline-panel" class="padded-horizontal">
                    <span>Timeline</span>
                    <div id="timeline">
                        <details id="timeline-details" open>
                            <summary>Timeline</summary>
                            <e-treeviewlist tabindex="-1" id="treeviewlist">
                                <e-treeviewitem label="Extract" tabindex="-1">
                                    <e-treeviewitem label="[E.1] CSVExtractor" tabindex="-1" leaf></e-treeviewitem>
                                    <e-treeviewitem label="[E.2] NetezzaExtractor" tabindex="-1" leaf></e-treeviewitem>
                                </e-treeviewitem>
                                <e-treeviewitem label="Transform" tabindex="-1">
                                    <e-treeviewitem tabindex="-1">
                                        <span slot="label">[T.1] Loop</span>
                                        <e-treeviewitem tabindex="-1" leaf>
                                            <span slot="label">[T.1.1] Replace</span>
                                        </e-treeviewitem>
                                        <e-treeviewitem tabindex="-1" leaf>
                                            <span slot="label">[T.1.2] Merge</span>
                                        </e-treeviewitem>
                                    </e-treeviewitem>
                                </e-treeviewitem>
                                <e-treeviewitem tabindex="-1">
                                    <span slot="label">Load</span>
                                    <e-treeviewitem tabindex="-1" leaf>
                                        <span slot="label">[L.1] CSVExporter</span>
                                    </e-treeviewitem>
                                </e-treeviewitem>
                            </e-treeviewlist>
                        </details>
                    </div>
                </e-tabpanel>
                <e-tabpanel id="extract-panel" class="padded-horizontal">
                    <span>Extract</span>
                    <div id="datasets">
                        <details id="timeline-details" open>
                            <summary>Data</summary>
                            <e-dragzone id="constants-dragzone">
                                <e-draggable type="date"><input type="date" name="const"/></e-draggable>
                                <e-draggable type="datetime"><input type="datetime-local" name="const"/></e-draggable>
                                <e-draggable type="string"><input type="text" data-dynamic-input name="const" placeholder="string"/></e-draggable>
                                <e-draggable type="number"><input type="number" data-dynamic-input name="const" placeholder="number"/></e-draggable>
                                <e-draggable type="bool"><input type="text" name="const" value="True" readonly/></e-draggable>
                                <e-draggable type="bool"><input type="text" name="const" value="False" readonly/></e-draggable>
                            </e-dragzone>
                        </details>
                    </div>
                </e-tabpanel>
                <e-tabpanel id="transform-panel" class="padded-horizontal">
                    <span>Transform</span>
                    <div id="expressions">
                        <details>
                            <summary>Operators</summary>
                            <div class="details-content">
                                <e-dragzone id="constants-dragzone">
                                    <e-draggable type="date"><input type="date" name="const"/></e-draggable>
                                    <e-draggable type="datetime"><input type="datetime-local" name="const"/></e-draggable>
                                    <e-draggable type="string"><input type="text" data-dynamic-input name="const" placeholder="string"/></e-draggable>
                                    <e-draggable type="number"><input type="number" data-dynamic-input name="const" placeholder="number"/></e-draggable>
                                    <e-draggable type="bool"><input type="text" name="const" value="True" readonly/></e-draggable>
                                    <e-draggable type="bool"><input type="text" name="const" value="False" readonly/></e-draggable>
                                </e-dragzone>
                            </div>
                        </details>
                        <details>
                            <summary>Metrics</summary>
                            <e-dragzone id="metrics-dragzone">
                                <e-draggable tabindex="-1"><fieldset data-signature="max_function">max(<e-dropzone placeholder="col"></e-dropzone>)</fieldset></e-draggable>
                                <e-draggable tabindex="-1">notna(<e-dropzone placeholder="col"></e-dropzone>)</e-draggable>
                            </e-dragzone>
                        </details>
                        <details>
                            <summary>Expressions</summary>
                            <e-dragzone id="operators-dragzone">
                                <e-draggable tabindex="-1">(<e-dropzone placeholder="expr"></e-dropzone>)</e-draggable>
                            </e-dragzone>
                            <details class="indented">
                                <summary>boolean</summary>
                                <e-dragzone id="boolean-operators-dragzone">
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;and&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;or&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;<&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;>&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;==&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;!==&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                </e-dragzone>
                            </details>
                            <details class="indented">
                            <summary>numeric</summary>
                                <e-dragzone id="numeric-operators-dragzone">
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;+&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;-&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;/&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;*&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                </e-dragzone>
                            </details>
                        </details>
                        <details>
                            <summary>Functions</summary>
                            <e-dragzone id="functions-dragzone">
                                <e-draggable tabindex="-1">(<e-dragzone id="lambda"><e-draggable tabindex="-1">x</e-draggable></e-dragzone>)&nbsp;=>&nbsp;<e-dropzone placeholder="expr"></e-dropzone></e-draggable>
                            </e-dragzone>
                            <details class="indented">
                                <summary>string</summary>
                                <e-dragzone id="string-functions-dragzone">
                                    <e-draggable tabindex="-1">concat(<e-dropzone placeholder="left"></e-dropzone>, <e-dropzone placeholder="right"></e-dropzone>)</e-draggable>
                                </e-dragzone>
                            </details>
                            <details class="indented">
                                <summary>generator</summary>
                                <e-dragzone id="generator-functions-dragzone">
                                    <e-draggable tabindex="-1">range(<e-dropzone placeholder="number"></e-dropzone>)</e-draggable>
                                </e-dragzone>
                            </details>
                        </details>
                    </div>
                </e-tabpanel>
            </div>
            <e-wsash class="flex-none" controls="data-col"></e-wsash>
            <div class="col flex-auto padded-horizontal">
                <e-breadcrumbtrail class="margin-bottom">
                    <e-breadcrumbitem>Item 0</e-breadcrumbitem>
                    <e-breadcrumbitem>Item 1</e-breadcrumbitem>
                </e-breadcrumbtrail>
                <form id="extract-form">
                    <fieldset>
                        <details open>
                            <summary>
                                [E.1] Extractor 
                                <select class="doc-select" name="signature" data-class="toggler-select">
                                    <option value="netezza" selected>Netezza</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </summary>
                            <fieldset name="netezza" class="grid-fieldset margin-top" hidden>
                                <label for="user">User</label>
                                <input type="text" name="userid" required ondrop="event.preventDefault()"/>
                                <label for="password">Password</label>
                                <input type="password" name="password" required ondrop="event.preventDefault()"/>
                                <label for="database">Database</label>
                                <input type="text" name="database" required ondrop="event.preventDefault()"/>
                                <label for="query">Query</label>
                                <textarea name="query" required></textarea>
                                <label for="as">As</label>
                                <input type="text" name="as" required ondrop="event.preventDefault()"/>
                                <label for="column">Temp</label>
                                <e-dropzone multiple></e-dropzone>
                            </fieldset>
                            <fieldset name="csv" class="grid-fieldset margin-top" hidden>
                                <label for="filepath">Filepath</label>
                                <input name="filepath" type="file"/>
                                <label for="as">As</label>
                                <input type="text" name="as" required ondrop="event.preventDefault()"/>
                            </fieldset>
                        </details>
                        <div class="toolbar">
                            <button type="button" class="toolbar-item" name="execute" title="Execute"><span class="toolbar-item-label">Execute</span></button>
                            <hr class="toolbar-separator"/>
                            <button type="button" class="toolbar-item" name="delete" title="Delete"><span class="toolbar-item-label">Delete</span></button>
                        </div>
                        <div>
                            <span>Last execution datetime: never</span><br/>
                            <span>Last execution status: none</span>
                        </div>
                        <!--<button id="extract-button" type="submit">Extract</button>-->
                    </fieldset>
                </form>
                <!--<form id="transform-form">
                    <fieldset>
                        <details open>
                            <summary>Transformer
                                <select class="doc-select" data-class="toggler-select">
                                    <option value="replace" selected>Replace</option>
                                    <option value="merge">Merge</option>
                                    <option value="median_imputer">Median imputer</option>
                                </select>
                            </summary>
                            <fieldset name="merge" class="grid-fieldset indented margin-top">
                                <label for="left">Left</label>
                                <e-dropzone placeholder="dataframe"></e-dropzone>
                                <label for="right">Right</label>
                                <e-dropzone placeholder="dataframe"></e-dropzone>
                                <label for="on">On</label>
                                <e-dropzone placeholder="column(s)" multiple></e-dropzone>
                                <label for="how">How</label>
                                <select>
                                    <option value="left" selected>left</option>
                                    <option value="right">right</option>
                                </select>
                                <label for="outputDataframe">Output dataframe</label>
                                <input type="text" name="outputdataframe" required ondrop="event.preventDefault()"></input>
                            </fieldset>
                            <fieldset name="replace" class="grid-fieldset indented margin-top">
                                <label for="column">Column</label>
                                <e-dropzone></e-dropzone>
                                <label for="value">Value</label>
                                <e-dropzone></e-dropzone>
                                <label for="expression">Where</label>
                                <e-dropzone placeholder="boolean"></e-dropzone>
                            </fieldset>
                            <fieldset name="median_imputer" class="grid-fieldset indented margin-top">
                                <label for="column">Column(s)</label>
                                <e-dropzone multiple></e-dropzone>
                            </fieldset>
                        </details>
                        <div class="indented"><button id="transform-button" type="button">Transform</button></div>
                    </fieldset>
                </form>-->
            </div>
            <!--<div id="panels-col" class="col flex-auto padded-horizontal">
                <e-breadcrumbtrail class="margin-bottom">
                    <e-breadcrumbitem>Item 0</e-breadcrumbitem>
                    <e-breadcrumbitem>Item 1</e-breadcrumbitem>
                </e-breadcrumbtrail>
                <e-tabpanel id="extract-panel">
                </e-tabpanel>
                <e-tabpanel id="transform-panel">
                    <form id="transform-form">
                        <fieldset>
                            <details open>
                                <summary>Transformer
                                    <select class="doc-select" data-class="toggler-select">
                                        <option value="replace" selected>Replace</option>
                                        <option value="merge">Merge</option>
                                        <option value="median_imputer">Median imputer</option>
                                    </select>
                                </summary>
                                <fieldset name="merge" class="grid-fieldset indented margin-top">
                                    <label for="left">Left</label>
                                    <e-dropzone placeholder="dataframe"></e-dropzone>
                                    <label for="right">Right</label>
                                    <e-dropzone placeholder="dataframe"></e-dropzone>
                                    <label for="on">On</label>
                                    <e-dropzone placeholder="column(s)" multiple></e-dropzone>
                                    <label for="how">How</label>
                                    <select>
                                        <option value="left" selected>left</option>
                                        <option value="right">right</option>
                                    </select>
                                    <label for="outputDataframe">Output dataframe</label>
                                    <input type="text" name="outputdataframe" required ondrop="event.preventDefault()"></input>
                                </fieldset>
                                <fieldset name="replace" class="grid-fieldset indented margin-top">
                                    <label for="column">Column</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="value">Value</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="expression">Where</label>
                                    <e-dropzone placeholder="boolean"></e-dropzone>
                                </fieldset>
                                <fieldset name="median_imputer" class="grid-fieldset indented margin-top">
                                    <label for="column">Column(s)</label>
                                    <e-dropzone multiple></e-dropzone>
                                </fieldset>
                            </details>
                            <div class="indented"><button id="transform-button" type="button">Transform</button></div>
                        </fieldset>
                    </form>
                </e-tabpanel>
                <e-tabpanel id="export-panel">
                    <form id="export-form">
                    <fieldset>
                        <details open>
                            <summary>Exporter 
                                <select class="doc-select" data-class="toggler-select">
                                    <option value="csv">CSV</option>
                                </select>
                            </summary>
                            <fieldset name="csv" class="grid-fieldset indented margin-top" hidden>
                                <label for="filename">Filename</label>
                                <input type="text" name="filename" ondrop="event.preventDefault()" required></input>
                                <label for="columns">Columns</label>
                                <e-dropzone multiple id="columns" name="columns"></e-dropzone>
                            </fieldset>
                        </details>
                        <div class="indented"><button id="export-button" type="button">Export</button></div>
                    </fieldset>
                </form>
                </e-tab-panel>
            </div>-->
            <e-wsash id="doc-col-sash" class="flex-none" controls="doc-col"></e-wsash>
            <div id="doc-col" class="col flex-none">
                <div id="doc-container" class="padded"></div>
            </div>
        </main>
        <!--<footer class="flex-cols flex-none padded"></footer>-->
    </div>
`;

declare global {
    var marked: (src: string) => string;
 }

export async function mockup() {

    const bodyTemplate = document.createElement("template");
    bodyTemplate.innerHTML = body;
    document.body.appendChild(bodyTemplate.content);

    const editor = new EditorBase();
    
    editor.registerCommand("import", {
        exec(): void {
          alert("Import");
        },
        context: 'default'
    });

    editor.registerCommand("export", {
        exec(): void {
          alert("Export");
        },
        context: 'default'
    });

    editor.setup();
    
    let importMenuItem = document.getElementById("file-import-menu-button") as HTMLEMenuItemElement;
    if (importMenuItem) {
        importMenuItem.command = "import";
        importMenuItem.hotkey = new HotKey(Key.I, KeyModifier.Control, KeyModifier.Alt);
    }

    let exportMenuItem = document.getElementById("file-export-menu-button") as HTMLEMenuItemElement;
    if (exportMenuItem) {
        exportMenuItem.command = "export";
        exportMenuItem.hotkey = new HotKey(Key.J, KeyModifier.Control, KeyModifier.Alt);
    }

    const extractForm = document.querySelector<HTMLFormElement>("form#extract-form")
    
    const extractTab = document.querySelector<HTMLETabElement>("e-tab[name='extract']");
    const transformTab = document.querySelector<HTMLETabElement>("e-tab[name='transform']");
    const exportTab = document.querySelector<HTMLETabElement>("e-tab[name='export']");

    const extractButton = document.querySelector<HTMLButtonElement>("button#extract-button");
    const transformButton = document.querySelector<HTMLButtonElement>("button#transform-button");
    const exportButton = document.querySelector<HTMLButtonElement>("button#export-button");

    document.addEventListener("dragenter", (event) => {
        event.dataTransfer!.dropEffect = "copy";
    }, {capture: true});


    const treeviewlist = document.querySelector<HTMLETreeViewListElement>("#treeviewlist");
    if (treeviewlist) {
        treeviewlist.addEventListener("contextmenu", (event: MouseEvent) => {
            let target = event.target as HTMLETreeViewItemElement;
            console.log(target);
            if (isTagElement("e-treeviewitem", target)) {
                let menu = Element("e-menu", {
                    props: {
                        name: "My menu"
                    },
                    children: [
                        Element("e-menuitem", {
                            props: {
                                label: "Remove me!"
                            },
                            children: [
                                Element("span", {
                                    props: {
                                        slot: "label",
                                        className: "menuitem__icon"
                                    }
                                })
                            ]
                        })
                    ],
                    styles: {
                        "position": "absolute",
                        "top": `${event.clientY}px`,
                        "left": `${event.clientX}px`,
                    },
                    listeners: {
                        "focusout": (event: FocusEvent) => {
                            let target = event.target as Element;
                            let relatedTarget = event.relatedTarget as Element;
                            if (!menu.contains(relatedTarget)) {
                                target.remove();
                            }
                        },
                        "e-trigger": () => {
                            target.remove();
                            document.body.focus();
                        }
                    }
                });
                document.body.append(menu);
            }
            event.preventDefault();
        });
    }
    /*if (extractForm) {
        const jsonData = new JSONFormData(extractForm);
        console.log(jsonData.getData());
    }

    (window as any)["FormDataObject"] = FormDataObject;*/

    //(window as any)["StructuredFormData"] = StructuredFormData;

    function kebabize(str: string) {
        return str &&
            str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ?.map(x => x.toLowerCase())
            .join('-') || "";
    }

    function camelize(str: string) {
        return str.toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    function generateDataset(name: string, columns: string[]) {
        const datasetsDetails = document.querySelector<HTMLElement>("#datasets-details");
        if (datasetsDetails) {
            const dataset1Summary = document.createElement("summary");
            dataset1Summary.textContent = `${name}`;
            const dataset1Details = document.createElement("details");
            dataset1Details.classList.add("indented");
            dataset1Details.open = true;
            const dataset1Dragzone = document.createElement("e-dragzone");
            dataset1Dragzone.id = `dataset-${kebabize(name)}-dragzone`;
            const dataset1Draggable = document.createElement("e-draggable");
            dataset1Draggable.textContent = `${name}`;
            dataset1Dragzone.append(
                dataset1Draggable,
                ...columns.map((col) => {
                    let draggable = document.createElement("e-draggable");
                    draggable.textContent = `Col ${name}${col}`;
                    return draggable;
                })
            );
            dataset1Details.append(
                dataset1Summary, dataset1Dragzone
            );
            datasetsDetails.append(dataset1Details);
        }
    }

    const docs = new Map();
    docs.set(
        "netezza",
        "<b>Netezza</b> Extractor<br/>\
        <p>Extract data from a Netezza database.</p>\
        <p class='params'><span class='param-name'>User:</span><span>database user</span>\
        <span class='param-name'>Password:</span><span>user password</span>\
        <span class='param-name'>Database:</span><span>database name</span></p>"
    );
    docs.set(
        "csv",
        "<b>CSV</b> Extractor<br/>\
        <p>Extract data from a .csv file.</p>\
        <p class='params'><span class='param-name'>Filepath:</span><span>filepath to the .csv file</span>"
    );
    docs.set(
        "replace",
        "<b>Replace</b> Transformer<br/>\
        <p>Replace by a given value where a condition is met.</p>\
        <p class='params'><span class='param-name'>Columns:</span><span>the columns where the transformer will be applied</span>\
        <p class='params'><span class='param-name'>Value:</span><span>the value to use as a replacement</span>\
        <p class='params'><span class='param-name'>Where:</span><span>the condition to meet</span>"
    );

    function setDocstringText(name: string) {
        if (docContainer) {
            let docstring = docs.get(name);
            docContainer.innerHTML = docstring || "";
        }
    }

    const docContainer = document.getElementById("doc-container");
    const docsSelects = Array.from(document.querySelectorAll<HTMLSelectElement>("select.doc-select"));
    if (docsSelects.length > 0) {
        setDocstringText(docsSelects[0].value);
        docsSelects.forEach((select) => {
            select.addEventListener("change", () => {
                setDocstringText(select.value);
            });
        });
    }

    /*if (extractButton) {
        extractButton.addEventListener("click", () => {
            if (transformTab) {
                transformTab.active = true;
                generateDataset("[E.1] D1", [
                    "A", "B", "C", "D", "E", "F",
                ]);
                generateDataset("[E.2] D2", [
                    "A", "G", "H", "I", "J"
                ]);
            }
        });
    }*/

    if (transformButton) {
        transformButton.addEventListener("click", () => {
            if (exportTab) {
                exportTab.active = true;
                generateDataset("Merged", [
                    "M1 (M)", "M2 (M)"
                ]);
            }
        });
    }

    const info = {
        type: "df",
        name: "df"
    };

    const dropzone = document.querySelector<HTMLEDropzoneElement>("e-dropzone#columns");
    if (dropzone) {
        dropzone.addEventListener("datachange", () => {
            if (dropzone.multiple) {
                dropzone.draggables.forEach((draggable, index) => {
                    draggable.dataset.scope = `${dropzone.name}[${index}]`;
                });
            }
        });
    }

    if (exportButton) {
        exportButton.addEventListener("click", () => {
            alert("Tadam!");
            /*let form = document.querySelector("form");
            if (form) {
                let structuredFormData = new StructuredFormData(form).getStructuredFormData();
                let dataBlob = new Blob([JSON.stringify(structuredFormData, null, 4)], {type: "application/json"});

                let donwloadAnchor = document.createElement("a");
                donwloadAnchor.href = URL.createObjectURL(dataBlob);
                donwloadAnchor.download = "config.json";
                donwloadAnchor.click();
            }*/
        });
    }
}