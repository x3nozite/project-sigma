import { Arrow } from "react-konva";
import type { ArrowType, RectType } from "./types";

interface Props {
  connectors: ArrowType[],
  setConnectors: React.Dispatch<React.SetStateAction<ArrowType[]>>;
  rectangles: RectType[],
}

const ArrowShape = ({ connectors, setConnectors, rectangles }: Props) => {
  const getConnectorPoints = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(-dy, dx);

    const radius = 0;

    //return [
    //  from.x + -radius * Math.cos(angle + Math.PI),
    //  from.y + -radius * Math.sin(angle + Math.PI),
    //  to.x + -radius * Math.cos(angle),
    //  to.y + -radius * Math.sin(angle)
    //];
    //
    return [
      from.x + from.width / 2,
      from.y + from.height / 2,
      to.x + to.width / 2,
      to.y + to.height / 2
    ]
  };

  return (
    <>
      {connectors.map((connector) => {
        const fromNode = rectangles.find((r) => r.id === connector.from);
        const toNode = rectangles.find((r) => r.id === connector.to);

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
