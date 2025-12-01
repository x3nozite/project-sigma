import type { RectType, ShapeType } from "../types";
export const countChildren = (rect: RectType, shapes: ShapeType[]) => {
  if (!rect.children) return { completed: 0, not_completed: 0 };
  let completed = 0;
  let not_completed = 0;
  rect.children.forEach((childId) => {
    const child = shapes.find((c) => "group-" + c.id === childId);
    if (!child) return;
    if (child.behavior === "node") {
      if (child.shape === "todo") {
        if (child.completed) completed++;
        else not_completed++;
      }
      if (child.shape === "rect") {
        const childCounts = countChildren(child, shapes);
        completed += childCounts.completed;
        not_completed += childCounts.not_completed;
      }
    }
  });
  return { completed, not_completed };
  // console.log(rect.children);
};
