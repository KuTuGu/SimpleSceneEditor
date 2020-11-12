import { Store } from "vuex";
import Obj from "../utils/object/index";

export interface PositionProps {
  x: number;
  y: number;
}

// Return the absolute offset
function getObjPosition(
  mousePos: PositionProps,
  objSize: { width: number; height: number }
): PositionProps {
  const { width: w, height: h } = objSize,
    { x: left, y: top } = mousePos;

  // Bottom right corner
  if (left + w < window.innerWidth && top + h < window.innerHeight) {
    return {
      x: left,
      y: top,
    };
  }
  // Top right corner
  else if (left + w < window.innerWidth) {
    return {
      x: left,
      y: top - h,
    };
  }
  // Bottom left corner
  else if (top + h < window.innerHeight) {
    return {
      x: left - w,
      y: top,
    };
  }
  // Top left corner
  else {
    return {
      x: left - w,
      y: top - h,
    };
  }
}

// Return the offset related to the parent's position
function getChildPosition(
  parent: HTMLElement,
  child: HTMLElement
): PositionProps {
  const { width, height } = getComputedStyle(parent),
    { width: offsetX, height: offsetY } = getComputedStyle(child),
    { left, top } = parent.getBoundingClientRect(),
    w = parseFloat(width),
    h = parseFloat(height),
    x = parseFloat(offsetX),
    y = parseFloat(offsetY);

  // Bottom right corner
  if (left + w + x < window.innerWidth && top + h + y < window.innerHeight) {
    return {
      x: w,
      y: 0,
    };
  }
  // Top right corner
  else if (left + w + x < window.innerWidth) {
    return {
      x: w,
      y: h - y,
    };
  }
  // Bottom left corner
  else if (top + h + y < window.innerHeight) {
    return {
      x: -x,
      y: 0,
    };
  }
  // Top left corner
  else {
    return {
      x: -x,
      y: h - y,
    };
  }
}

function createObj(
  type: keyof typeof Obj,
  store: Store<any>,
  target: number
): void {
  const { directory, objID, gl } = store.state;
  let parent;

  // 父元素添加子元素ID
  if (target !== undefined) {
    directory[target].children.push(objID);
    parent = target;
  }

  // 实例化子物体
  directory[objID] = new Obj[type]({
    name: type,
    type,
    id: objID,
    children: [],
    parent,
  });

  directory[objID].render(gl);

  // 更新目录
  store.commit("updateObjects", { ...directory });
  // 更新ID
  store.commit("updateObjID");
}

export { getObjPosition, getChildPosition, createObj };
