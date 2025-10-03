import { Arrow } from "react-konva";
import type { ArrowType } from "./types";
import Konva from "konva";

interface Props {
  connectors: ArrowType[],
  mainLayer: React.RefObject<Konva.Layer>,
}

const ArrowShape = ({ connectors, mainLayer }: Props) => {
  const getConnectorPoints = (from, to) => {
    return [
      from.x() + from.width() / 2,
      from.y() + from.height() / 2,
      to.x() + to.width() / 2,
      to.y() + to.height() / 2
    ]
  };

  return (
    <>
      {connectors.map((connector) => {
        const fromNode = mainLayer.current.findOne(`#${connector.from}`);
        const toNode = mainLayer.current.findOne(`#${connector.to}`);
        if (!fromNode || !toNode) return null;

        const points = getConnectorPoints(fromNode, toNode);
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
