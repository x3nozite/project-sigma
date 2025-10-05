import { Arrow } from "react-konva";
import type { ArrowType } from "./types";
import Konva from "konva";

interface Props {
  connectors: ArrowType[],
  mainLayer: React.RefObject<Konva.Layer>,
}

const ArrowShape = ({ connectors, mainLayer }: Props) => {
  const getConnectorPoints = (fromGroup, toGroup, fromShape, toShape) => {
    const dx = toGroup.x() - fromGroup.x();
    const dy = toGroup.y() - fromGroup.y();
    const angle = Math.atan2(-dy, dx);

    const radius = 80;

    return [
      fromGroup.x() + fromShape.width() / 2 + -radius * Math.cos(angle + Math.PI),
      fromGroup.y() + fromShape.height() / 2 + radius * Math.sin(angle + Math.PI),
      toGroup.x() + toShape.width() / 2 - radius * Math.cos(angle),
      toGroup.y() + toShape.height() / 2 + radius * Math.sin(angle)
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
