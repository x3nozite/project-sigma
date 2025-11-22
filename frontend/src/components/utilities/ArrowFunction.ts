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

    const fromWidth = fromShape.width() * (fromNode.attrs.scalingX ?? 1);
    const fromHeight = fromShape.height() * (fromNode.attrs.scalingY ?? 1);

    const toWidth = toShape.width() * (toNode.attrs.scalingX ?? 1);
    const toHeight = toShape.height() * (toNode.attrs.scalingY ?? 1);

    arrowNode.points([
      fromNode.x() + fromWidth / 2 + vectorX * (fromWidth / 2 + offset),
      fromNode.y() + fromHeight / 2 + vectorY * (fromHeight / 2 + offset),
      toNode.x() + toWidth / 2 - vectorX * (toWidth / 2 + offset),
      toNode.y() + toHeight / 2 - vectorY * (toHeight / 2 + offset)
    ]);
  });
}

export const getConnectorPoints = (fromGroup: Konva.Node, toGroup: Konva.Node, fromShape: Konva.Node, toShape: Konva.Node) => {
  const dx = toGroup.x() - fromGroup.x();
  const dy = toGroup.y() - fromGroup.y();
  const dist = Math.sqrt(dx * dx + dy * dy);

  const vectorX = dx / dist;
  const vectorY = dy / dist;
  const offset = Math.min(30, dist / 5 - 1);

  const fromWidth = fromShape.width() * (fromGroup.attrs.scalingX ?? 1);
  const fromHeight = fromShape.height() * (fromGroup.attrs.scalingY ?? 1);
  const toWidth = toShape.width() * (toGroup.attrs.scalingX ?? 1);
  const toHeight = toShape.height() * (toGroup.attrs.scalingY ?? 1);

  return [
    fromGroup.x() + fromWidth / 2 + vectorX * (fromWidth / 2 + offset),
    fromGroup.y() + fromHeight / 2 + vectorY * (fromHeight / 2 + offset),
    toGroup.x() + toWidth / 2 - vectorX * (toWidth / 2 + offset),
    toGroup.y() + toHeight / 2 - vectorY * (toHeight / 2 + offset)
  ];
};
