import Konva from "konva";

export interface DragEventWithSource extends Konva.KonvaEventObject<DragEvent> {
  source: Konva.Node;
}
