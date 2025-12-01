import type { RectType, ShapeType } from "../types";

export const completeRect = (rect: RectType, shapes: ShapeType[]) => {
  if (!rect.children) rect.completed = false;
  let completed = true;
  rect.children.forEach((childId) => {
    const child = shapes.find((c) => "group-" + c.id === childId);
    if (!child) return;
    if (child.behavior == "node") {
      if (!child.completed) {
        completed = false;
      }
    }
  });
  if (completed) rect.completed = true;
  else rect.completed = false;
};
