export function changeCursor(tool: string) {
  switch (tool) {
    case "select":
      return "default";
    case "eraser":
      return "url('../../../public/cursor.svg') 20 20, auto";
    case "draw":
      return "crosshair";
    default:
      return "default";
  }
}
