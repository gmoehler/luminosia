import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Channel from './Channel';
import ImageChannel from './ImageChannel';
import { withAudioPlay } from './withAudioPlay'
import { withImagePlay } from './withImagePlay'

const windowPixelRatio = window.devicePixelRatio;

// add play functionality to audio channels
const AudioChannelWithPlay = withAudioPlay(Channel);
const ImageChannelWithPlay = withImagePlay(ImageChannel);

// contains multiple AudioChannels
export default class AudioGroup extends Component {

  render() {

		// no data: nothing to do
		if (!Object.keys(this.props.allAudioData).length) {
			return null;
		}

		// we have data: draw the channels
		const channelComponents = Object.keys(this.props.allAudioData)
			.map((channelId) => {

			// get channel data
			const {allAudioData, ...passthruProps} = this.props;
			const channelAudioData = allAudioData[channelId];
			const {data, /* length, */ bits} = { ...channelAudioData.peaks };
			const peaksDataMono = Array.isArray(data) ? data[0] : []; // only one channel for now
			const sampleRate = (channelAudioData && channelAudioData.buffer && channelAudioData.buffer.sampleRate) ?
				channelAudioData.buffer.sampleRate: 48000; // TODO: change this
			const buffer = channelAudioData && channelAudioData.buffer; 
			const playState = channelAudioData.playState;
			const type = channelAudioData.type;

			const channelElement = type === "audio" ?
			<AudioChannelWithPlay 
				key={ channelId } // list items need a key
				{...passthruProps}

				// for withAudioPlay
				type={type}
				playState={ playState }
				sampleRate={ sampleRate }
				buffer={buffer}
				setChannelAudioState={ playState => 
						this.props.setChannelPlayState(channelId, playState) }
				
				// for Channel
				peaks={ peaksDataMono } 
				length={ 500 } 
				bits={ bits } 
				scale={ windowPixelRatio }
			/> :

			<ImageChannelWithPlay
				key={ channelId } // list items need a key
				{...passthruProps}

				// for withImagePlay
				type={type}
				playState={ playState }
				sampleRate={ sampleRate }
				buffer={buffer}
				setChannelAudioState={ playState => 
						this.props.setChannelPlayState(channelId, playState) }
				
				// for ImageChannel				
				length={ 500 } 
				bits={ bits } 
				scale={ windowPixelRatio }
				factor={5} 				// TODO needs more work
				source={ channelAudioData.source }
			/>;

			return channelElement;

		});

    return (
			<div>
				{channelComponents}
      </div>
		)}
	}

  AudioChannelWithPlay.propTypes = {
    allAudioData: PropTypes.array, 		// data of all channels
		setChannelPlayState: PropTypes.func.isRequired,
  }