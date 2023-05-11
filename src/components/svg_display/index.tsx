import React from 'react';
import { Component } from 'react';
import './style.scss';

interface Props {
  dPath: string
}

interface State {

}

export default class SVGDisplay extends Component<Props, State> {

  render() {
    const { dPath } = this.props;

    return (
      <div className="svg_display">
        <svg id="sw-js-blob-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" width={500}>
          <path
            fill="rgba(248, 117, 55, 1)"
            d={dPath}
            width="100%"
            height="100%"
            strokeWidth="0"
          >
         
          </path>
          
          {/* <circle cx={'15'} cy={'78.65'} r="0.5" />
          <circle cx={'55'} cy={'10'} r="0.5" />
          <circle cx={'92.07'} cy={'77.92'} r="0.5" />
       */}

          <circle cx={'58.88'} cy={'94.10'} r="0.5" />
      
     
    
        </svg>

     

        
      </div>
    )
  }
}
