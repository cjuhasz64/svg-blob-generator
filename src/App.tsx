import React from 'react';
import { Component } from 'react';
import './App.scss';

import SVGDisplay from './components/svg_display';
import SettingsPanel from './components/settings_panel';

interface Props {

}

interface State {
  bloomFactor: number,
  vertexCount: number
}

export default class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      bloomFactor: 0.1,
      vertexCount: 3
    };
    this.setBloomFactor = this.setBloomFactor.bind(this)
    this.setVertexCount = this.setVertexCount.bind(this)
  }

  bloom (coord: string, maxBloom: number): string {
    // get a randow point betwenn the coord and the middle
    // max bloom is a percentage, meaning the maximum from the 
    // coord. i.e, 0.1 would be within 10% of distance between
    // coord and center
    const centerX = 50;
    const centerY = 50;
    const x = parseInt(coord.split(',')[0]);
    const y = parseInt(coord.split(',')[1]);

    const xDiff = centerX - x;
    const yDiff = centerY - y;

    const randomBloomPercetage = Math.round(Math.random() * (maxBloom) * 100) / 100

    return `${x + (randomBloomPercetage * xDiff)},${y + (randomBloomPercetage * yDiff)}`
  }

  getBezierPoint(currentCoord: string, clockwise: boolean, vertexCount: number): string {
    const centerX: number = 50;
    const centerY: number = 50;
    const currentCoordX = parseInt(currentCoord.split(',')[0]);
    const currentCoordY = parseInt(currentCoord.split(',')[1]);

    const slop: number = (centerY-currentCoordY)/(centerX-currentCoordX);

    const perpendicularSlop: number = Math.round(-(1/slop) * 100) / 100;
    const c = 20 - vertexCount;   // length of bezier line (half) // segements increase, this number should reduce
    const a = c/Math.sqrt(1+Math.pow(perpendicularSlop,2));

    if (currentCoordY < 50 && clockwise || currentCoordY >= 50 && !clockwise) {
      return `${Math.round((currentCoordX + a) * 100) / 100},${Math.round((currentCoordY + (a*perpendicularSlop)) * 100) / 100}` 
    } 
    return `${Math.round((currentCoordX - a) * 100) / 100},${Math.round((currentCoordY - (a*perpendicularSlop)) * 100) / 100}` 
  }

  getBezierString (prevCoord: string, currentCoord: string, vertexCount: number) {


    return `C${this.getBezierPoint(prevCoord,true,vertexCount)},${this.getBezierPoint(currentCoord,false,vertexCount)},${currentCoord}`

    // prevBezier = `${prevCoordX + (0.3 * (currentCoordX - prevCoordX))},${prevCoordY + (0.3 * (currentCoordY - prevCoordY))}`
    // currentBezier = `${prevCoordX + (0.7 * (currentCoordX - prevCoordX))},${prevCoordY + (0.7 * (currentCoordY - prevCoordY))}`

    // const majorFactor = 20 - (vertexCount)
    // const majorFactor = (4/3)*Math.tan(3.14/(2 * vertexCount))

    // const majorFactor = 15

    // // get prev bezier
    // if (prevCoordX < 50 && prevCoordY < 50) {
    //   // top left
    //   prevBezier = `${prevCoordX + majorFactor},${prevCoordY - majorFactor}`
    // } else if (prevCoordX > 50 && prevCoordY < 50) {
    //   // top right
    //   prevBezier = `${prevCoordX + majorFactor},${prevCoordY + majorFactor}`
    // } else if (prevCoordX > 50 && prevCoordY > 50) {
    //   // bottom right
    //   prevBezier = `${prevCoordX - majorFactor},${prevCoordY + majorFactor}`
    // } else if (prevCoordX < 50 && prevCoordY > 50) {
    //   // bottom left   
    //   prevBezier = `${prevCoordX - majorFactor},${prevCoordY - majorFactor}`
    // } else if (prevCoordX === 50) {
    //   if (prevCoordY > 50) {
    //     // bottom to left
    //     prevBezier = `${prevCoordX - majorFactor},${prevCoordY}`
    //   } else {
    //     // top to right
    //     prevBezier = `${prevCoordX + majorFactor},${prevCoordY}`
    //   }
    // } else if (prevCoordY === 50) {

    // }
  
    // if (currentCoordX < 50 && currentCoordY < 50) {
    //   // top left
    //   currentBezier = `${currentCoordX - majorFactor},${currentCoordY + majorFactor}`
    // } else if (currentCoordX > 50 && currentCoordY < 50) {
    //   // top right
    //   currentBezier = `${currentCoordX - majorFactor},${currentCoordY - majorFactor}`
    // } else if (currentCoordX > 50 && currentCoordY > 50) {
    //   // bottom right
    //   currentBezier = `${currentCoordX + majorFactor},${currentCoordY - majorFactor}`
    // } else if (currentCoordX < 50 && currentCoordY > 50) {
    //   // bottom left   
    //   currentBezier = `${currentCoordX + majorFactor},${currentCoordY + majorFactor}`
    // } else if (currentCoordX === 50) {
    //   if (currentCoordY > 50) {
    //     // bottom to right
    //     currentBezier = `${currentCoordX + majorFactor},${currentCoordY}`
    //   } else {
    //     // bottom to left
    //     currentBezier = `${currentCoordX - majorFactor},${currentCoordY}`
    //   }
    // } else if (currentCoordY === 50) {

    // }
  }

  generatePath (bloomedVertices: string []) {
    let output = `M${bloomedVertices[0]} `
    const vertexCount = bloomedVertices.length;
 
    for (let i = 1; i < bloomedVertices.length; i++) {
      output += this.getBezierString(bloomedVertices[i-1], bloomedVertices[i], vertexCount) + ' '
    }

    output += this.getBezierString(bloomedVertices[bloomedVertices.length - 1], bloomedVertices[0], vertexCount)
    return output
  }

  generatePathStraight (vertices: string []) {
    let output = `M${vertices[0]} `
 
    for (let i = 1; i < vertices.length; i++) {
      output += 'L' + vertices[i] + ' '
    }
    
    output += 'Z'
    return output
  }

  setBloomFactor (factor: number) {
    this.setState({
      bloomFactor: factor
    })
  }

  setVertexCount (vertexCount: number) {
    this.setState({
      vertexCount: vertexCount
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
    const { bloomFactor, vertexCount } = this.state;

    const bloomedVertices = this.getVertexCoords(vertexCount).map(vertex => {
      return this.bloom(vertex, bloomFactor)
    })

    return (
      <div className="App">
        <div className='main'>
          {/* <SVGDisplay dPath={this.generatePathStraight(bloomedVertices)} point={this.getCircle(bloomedVertices[0],bloomedVertices[1])}/> */}
          <SVGDisplay dPath={this.generatePath(bloomedVertices)}/>
          <SettingsPanel setBloomFactor={this.setBloomFactor} setVertexCount={this.setVertexCount}/>
        </div>
      </div> 
    )
  } 
}
