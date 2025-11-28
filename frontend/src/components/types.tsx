export type BaseShape = {
  id: string;
  x: number;
  y: number;
  shape: "rect" | "todo" | "circle";
  behavior: "node" | "edge" | "decor";
  color: string;
  isCollapsed: boolean;
  scaleX: number;
  scaleY: number;
};

export type RectType = BaseShape & {
  shape: "rect";
  behavior: "node";
  width: number;
  height: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  children: string[];
  parents: string;
};

export type ArrowType = {
  shape: "connector";
  id: string;
  from: string;
  to: string;
};

export type TodoType = BaseShape & {
  shape: "todo";
  behavior: "node";
  width: number;
  height: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  parents: string;
  completed: boolean;
  assignee: string;
};

export type LineType = {
  shape: "line";
  behavior: "decor";
  id: string;
  color: string;
  points: number[];
  stroke?: string;
  strokeWidth?: number;
  scaleX: number;
  scaleY: number;
};

export type SelectionRectType = {
  visible: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type TextType = {
  id: string;
  x: number;
  y: number;
  fontSize: number;
  text: string;
  shape: string;
  behavior: string;
  scaleX: number;
  scaleY: number;
}

export type ToolType = "hand" | "eraser" | "draw" | "select";

export type ShapeType = RectType | TodoType | LineType | TextType;
