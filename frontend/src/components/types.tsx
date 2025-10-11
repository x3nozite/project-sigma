export type RectType = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  isCollapsed: boolean;
  children: string[];
  parents: string[];
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
