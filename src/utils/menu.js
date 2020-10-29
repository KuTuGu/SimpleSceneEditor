import Body from "../utils/object/index";

// Return the absolute offset
function getObjPosition(mousePos, objSize) {
  const { width, height } = objSize,
    { x: left, y: top } = mousePos,
    w = parseFloat(width),
    h = parseFloat(height);

  // Bottom right corner
  if (left + w < window.innerWidth && top + h < window.innerHeight) {
    return {
      x: left,
      y: top
    };
  }
  // Top right corner
  else if (left + w < window.innerWidth) {
    return {
      x: left,
      y: top - h
    };
  }
  // Bottom left corner
  else if (top + h < window.innerHeight) {
    return {
      x: left - w,
      y: top
    };
  }
  // Top left corner
  else {
    return {
      x: left - w,
      y: top - h
    };
  }
}

// Return the offset related to the parent's position
function getChildPosition(parent, child) {
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
      y: 0
    };
  }
  // Top right corner
  else if (left + w + x < window.innerWidth) {
    return {
      x: w,
      y: h - y
    };
  }
  // Bottom left corner
  else if (top + h + y < window.innerHeight) {
    return {
      x: -x,
      y: 0
    };
  }
  // Top left corner
  else {
    return {
      x: -x,
      y: h - y
    };
  }
}

function createObj(type, vm, target) {
  const { directory, objID } = vm.$store.state;
  let parent;

  // 父元素添加子元素ID
  if (target !== undefined) {
    directory[target].children.push(objID);
    parent = target;
  }

  // 实例化子物体
  directory[objID] = new Body[type]({
    name: type,
    type,
    id: objID,
    children: [],
    parent
  });

  // 更新目录
  vm.$store.commit("updateObjects", { ...directory });
  // 更新ID
  vm.$store.commit("updateObjID");
}

export { getObjPosition, getChildPosition, createObj };
