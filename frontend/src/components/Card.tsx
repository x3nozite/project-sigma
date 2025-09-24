import Draggable from 'react-draggable';
import { useRef } from 'react';

const Card = (props: any) => {

  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef}>
      <div ref={nodeRef} className="card">
        <div className="header">{props.title}</div>
        <div className="content">Content</div>
      </div>
    </Draggable>
  )
}

export default Card;