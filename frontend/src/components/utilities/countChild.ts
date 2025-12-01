import type { RectType, ShapeType } from "../types";
export const countChildren = (rect: RectType, shapes: ShapeType[]) => {
  if (!rect.children) return { completed: 0, not_completed: 0 };
  let completed = 0;
  let not_completed = 0;
  rect.children.forEach((childId) => {
    const child = shapes.find((c) => "group-" + c.id === childId);
    if (!child) return;
    if (
      child.behavior === "node" &&
      child.shape === "todo" &&
      child.completed
    ) {
      completed++;
    } else {
      not_completed++;
    }
  });
  return { completed, not_completed };
  // console.log(rect.children);
};
