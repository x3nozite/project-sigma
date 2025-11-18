import { Arrow } from "react-konva";
import type { ArrowType } from "./types";
import Konva from "konva";

interface Props {
  connectors: ArrowType[],
  mainLayer: React.RefObject<Konva.Layer | null>,
}

const ArrowShape = ({ connectors, mainLayer }: Props) => {
  const getConnectorPoints = (fromGroup: Konva.Node, toGroup: Konva.Node, fromShape: Konva.Node, toShape: Konva.Node) => {
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

  return (
    <>
      {connectors.map((connector) => {
        const fromGroup = mainLayer.current?.findOne(`#${connector.from}`);
        const toGroup = mainLayer.current?.findOne(`#${connector.to}`);

        const fromShape = mainLayer.current?.findOne(`#${connector.from.replace(/^group-/, "")}`);
        const toShape = mainLayer.current?.findOne(`#${connector.to.replace(/^group-/, "")}`);

        if (!fromGroup || !toGroup || !fromShape || !toShape) return null;

        const points = getConnectorPoints(fromGroup, toGroup, fromShape, toShape);
        return (
          < Arrow
            key={connector.id}
            id={connector.id}
            points={points}
            fill="black"
            stroke="black"
          />
        )
      })}
    </>
  )
}


export default ArrowShape
