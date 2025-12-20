type Point = { x: number; y: number };

function getSqSegDist(p: Point, p1: Point, p2: Point) {
  let x = p1.x;
  let y = p1.y;
  let dx = p2.x - x;
  let dy = p2.y - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

    if (t > 1) {
      x = p2.x;
      y = p2.y;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p.x - x;
  dy = p.y - y;

  return dx * dx + dy * dy;
}

function simplifyDPStep(
  points: Point[],
  first: number,
  last: number,
  sqTolerance: number,
  simplified: Point[]
) {
  let maxSqDist = sqTolerance;
  let index = -1;

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);
    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (index !== -1) {
    if (index - first > 1)
      simplifyDPStep(points, first, index, sqTolerance, simplified);

    simplified.push(points[index]);

    if (last - index > 1)
      simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}

export function simplifyLine(points: number[], tolerance = 1.5): number[] {
  if (points.length < 4) return points;

  const pts: Point[] = [];
  for (let i = 0; i < points.length; i += 2) {
    pts.push({ x: points[i], y: points[i + 1] });
  }

  const sqTolerance = tolerance * tolerance;

  const simplified: Point[] = [pts[0]];
  simplifyDPStep(pts, 0, pts.length - 1, sqTolerance, simplified);
  simplified.push(pts[pts.length - 1]);


  const result: number[] = [];
  for (const p of simplified) {
    result.push(p.x, p.y);
  }

  return result;
}
