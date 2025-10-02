export type RectType = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  id: string;
  texts: TextType[];
  isCollapsed: boolean;
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
}
