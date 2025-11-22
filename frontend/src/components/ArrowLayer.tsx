import type { ArrowType } from "./types";
import Konva from "konva";
import ArrowShape from "./Shapes/ArrowShape";

interface Props {
  connectors: ArrowType[],
  mainLayer: React.RefObject<Konva.Layer | null>,
}


const ArrowLayer = ({ connectors, mainLayer }: Props) => {

  return (
    <>
      {connectors.map((connector) => {
        return (
          < ArrowShape
            connector={connector}
            mainLayer={mainLayer}
          />
        )
      })}
    </>
  )
}


export default ArrowLayer
