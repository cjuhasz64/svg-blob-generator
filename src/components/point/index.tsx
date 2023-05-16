import { Component } from 'react';
import './style.scss';
import Vertex from '../../util/vertex';

const POS_MULTIPLE = 5;

interface Props {
  vertex: Vertex,
  setCurrentDragging: (args1: Vertex) => void
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
    const { vertex, setCurrentDragging } = this.props; 

    const posX = vertex.x * POS_MULTIPLE;
    const posY = vertex.y * POS_MULTIPLE; 
   
    return (
      <div 
        className="point" 
        style={{  transform: `translate(${posX - 4}px,${posY - 4}px)` }}
        onMouseDown={() => setCurrentDragging(vertex)}
        >
       
      </div>
    )
  }
}
