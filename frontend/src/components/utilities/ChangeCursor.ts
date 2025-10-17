export function changeCursor(tool: string) {
  switch (tool) {
    case "select":
      return "default";
    case "eraser":
      return "pointer";
    default:
      return "default";
  }
}
