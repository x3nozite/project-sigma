export function changeCursor(tool: string) {
  switch (tool) {
    case "hand":
      return "default";
    case "select":
      return "pointer";
    case "eraser":
      return "url('../../../public/cursor.svg') 20 20, auto";
    case "draw":
      return "crosshair";
    default:
      return "default";
  }
}
