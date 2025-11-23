
function segmentIntersectsRect(x1: number, y1: number, x2: number, y2: number, rx1: number, ry1: number, rx2: number, ry2: number) {

  // 1. Quick reject: segment completely outside rect
  if ((x1 < rx1 && x2 < rx1) || (x1 > rx2 && x2 > rx2) ||
    (y1 < ry1 && y2 < ry1) || (y1 > ry2 && y2 > ry2)) {
    return false;
  }

  // 2. If either endpoint is inside → intersect
  if (x1 >= rx1 && x1 <= rx2 && y1 >= ry1 && y1 <= ry2) return true;
  if (x2 >= rx1 && x2 <= rx2 && y2 >= ry1 && y2 <= ry2) return true;

  // 3. Check against each rect edge
  if (segmentsIntersect(x1, y1, x2, y2, rx1, ry1, rx2, ry1)) return true; // top
  if (segmentsIntersect(x1, y1, x2, y2, rx2, ry1, rx2, ry2)) return true; // right
  if (segmentsIntersect(x1, y1, x2, y2, rx2, ry2, rx1, ry2)) return true; // bottom
  if (segmentsIntersect(x1, y1, x2, y2, rx1, ry2, rx1, ry1)) return true; // left

  return false;
}

function segmentsIntersect(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number) {
  function ccw(px: number, py: number, qx: number, qy: number, rx: number, ry: number) {
    return (ry - py) * (qx - px) > (qy - py) * (rx - px);
  }
  return ccw(ax, ay, cx, cy, dx, dy) !== ccw(bx, by, cx, cy, dx, dy) &&
    ccw(ax, ay, bx, by, cx, cy) !== ccw(ax, ay, bx, by, dx, dy);
}
export function lineIntersectsRect(points: number[], rect: { x: number, y: number, width: number, height: number }) {
  const rx1 = rect.x;
  const ry1 = rect.y;
  const rx2 = rect.x + rect.width;
  const ry2 = rect.y + rect.height;

  // Check segment intersection for each line segment in the polyline
  for (let i = 0; i < points.length - 2; i += 2) {
    const x1 = points[i];
    const y1 = points[i + 1];
    const x2 = points[i + 2];
    const y2 = points[i + 3];

    if (segmentIntersectsRect(x1, y1, x2, y2, rx1, ry1, rx2, ry2)) {
      return true;
    }
  }
  return false;
}
