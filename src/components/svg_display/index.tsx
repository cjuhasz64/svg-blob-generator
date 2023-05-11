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
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" width={500}>
          <path
            fill="rgba(248, 117, 55, 1)"
            d={dPath}
            width="100%"
            height="100%"
            strokeWidth="0"
          >
          </path>
        </svg>
      </div>
    )
  }
}
