import type { ArrowType } from "../types";
import Konva from "konva";
import type { RefObject } from "react";

export function arrowMovement(connectors: ArrowType[], mainLayer: RefObject<Konva.Layer | null>, tempLayer: RefObject<Konva.Layer | null>, arrowLayer: RefObject<Konva.Layer | null>) {
  connectors.forEach((connector) => {
    if (!mainLayer.current || !tempLayer.current) return;
    const fromNode =
      tempLayer.current.findOne(`#${connector.from}`) ||
      mainLayer.current.findOne(`#${connector.from}`);
    const toNode =
      tempLayer.current.findOne(`#${connector.to}`) ||
      mainLayer.current.findOne(`#${connector.to}`);
    const arrowNode = arrowLayer.current?.findOne(`#${connector.id}`) as Konva.Arrow;

    const fromShape =
      mainLayer.current.findOne(
        `#${connector.from.replace(/^group-/, "")}`
      ) ||
      tempLayer.current.findOne(`#${connector.from.replace(/^group-/, "")}`);
    const toShape =
      mainLayer.current.findOne(`#${connector.to.replace(/^group-/, "")}`) ||
      tempLayer.current.findOne(`#${connector.to.replace(/^group-/, "")}`);

    if (!fromNode || !toNode || !arrowNode || !fromShape || !toShape) return;

    const dx = toNode.x() - fromNode.x();
    const dy = toNode.y() - fromNode.y();
    const dist = Math.sqrt(dx * dx + dy * dy);

    const vectorX = dx / dist;
    const vectorY = dy / dist;
    const offset = Math.min(30, dist / 5 - 1);

    arrowNode.points([
      fromNode.x() + fromShape.width() / 2 + vectorX * (fromShape.width() / 2 + offset),
      fromNode.y() + fromShape.height() / 2 + vectorY * (fromShape.height() / 2 + offset),
      toNode.x() + toShape.width() / 2 - vectorX * (toShape.width() / 2 + offset),
      toNode.y() + toShape.height() / 2 - vectorY * (toShape.height() / 2 + offset)
    ]);
  });
}
