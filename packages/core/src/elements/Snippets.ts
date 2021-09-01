export { forAllSubtreeElements };
export { forAllSubtreeNodes };
export { getPropertyFromPath };
export { setPropertyFromPath };
export { pointIntersectsWithDOMRect };

function forAllSubtreeElements(element: Element, func: (element: Element) => void) {
  let index = 0;
  func(element);
  while (index < element.children.length) {
    let child = element.children.item(index);
    if (child) {
      forAllSubtreeElements(child, func);
    }
    index++;
  }
}

function forAllSubtreeNodes(parent: Node & ParentNode, func: (childNode: Node & ChildNode, parentNode: Node & ParentNode) => void) {
  let index = 0;
  while (index < parent.childNodes.length) {
    let child = parent.childNodes.item(index);
    if (child) {
      func(child, parent);
      if (child.hasChildNodes()) {
        forAllSubtreeNodes(child as unknown as Node & ParentNode, func);
      }
    }
    index++;
  }
}

function getPropertyFromPath(src: object, path: string): any {
  const props = path.split(".");
  let obj: {[key: string]: any} | undefined  = src;
  props.forEach((prop) => {
    if (prop.includes("[")) {
      let index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
      if (Number.isNaN(index)) {
        console.error(`Wrong indexed path: ${prop}`);
      }
      prop = prop.substring(0, prop.indexOf("["));
      if (typeof obj === "object" && prop in obj && Array.isArray(obj[prop])) {
        obj = obj[prop][index];
      }
    }
    else if (typeof obj === "object" && prop in obj) {
      obj = obj[prop];
    }
    else {
      obj = void 0;
    }
  });
  return obj;
}

function setPropertyFromPath(src: object, path: string, value: any): object {
  const props = path.split(".");
  let obj: {[key: string]: any} = src;
  let lastPropIdx = props.length - 1;
  props.forEach((prop, idx) => {
    if (prop.includes("[")) {
      let index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
      if (Number.isNaN(index)) {
          console.error(`Wrong indexed path: ${prop}`);
      }
      prop = prop.substring(0, prop.indexOf("["));
      if (!Array.isArray(obj[prop])) {
        obj[prop] = [];
      }
      if (idx === lastPropIdx) {
        obj[prop][index] = value;
      }
      else {
        if (typeof obj[prop][index] !== "object") {
          obj[prop][index] = {}
        }
        obj = obj[prop][index];
      }
    }
    else {
      if (typeof obj[prop] !== "object") {
          obj[prop] = {}
      }
      if (idx === lastPropIdx) {
          obj[prop] = value;
      }
      else {
          obj = obj[prop];
      }
    }
  });
  return src;
}

function pointIntersectsWithDOMRect(x: number, y: number, rect: DOMRect) {
  return !(rect.left > x || 
    rect.right < x || 
    rect.top > y ||
    rect.bottom < y);
}