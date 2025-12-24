import type Konva from "konva/lib/_CoreInternals"
import type { ArrowType } from "../types"
import { Arrow } from "react-konva";
import { useEffect, useState } from "react"
import { getConnectorPoints } from "../utilities/ArrowFunction"

interface Props {
  connector: ArrowType,
  mainLayer: React.RefObject<Konva.Layer | null>,
  eraseConnector: (id: string) => void;
}

const ArrowShape = ({ connector, mainLayer, eraseConnector }: Props) => {
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    const fromGroup = mainLayer.current?.findOne(`#${connector.from}`);
    const toGroup = mainLayer.current?.findOne(`#${connector.to}`);

    const fromShape = mainLayer.current?.findOne(
      `#${connector.from.replace(/^group-/, "")}`
    );
    const toShape = mainLayer.current?.findOne(
      `#${connector.to.replace(/^group-/, "")}`
    );

    if (!fromGroup || !toGroup || !fromShape || !toShape) return;

    const pts = getConnectorPoints(fromGroup, toGroup, fromShape, toShape);
    setPoints(pts);
  }, [mainLayer, connector]);

  return (
    <Arrow
      id={connector.id}
      points={points}
      fill="black"
      stroke="black"
      onClick={() => eraseConnector(connector.id)}
      hitStrokeWidth={30}
    />
  );
};

export default ArrowShape;
