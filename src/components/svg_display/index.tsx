import React from 'react';
import { Component } from 'react';
import './style.scss';
import Point from '../point';
import Vertex from '../../util/vertex';
import BezierLineOverlay from '../bezier_line_overlay';

interface Props {
  vertices: Vertex [],
  isSharp: boolean,
  isEdit: boolean
}

interface State {
  vertices: Vertex [], 
  currentDragging: [ Vertex | null, 'cw' | 'ccw' | null ],
  initialMousePos: string | null,
  initialCenter: string
}

export default class SVGDisplay extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      vertices: props.vertices,
      currentDragging: [null, null],
      initialMousePos: null,
      initialCenter: '50,50'
    };



    this.updateVertexCoords = this.updateVertexCoords.bind(this);
    this.setCurrentDragging = this.setCurrentDragging.bind(this);
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

  updateVertexCoords (aVertex: [Vertex | null, 'cw' | 'ccw' | null], coords: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>, autoSetBezier: boolean): void {
    const { vertices, initialMousePos } = this.state;
    const direction: 'cw' | 'ccw' | null = aVertex[1]

    const temp = vertices.map(vertex => {
      if (vertex === aVertex[0]) {
        if (direction === 'cw') {

          if (event.altKey) {
            // alt key: move bezier point alone
            vertex.setCWCoords(coords);
          } else {
            // default: opposite beizer mirros movement 
            vertex.setCWCoords(coords);
            if (autoSetBezier) {
              const xOffset: number = parseFloat(this.getMouseCoords(event).split(',')[0]) - parseFloat(initialMousePos!.split(',')[0]) 
              const yOffset: number = parseFloat(this.getMouseCoords(event).split(',')[1]) - parseFloat(initialMousePos!.split(',')[1])
              vertex.setCCWCoords(vertex.getCCWOffsetCoords(`${xOffset * -1},${yOffset * -1}`));
            }
          }
          
        } else if (direction === 'ccw') {

          if (event.altKey) {
            // alt key: move bezier point alone
            vertex.setCCWCoords(coords);
          } else {
            // default: opposite beizer mirros movement 
            vertex.setCCWCoords(coords);
            if (autoSetBezier) {
              const xOffset: number = parseFloat(this.getMouseCoords(event).split(',')[0]) - parseFloat(initialMousePos!.split(',')[0]) 
              const yOffset: number = parseFloat(this.getMouseCoords(event).split(',')[1]) - parseFloat(initialMousePos!.split(',')[1])
              vertex.setCWCoords(vertex.getCWOffsetCoords(`${xOffset * -1},${yOffset * -1}`));
            }
          }

        } else {
          if (event.altKey) {
            const xOffset: number = parseFloat(this.getMouseCoords(event).split(',')[0]) - parseFloat(initialMousePos!.split(',')[0]) 
            const yOffset: number = parseFloat(this.getMouseCoords(event).split(',')[1]) - parseFloat(initialMousePos!.split(',')[1])
            vertex.setCWCoords(vertex.getCWOffsetCoords(`${xOffset},${yOffset}`));
            vertex.setCCWCoords(vertex.getCCWOffsetCoords(`${xOffset},${yOffset}`));
          }
          vertex.setCoords(coords, event, autoSetBezier);  
        }
        return vertex
      }
      return vertex
    })
    this.setState({
      vertices: temp
    })

  }

  setCurrentDragging (vertex: Vertex | null, direction?: 'cw' | 'ccw') {
    this.setState({
      currentDragging: [vertex, direction ? direction : null]
    })
  }

  setInitialMousePos (event: React.MouseEvent<HTMLDivElement, MouseEvent> | null) {

    const {vertices} = this.state;

    vertices.forEach(vertex => {
      vertex.saveCurrentAsInitial()
    })

    if (!event) {
      this.setState({
        initialMousePos: null,
        initialCenter: vertices[0].centerCoords
      })
      return;
    }
    this.setState({
      initialMousePos: this.getMouseCoords(event)
    })
  }

  getMouseCoords (event: React.MouseEvent<HTMLDivElement, MouseEvent>): string {
    const obj = document.getElementsByClassName('svg_display');
    const xOffset = obj[0].getBoundingClientRect().x;
    const yOffset = obj[0].getBoundingClientRect().y;
    const x = (event!.clientX - xOffset)/5;
    const y = (event!.clientY - yOffset)/5;
    return `${x},${y}`
  }

  setShapeOffset (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { vertices, initialMousePos, initialCenter } = this.state;

    if (!initialMousePos) return 

    const xOffset: number = parseFloat(this.getMouseCoords(event).split(',')[0]) - parseFloat(initialMousePos!.split(',')[0]) 
    const yOffset: number = parseFloat(this.getMouseCoords(event).split(',')[1]) - parseFloat(initialMousePos!.split(',')[1])

    // move center point
   
    vertices.forEach(vertex => { 
      this.updateVertexCoords([vertex, null], vertex.getOffsetCoords(`${xOffset},${yOffset}`), event, false);
      this.updateVertexCoords([vertex, 'cw'], vertex.getCWOffsetCoords(`${xOffset},${yOffset}`), event, false);
      this.updateVertexCoords([vertex, 'ccw'], vertex.getCCWOffsetCoords(`${xOffset},${yOffset}`), event, false);
      vertex.setCenterCoords(`${parseFloat(initialCenter!.split(',')[0]) + xOffset},${parseFloat(initialCenter!.split(',')[1]) + yOffset}`)
    })

  }

  render() {
    const { vertices, currentDragging, initialMousePos } = this.state;
    const { isSharp, isEdit } = this.props;
    return (
      <div className="svg_display"
        // onMouseMove={e => initialMousePos ? this.setShapeOffset(e) : null} // if has currentDragging
        onMouseMove={e => currentDragging[0] ? this.updateVertexCoords(currentDragging!, this.getMouseCoords(e), e, true) : initialMousePos ? this.setShapeOffset(e) : null}
        onMouseUp={e => {this.setCurrentDragging(null); this.setInitialMousePos(null)}}
        onMouseLeave={e => {this.setCurrentDragging(null); this.setInitialMousePos(null)}}
        onMouseDown={e => this.setInitialMousePos(e)}
        style={{cursor: currentDragging[0] ? 'pointer' : ''}}
      >
        
        <BezierLineOverlay vertices={vertices} isEdit={isEdit}/>
        <div className="svg_canvas">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" width={500} height={500} onMouseEnter={() => console.log('dd')}>
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
                return <Point vertex={element} setCurrentDragging={this.setCurrentDragging} />   
              })
            : null
          } 
          {
            isEdit ? 
              vertices.map(element => {
                return <Point vertex={element} setCurrentDragging={this.setCurrentDragging} direction='cw'/>   
              })
            : null
          } 
          {
            isEdit ? 
              vertices.map(element => {
                return <Point vertex={element} setCurrentDragging={this.setCurrentDragging} direction='ccw'/>   
              })
            : null
          } 
        </div>
      </div>
    )
  }
}

