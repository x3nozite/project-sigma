export type ShapeType = {
  x: number;
  y: number;
  id: string;
  color: string;
  children: string[];
  parents: string;
  isCollapsed: boolean;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  name: string;
}

export type RectType = ShapeType & {
  width: number;
  height: number;
};

export type TextType = {
  id: string;
  value: string;
  fontSize: number;
};

export type ArrowType = {
  id: string;
  from: string;
  to: string;
};

export type ToolType = "hand" | "eraser" | "draw" | "select";

export type TodoType = ShapeType & {
  width: number;
  height: number;
}

export type LineType = ShapeType & {
  points: number[];
  stroke?: string;
  strokeWidth?: number;
};

export type SelectionRectType = {
  visible: boolean,
  x1: number,
  y1: number,
  x2: number,
  y2: number
}
