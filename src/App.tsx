import React from 'react';
import { Component } from 'react';
import './App.scss';

import SVGDisplay from './components/svg_display';
import SettingsPanel from './components/settings_panel';

interface Props {

}

interface State {

}


export default class App extends Component<Props, State> {

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

  getBezierString (prevCoord: string, currentCoord: string) {
    const prevCoordX = parseInt(prevCoord.split(',')[0]);
    const prevCoordY = parseInt(prevCoord.split(',')[1]);
    const currentCoordX = parseInt(currentCoord.split(',')[0]);
    const currentCoordY = parseInt(currentCoord.split(',')[1]);

    let prevBezier: string = '';
    let currentBezier: string = '';

    let bezierFactor: number = 10

    // prev bezier, current bezier, current coord

    // get prev bezier
    if (prevCoordX < 50 && prevCoordY < 50) {
      // top left
      prevBezier = `${prevCoordX + bezierFactor},${prevCoordY - bezierFactor}`
    } else if (prevCoordX >= 50 && prevCoordY < 50) {
      // top right
      prevBezier = `${prevCoordX + bezierFactor},${prevCoordY + bezierFactor}`
    } else if (prevCoordX >= 50 && prevCoordY >= 50) {
      // bottom right
      prevBezier = `${prevCoordX - bezierFactor},${prevCoordY + bezierFactor}`
    } else if (prevCoordX < 50 && prevCoordY >= 50) {
      // bottom left   
      prevBezier = `${prevCoordX - bezierFactor},${prevCoordY - bezierFactor}`
    }

    if (currentCoordX < 50 && currentCoordY < 50) {
      // top left
      currentBezier = `${currentCoordX - bezierFactor},${currentCoordY + bezierFactor}`
    } else if (currentCoordX >= 50 && currentCoordY < 50) {
      // top right
      currentBezier = `${currentCoordX - bezierFactor},${currentCoordY - bezierFactor}`
    } else if (currentCoordX >= 50 && currentCoordY >= 50) {
      // bottom right
      currentBezier = `${currentCoordX + bezierFactor},${currentCoordY - bezierFactor}`
    } else if (currentCoordX < 50 && currentCoordY >= 50) {
      // bottom left   
      currentBezier = `${currentCoordX + bezierFactor},${currentCoordY + bezierFactor}`
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
    console.log(output)
    return output
  }

  render () {
    // const p1: string = '25,25';
    // const p2: string = '75,25';
    // const p3: string = '50,75';

    const p1: string = '30,30';
    const p2: string = '70,30';
    const p3: string = '70,70';
    const p4: string = '30,70';

    let bloomFactor = 18
    
    return (
      <div className="App">
        <div className='main'>
          <SVGDisplay dPath={this.generatePath([this.bloom(p1, bloomFactor),this.bloom(p2, bloomFactor),this.bloom(p3, bloomFactor),this.bloom(p4, bloomFactor)])}/>
          <SettingsPanel />
        </div>
        
      </div>
      
    )

  }
   
}
