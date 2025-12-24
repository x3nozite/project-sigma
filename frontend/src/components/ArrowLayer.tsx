import type { ArrowType } from "./types";
import Konva from "konva";
import ArrowShape from "./Shapes/ArrowShape";

interface Props {
  connectors: ArrowType[],
  mainLayer: React.RefObject<Konva.Layer | null>,
  eraseConnector: (id: string) => void;
}


const ArrowLayer = ({ connectors, mainLayer, eraseConnector }: Props) => {

  return (
    <>
      {connectors.map((connector) => {
        return (
          < ArrowShape
            key={connector.id}
            connector={connector}
            mainLayer={mainLayer}
            eraseConnector={eraseConnector}
          />
        )
      })}
    </>
  )
}


export default ArrowLayer
