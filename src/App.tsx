import React from 'react';
import { Component } from 'react';
import './App.scss';

import SVGDisplay from './components/svg_display';
import SettingsPanel from './components/settings_panel';

import Vertex from './util/vertex';

interface Props {
}

interface State {
  bloomFactor: number,
  vertexCount: number,
  displaySharp: boolean,
  displayEdit: boolean,
  vertices: Vertex []
}

export default class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    const vertices = this.getVertexCoords(3).map(vertex => {
      let temp = new Vertex(parseInt(vertex.split(',')[0]), parseInt(vertex.split(',')[1]), 3)
      temp.bloom(0.1)
      return temp
    })

    this.state = {
      bloomFactor: 0.1,
      vertexCount: 3,
      displaySharp: false,
      displayEdit: false,
      vertices: vertices
    };

    this.setBloomFactor = this.setBloomFactor.bind(this);
    this.setVertexCount = this.setVertexCount.bind(this);
    this.setSharp = this.setSharp.bind(this);
    this.setEdit = this.setEdit.bind(this);
    this.setNewVertices = this.setNewVertices.bind(this);

  }

  componentDidMount(): void { 
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

  generatePathStraight (vertices: Vertex []) {
    let output = `M${vertices[0].getCoordsString()} `
    for (let i = 1; i < vertices.length; i++) {
      output += 'L' + vertices[i].getCoordsString() + ' '
    }
    output += 'Z'
    return output
  }

  setBloomFactor (bloomFactor: number) {
    this.setNewVertices(bloomFactor, null)
    this.setState({
      bloomFactor: bloomFactor
    })
  }

  setVertexCount (vertexCount: number) {
    this.setNewVertices(null, vertexCount)
    this.setState({
      vertexCount: vertexCount
    })
  }

  setSharp () {
    const { displaySharp } = this.state;
    this.setState({
      displaySharp: !displaySharp
    })
  }

  setEdit () {
    const { displayEdit } = this.state;
    this.setState({
      displayEdit: !displayEdit
    })
  }

  setNewVertices (aBloomFactor: number | null, aVertexCount: number | null) {
    const { bloomFactor, vertexCount } = this.state;

    const vertices = this.getVertexCoords(aVertexCount ? aVertexCount : vertexCount).map(vertex => {
      let temp = new Vertex(parseInt(vertex.split(',')[0]), parseInt(vertex.split(',')[1]), aVertexCount ? aVertexCount : vertexCount)
      temp.bloom(aBloomFactor ? aBloomFactor : bloomFactor)
      return temp
    })

    this.setState({
      vertices: vertices
    })
  }

  getVertexCoords (vertexCount: number): string [] {
    let output: string [] = [];
    if (vertexCount === 3) {
      return ['20,20','85,20','50,85']
    } else if (vertexCount === 4) {
      return ['15,15','85,15','85,85','15,85']
    } else if (vertexCount === 5) {
      return ['15,47','50,15','85,47','70,85', '30,85']
    } else if (vertexCount === 6) {
      return ['15,30','50,10','85,30','85,70', '50,90', '15,70']
    } else if (vertexCount === 7) {
      return ['17,30','50,10','83,30','90,62', '70,90', '30,90', '10,62']
    } else if (vertexCount === 8) {
      return ['10,30','32,10','68,10','90,30', '90,65', '68,90', '32,90', '10,65']
    }
    return output;
  }

  render () {
    const { vertices, displaySharp, displayEdit } = this.state;

    return (
      <div className="App">
        <div className='main'>
          <SVGDisplay vertices={vertices} isSharp={displaySharp} isEdit={displayEdit}/> 
          {/* <div className='info'>dwd</div> */}
          <SettingsPanel setBloomFactor={this.setBloomFactor} setVertexCount={this.setVertexCount} setSharp={this.setSharp} setEdit={this.setEdit} renderNewShape={this.setNewVertices}/>
        </div>
      </div> 
    )
  } 
}
