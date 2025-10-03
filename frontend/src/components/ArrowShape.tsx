import { Arrow } from "react-konva";
import type { ArrowType } from "./types";
import Konva from "konva";

interface Props {
  connectors: ArrowType[],
  mainLayer: React.RefObject<Konva.Layer>,
}

const ArrowShape = ({ connectors, mainLayer }: Props) => {
  const getConnectorPoints = (fromGroup, toGroup, fromShape, toShape) => {
    return [
      fromGroup.x() + fromShape.width() / 2,
      fromGroup.y() + fromShape.height() / 2,
      toGroup.x() + toShape.width() / 2,
      toGroup.y() + toShape.height() / 2
    ]
  };

  return (
    <>
      {connectors.map((connector) => {
        const fromGroup = mainLayer.current.findOne(`#${connector.from}`);
        const toGroup = mainLayer.current.findOne(`#${connector.to}`);

        const fromShape = mainLayer.current.findOne(`#${connector.from.replace(/^group-/, "")}`);
        const toShape = mainLayer.current.findOne(`#${connector.to.replace(/^group-/, "")}`);

        if (!fromGroup || !toGroup) return null;

        const points = getConnectorPoints(fromGroup, toGroup, fromShape, toShape);
        console.log(points);
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
