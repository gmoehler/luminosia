import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Channel from './Channel';
import { withAudioPlay } from './withAudioPlay'

const windowPixelRatio = window.devicePixelRatio;

// add play functionality to audio channels
const AudioChannelWithPlay = withAudioPlay(Channel);

// contains multiple AudioChannels
export default class AudioGroup extends Component {

  render() {

		// no data: nothing to do
		if (!Object.keys(this.props.allAudioData).length) {
			return null;
		}

		// we have data: draw the channels
		const channelComponents = Object.keys(this.props.allAudioData).map((id) => {

			// get channel data
			const {allAudioData, ...passthruProps} = this.props;
			const channelAudioData = allAudioData[id];
			const {data, /* length, */ bits} = { ...channelAudioData.peaks };
			const peaksDataMono = Array.isArray(data) ? data[0] : []; // only one channel for now

			return <AudioChannelWithPlay 
				key={ id } // list items need a key
				{...passthruProps}

				// for withAudioPlay
				audioData={ channelAudioData }

				// for Channel
				peaks={ peaksDataMono } 
				length={ 500 } 
				bits={ bits } 
				scale={ windowPixelRatio }
			/>
		});

    return (
			<div>
				{channelComponents}
      </div>
		)}
	}

  AudioChannelWithPlay.propTypes = {
    allAudioData: PropTypes.array, 		// data of all channels
    playState: PropTypes.oneOf(['stopped', 'playing'])
  }