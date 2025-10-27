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

export type ToolType = "select" | "eraser" | "pencil";

export type TodoType = ShapeType & {
  width: number;
  height: number;
}
