import "src/editor/elements/lib/containers/menus/Menu";
import "src/editor/elements/lib/containers/menus/MenuButton";
import "src/editor/elements/lib/containers/menus/MenuBar";
import "src/editor/elements/lib/containers/menus/MenuItem";
import "src/editor/elements/lib/containers/menus/MenuItemGroup";
import "src/editor/elements/lib/containers/tabs/Tab";
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
import "src/editor/elements/lib/controls/breadcrumb/BreadcrumbItem";
import "src/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail";
declare global {
    var marked: (src: string) => string;
}
export declare function mockup(): Promise<void>;
