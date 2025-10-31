export function changeCursor(tool: string) {
  switch (tool) {
    case "select":
      return "default";
    case "eraser":
      return "url('../../../public/cursor/Bootstrap-Bootstrap-Bootstrap-eraser.svg') 16 16, auto";
    case "draw":
      return "crosshair";
    default:
      return "default";
  }
}
