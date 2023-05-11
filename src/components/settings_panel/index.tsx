import React from 'react';
import { Component } from 'react';
import './style.scss';

import Box from '@mui/material/Box';

import {Slider, defaultTheme, Provider, View} from '@adobe/react-spectrum'





interface Props {
  setBloomFactor: (args1: number) => void,
  setVertexCount: (args1: number) => void
}

interface State {

}

export default class SettingsPanel extends Component<Props, State> {

  
  render() {

    const { setBloomFactor, setVertexCount } = this.props;

    return (
      <div className="settings_panel">
        <div>
          <Provider theme={defaultTheme} colorScheme="light"> 
            <Slider
              minValue={0.1}
              maxValue={0.7}
              defaultValue={0.1}
              showValueLabel={false}
              step={0.1}
              onChange={e => {setBloomFactor(e)}}
              isFilled
              trackGradient={['grey', 'grey']}
              aria-label='bloom_factor'
            />

            <Slider
              minValue={3}
              maxValue={8}
              defaultValue={3}
              showValueLabel={false}
              step={1}
              onChange={e => {setVertexCount(e)}}
              isFilled
              trackGradient={['black', 'black']}
              aria-label='vertex_count'
            />
          </Provider>
        </div>
      </div>
    )
  }
}
