export type RectType = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  texts: TextType[];
  isCollapsed: boolean;
};
export type TextType = {
  id: string;
  value: string;
  fontSize: number;
};
