export function changeCursor(tool: string) {
  switch (tool) {
    case "hand":
      return "default";
    case "select":
      return "pointer";
    case "eraser":
      return "url('/rect-up/cursor.svg') 16 16, auto";
    case "draw":
      return "crosshair";
    default:
      return "default";
  }
}
