import React from 'react';
import { Component } from 'react';
import './style.scss';
import Point from '../point';
import Vertex from '../../util/vertex';

interface Props {
  vertices: Vertex [],
  isSharp: boolean,
  isEdit: boolean
}

interface State {
  vertices: Vertex [], 
  currentDragging: Vertex | null
}

export default class SVGDisplay extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      vertices: props.vertices,
      currentDragging: null
    };
    this.updateVertexCoords = this.updateVertexCoords.bind(this);
    this.setCurrentDragging = this.setCurrentDragging.bind(this);
  }


  dragVertex (event: React.MouseEvent<HTMLDivElement, MouseEvent> ) {
    const { currentDragging } = this.state;
    const obj = document.getElementsByClassName('svg_display');
    const xOffset = obj[0].getBoundingClientRect().x;
    const yOffset = obj[0].getBoundingClientRect().y;
    const x = (event.clientX - xOffset)/5;
    const y = (event.clientY - yOffset)/5;
    this.updateVertexCoords(currentDragging!, `${x},${y}`)
  }

  generatePath (vertices: Vertex []) {
    let output = `M${vertices[0].getCoordsString()}`
    const vertexCount = vertices.length;
    for (let i = 1; i < vertexCount; i++) {
      output += `C${vertices[i-1].cwBezierPoint},${vertices[i].ccwBezierPoint},${vertices[i].getCoordsString()}`
    }
    output += `C${vertices[vertexCount - 1].cwBezierPoint},${vertices[0].ccwBezierPoint},${vertices[0].getCoordsString()}`
    return output
  }

  generateStraightPath (vertices: Vertex []) {
    let output = `M${vertices[0].getCoordsString()}`
    const vertexCount = vertices.length;
    for (let i = 1; i < vertexCount; i++) {
      output += `L${vertices[i].getCoordsString()}`
    }
    output += `Z`
    return output
  }

  static getDerivedStateFromProps (props: Props, state: State) {
    if (props.vertices !== state.vertices) {
      return {
        vertices: props.vertices
      }
    }
    return null;
  }

  updateVertexCoords (aVertex: Vertex, coords: string): void {
    const { vertices } = this.state;
    this.setState({
      vertices: vertices.map(vertex => {
        if (vertex === aVertex) {
          vertex.setCoords(coords);
          return vertex
        }
        return vertex
      })
    })
  }

  setCurrentDragging (vertex: Vertex | null) {
    this.setState({
      currentDragging: vertex
    })
  }

  render() {
    const { vertices } = this.state;
    const { isSharp, isEdit} = this.props;
    return (
      <div className="svg_display"
        onMouseMove={e => this.dragVertex(e)}
        onMouseUp={e => this.setCurrentDragging(null)}
        onMouseLeave={e => this.setCurrentDragging(null)}
      >
        <div className="svg_canvas">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" width={500} height={500}>
            <path
              fill="rgba(248, 117, 55, 1)"
              d={isSharp ? this.generateStraightPath(vertices) : this.generatePath(vertices)}
              width="100%"
              height="100%"
              strokeWidth="0" 
            > 
            </path>
          </svg>
        </div>
        
        <div className="svg_overlay">
          {
            isEdit ? 
              vertices.map(element => {
                return <Point 
                  vertex={element}
                  setCurrentDragging={this.setCurrentDragging}
                /> 
              })
            : null
          }
        </div>
      </div>
    )
  }
}
