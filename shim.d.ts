// ts支持vue组件
declare module "*.vue" {
  import { Component } from "vue";
  const component: Component;
  export default component;
}
// ts支持glsl着色器
declare module "*.glsl" {
  export default string;
}

// ts修改事件监听参数
declare interface HTMLElementEventMap {
  'mousewheel': WheelEvent;
}

// 声明固定长度数组
declare type TwoDigitTuple = [number, number];
declare type ThereDigitTuple = [number, number, number];

// webgl对象添加属性
declare type WebGLContext = WebGL2RenderingContext & {
  program: WebGLProgram;
};

// // 返回对象keys类型
declare interface ObjectConstructor {
  keys<T>(o: T): [keyof T];
  entries<T>(o: T): [keyof T, T[keyof T]][];
}