import { Component } from 'react';
import './style.scss';
import Vertex from '../../util/vertex';

const POS_MULTIPLE = 5;

interface Props {
  vertex: Vertex,
  setCurrentDragging: (args1: Vertex, args2: 'cw' | 'ccw') => void,
  direction?: 'cw' | 'ccw'
}

interface State {
  coord?: string,
  dragging: boolean
}

export default class Point extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dragging: false
    };

  }

  componentDidMount(): void {
    const { vertex } = this.props;
    this.setState({
      coord: vertex.getCoordsString()
    })
  }

  render() {
    const { vertex, setCurrentDragging, direction } = this.props; 

    let posX, posY: number 

    if (direction === 'cw') {
      posX = parseInt(vertex.cwBezierPoint.split(',')[0]) * POS_MULTIPLE;
      posY = parseInt(vertex.cwBezierPoint.split(',')[1]) * POS_MULTIPLE; 
    } else if (direction === 'ccw') {
      posX = parseInt(vertex.ccwBezierPoint.split(',')[0]) * POS_MULTIPLE;
      posY = parseInt(vertex.ccwBezierPoint.split(',')[1]) * POS_MULTIPLE; 
    } else {
      posX = vertex.x * POS_MULTIPLE;
      posY = vertex.y * POS_MULTIPLE; 
    }

    return (
      <div 
        className="point" 
        style={{  
          transform: `translate(${posX - 4}px,${posY - 4}px)`, 
          backgroundColor: 'black',
          width: '8px',
          height: '8px',
          borderRadius: '8px',
          opacity: '0.5'
        }}
        onMouseDown={() => setCurrentDragging(vertex, direction!)}
        >
      </div>
    )
  }
}