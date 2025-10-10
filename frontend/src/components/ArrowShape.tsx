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
    return [
      fromGroup.x() + fromShape.width() / 2 + vectorX * (fromShape.width() / 2 + offset),
      fromGroup.y() + fromShape.height() / 2 + vectorY * (fromShape.height() / 2 + offset),
      toGroup.x() + toShape.width() / 2 - vectorX * (toShape.width() / 2 + offset),
      toGroup.y() + toShape.height() / 2 - vectorY * (toShape.height() / 2 + offset)
    ]
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
