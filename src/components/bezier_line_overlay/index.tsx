import { Component } from 'react';
import './style.scss';
import Vertex from '../../util/vertex';

interface Props {
  vertices: Vertex []
  isEdit: boolean
}

interface State {

}

export default class BezierLineOverlay extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { vertices, isEdit } = this.props
    return (
      <div className="bezier_line_overlay">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" width={500} height={500}>
          {
            isEdit ? 
            vertices.map(vertex => {
              return <line 
                x1={vertex.x} 
                y1={vertex.y}
                x2={vertex.cwBezierPoint.split(',')[0]}
                y2={vertex.cwBezierPoint.split(',')[1]}
                stroke="black" 
                stroke-width="0.4"
                opacity={0.3}
              ></line>
            })
            : null
          }
          {
            isEdit ? 
            vertices.map(vertex => {
              return <line 
                x1={vertex.x} 
                y1={vertex.y}
                x2={vertex.ccwBezierPoint.split(',')[0]}
                y2={vertex.ccwBezierPoint.split(',')[1]}
                stroke="black" 
                stroke-width="0.4"
                opacity={0.3}
              ></line>
            })
            : null
          }
        </svg>
      </div>
    )
  }
}

