import { Component } from 'react';
import './style.scss';

import { Slider, Stack, FormControlLabel, Checkbox,Typography, styled, CheckboxProps, Button } from '@mui/material';

interface Props {
  setBloomFactor: (args1: number) => void,
  setVertexCount: (args1: number) => void,
  setSharp: () => void,
  setEdit: () => void
}

interface State {
  sharpChecked: boolean,
  editChcked: boolean
}

export default class SettingsPanel extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      sharpChecked: false,
      editChcked: false
    };
  }

  render() {
    const { setBloomFactor, setVertexCount, setSharp, setEdit } = this.props;
    const { sharpChecked,editChcked } = this.state;

    // using MUI's Example
    const BpIcon = styled('span')(() => ({
      borderRadius: 3,
      width: 16,
      height: 16,
      backgroundColor: '#8e4700',
      'input:hover ~ &': {
        backgroundColor: '#c60',
      },
    }));
    const BpCheckedIcon = styled(BpIcon)({
      backgroundColor: '#8e4700',
      '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
          " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
          "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
      },
      'input:hover ~ &': {
        backgroundColor: '#c60',
      },
    });
    function BpCheckbox(props: CheckboxProps) {
      return (
        <Checkbox
          sx={{
            '&:hover': { bgcolor: 'transparent' },
          }}
          disableRipple
          color="default"
          checkedIcon={<BpCheckedIcon />}
          icon={<BpIcon />}
          inputProps={{ 'aria-label': 'Checkbox demo' }}
          {...props}
        />
      );
    }

    return (
      <div className="settings_panel">
        <div>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <div>O</div>
            <Slider
              size="small"
              defaultValue={3}
              step={1}
              marks
              min={3}
              max={8}
              sx={{
                color: '#8e4700',
                '& .MuiSlider-track': {
                  border: 'none',
                  backgroundColor: '#8e4700'
                },
                '& .MuiSlider-thumb': {
                  backgroundColor: '#8e4700',
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                  },
                },
              }}
              onChange={(e, val) => setVertexCount(val as number)}
            />
            <div>O</div>
          </Stack>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" width={50}>
              <path
                fill="#8e4700"
                d={'M17.33,30.2 C23.74,18.88,37,11,50,11.2 C63,11,72.14,20.96,79.7,32 C85.86,43.04,89.8,48.57,86.8,61.04 C82.2,73.43,80.63,82.19,69.2,88.4 C57.37,93.81,42.63,93.81,31,88 C19.37,82.19,15.62,73.49,12,61.4 C8.38,48.51,10.26,41.12,17.33,30.2'}
                width="100%"
                height="100%"
                strokeWidth="0"
              >
              </path>
            </svg>
            <Slider
              size="small"
              defaultValue={0.1}
              step={0.1}
              marks
              min={0.1}
              max={0.7}
              sx={{
                color: '#8e4700',
                '& .MuiSlider-track': {
                  border: 'none',
                  backgroundColor: '#8e4700'
                },
                '& .MuiSlider-thumb': {
                  backgroundColor: '#8e4700',
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                  },
                },
              }}
              onChange={(e, val) => setBloomFactor(val as number)}
            />
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" width={50}>
              <path
                fill="#8e4700"
                d={'M28.400000000000002,39.2 C33.37,28.27,22.06,16.92,33.08,12.4 C43.94,7.08,44.78,29.74,56.84,34.8 C67.22,38.26,70.63,26.27,76,37 C81.37,47.73,83.25,49.78,79.6,61.1 C74.75,72.22,67.98,61.17,57.56,66.8 C46.02,70.83,45.86,87.1,35.6,82 C24.14,76.9,31.64,68.43,28.799999999999997,57.95 C24.36,45.57,22.63,49.73,28.400000000000002,39.2'}
                width="100%"
                height="100%"
                strokeWidth="0"
              >
              </path>
          </svg>
          </Stack>
          <FormControlLabel 
            control={ <BpCheckbox onClick={() => setSharp()} checked={editChcked}/>} 
            label= {
              <Typography 
                sx={{ fontWeight: 'bold', fontSize: 13, paddingTop: 0.2}}
                color="#8e4700"
                >
                SHARP
              </Typography>
            } 
            onClick={() => this.setState({editChcked:!editChcked })}
          />
          <FormControlLabel 
            control={ <BpCheckbox onClick={() => setEdit()} checked={sharpChecked}/>} 
            label= {
              <Typography 
                sx={{ fontWeight: 'bold', fontSize: 13, paddingTop: 0.2}}
                color="#8e4700"
                >
                EDIT
              </Typography>
            } 
            onClick={() => this.setState({sharpChecked:!sharpChecked })}
          />
          <button className='general-button'>SVG</button>
        </div>
      </div>
    )
  }
}
