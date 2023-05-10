import React from 'react';
import { Component } from 'react';
import './App.scss';

import SVGDisplay from './components/svg_display';
import SettingsPanel from './components/settings_panel';

interface Props {

}

interface State {
  bloomFactor: number
}


export default class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      bloomFactor: 3
    };
    this.setBloomFactor = this.setBloomFactor.bind(this)
  }

  bloom (coord: string, radius: number): string {
    let x = parseInt(coord.split(',')[0])
    let y = parseInt(coord.split(',')[1])

    let bloomAmount = Math.round(( Math.random() * radius ) * 100) / 100

    if (Math.round(Math.random()) === 1) {
      x += bloomAmount
    } else {
      x -= bloomAmount
    }

    bloomAmount = Math.round(( Math.random() * radius ) * 100) / 100
    if (Math.round(Math.random()) === 0) {
      y += bloomAmount
    } else {
      y -= bloomAmount
    }
    return `${x},${y}`
  }

  // getBezierString (prevCoord: string, currentCoord: string) {
  //   const prevCoordX = parseInt(prevCoord.split(',')[0]);
  //   const prevCoordY = parseInt(prevCoord.split(',')[1]);
  //   const currentCoordX = parseInt(currentCoord.split(',')[0]);
  //   const currentCoordY = parseInt(currentCoord.split(',')[1]);

  //   let prevBezier: string = '';
  //   let currentBezier: string = '';

  //   let bezierFactor: number = 10

  //   // prev bezier, current bezier, current coord

  //   // get prev bezier
  //   if (prevCoordX < 50 && prevCoordY < 50) {
  //     // top left
  //     prevBezier = `${prevCoordX + bezierFactor},${prevCoordY - bezierFactor}`
  //   } else if (prevCoordX >= 50 && prevCoordY < 50) {
  //     // top right
  //     prevBezier = `${prevCoordX + bezierFactor},${prevCoordY + bezierFactor}`
  //   } else if (prevCoordX >= 50 && prevCoordY >= 50) {
  //     // bottom right
  //     prevBezier = `${prevCoordX - bezierFactor},${prevCoordY + bezierFactor}`
  //   } else if (prevCoordX < 50 && prevCoordY >= 50) {
  //     // bottom left   
  //     prevBezier = `${prevCoordX - bezierFactor},${prevCoordY - bezierFactor}`
  //   }

  //   if (currentCoordX < 50 && currentCoordY < 50) {
  //     // top left
  //     currentBezier = `${currentCoordX - bezierFactor},${currentCoordY + bezierFactor}`
  //   } else if (currentCoordX >= 50 && currentCoordY < 50) {
  //     // top right
  //     currentBezier = `${currentCoordX - bezierFactor},${currentCoordY - bezierFactor}`
  //   } else if (currentCoordX >= 50 && currentCoordY >= 50) {
  //     // bottom right
  //     currentBezier = `${currentCoordX + bezierFactor},${currentCoordY - bezierFactor}`
  //   } else if (currentCoordX < 50 && currentCoordY >= 50) {
  //     // bottom left   
  //     currentBezier = `${currentCoordX + bezierFactor},${currentCoordY + bezierFactor}`
  //   }
    
  //   return `C${prevBezier},${currentBezier},${currentCoord}`

  // }

  getBezierString (prevCoord: string, currentCoord: string) {
    const prevCoordX = parseInt(prevCoord.split(',')[0]);
    const prevCoordY = parseInt(prevCoord.split(',')[1]);
    const currentCoordX = parseInt(currentCoord.split(',')[0]);
    const currentCoordY = parseInt(currentCoord.split(',')[1]);

    let prevBezier: string = '';
    let currentBezier: string = '';

    let majorFactor: number = 10
    let minorFactor: number = 5

    // prev bezier, current bezier, current coord

    // get prev bezier
    if (prevCoordX < 50 && prevCoordY < 50) {
      // top left
      prevBezier = `${prevCoordX + majorFactor},${prevCoordY - majorFactor}`
    } else if (prevCoordX >= 50 && prevCoordY < 50) {
      // top right
      prevBezier = `${prevCoordX + majorFactor},${prevCoordY + majorFactor}`
    } else if (prevCoordX >= 50 && prevCoordY >= 50) {
      // bottom right
      prevBezier = `${prevCoordX - majorFactor},${prevCoordY + majorFactor}`
    } else if (prevCoordX < 50 && prevCoordY >= 50) {
      // bottom left   
      prevBezier = `${prevCoordX - majorFactor},${prevCoordY - majorFactor}`
    }

    if (currentCoordX < 50 && currentCoordY < 50) {
      // top left
      currentBezier = `${currentCoordX - majorFactor},${currentCoordY + majorFactor}`
    } else if (currentCoordX >= 50 && currentCoordY < 50) {
      // top right
      currentBezier = `${currentCoordX - majorFactor},${currentCoordY - majorFactor}`
    } else if (currentCoordX >= 50 && currentCoordY >= 50) {
      // bottom right
      currentBezier = `${currentCoordX + majorFactor},${currentCoordY - majorFactor}`
    } else if (currentCoordX < 50 && currentCoordY >= 50) {
      // bottom left   
      currentBezier = `${currentCoordX + majorFactor},${currentCoordY + majorFactor}`
    }
    
    return `C${prevBezier},${currentBezier},${currentCoord}`

  }

  generatePath (vertices: string []) {
    let output = `M${vertices[0]} `
 
    for (let i = 1; i < vertices.length; i++) {
      output += this.getBezierString(vertices[i-1], vertices[i]) + ' '
    }
    
    // last curve
    output += this.getBezierString(vertices[vertices.length - 1], vertices[0])

    return output
  }


  generatePathStraight (vertices: string []) {
    let output = `M${vertices[0]} `
 
    for (let i = 1; i < vertices.length; i++) {
      console.log(vertices[i])
      output += 'L' + vertices[i] + ' '
    }
    
    // last curve
    output += 'Z'
    console.log(output)
    return output
  }

  setBloomFactor (factor: number) {
    this.setState({
      bloomFactor: factor
    })
  }

  getVertexCoords (vertexCount: number): string [] {
    let output: string [] = [];
    if (vertexCount === 3) {
      return ['30,30','70,30','50,70']
    } else if (vertexCount === 4) {
      return ['30,30','70,30','70,70','30,70']
    } else if (vertexCount === 5) {
      return ['30,47','50,30','70,47','63,70', '37,70']
    }
    return output;
  }

  render () {
    const { bloomFactor } = this.state;

    const bloomedVertices = this.getVertexCoords(3).map(vertex => {
      return this.bloom(vertex, bloomFactor)
    })

    return (
      <div className="App">
        <div className='main'>
          <SVGDisplay dPath={this.generatePath(bloomedVertices)}/>
          <SettingsPanel setBloomFactor={this.setBloomFactor}/>
        </div>
        
      </div>
      
    )

  }
   
}
