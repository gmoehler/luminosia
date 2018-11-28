import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Channel from './Channel';
import ImageChannel from './ImageChannel';
import { withAudioPlay } from './withAudioPlay'
import { withImagePlay } from './withImagePlay'

const ChannelGroupWrapper = styled.div`
	width: 500px;
	overflow: auto;
	white-space: nowrap;
`;


const windowPixelRatio = window.devicePixelRatio;

// add play functionality to audio channels
const AudioChannelWithPlay = withAudioPlay(Channel);
const ImageChannelWithPlay = withImagePlay(ImageChannel);

// contains multiple AudioChannels
export default class ChannelGroup extends Component {

  render() {

		// no data: nothing to do
		if (!Object.keys(this.props.allChannelsData).length) {
			return null;
		}

		// we have data: draw the channels
		const channelComponents = Object.keys(this.props.allChannelsData)
			.map((channelId) => {

			// get channel data
			const {allChannelsData, ...passthruProps} = this.props;
			const channelData = allChannelsData[channelId];
			const {data, length,  bits} = { ...channelData.peaks };
			const peaksDataMono = Array.isArray(data) ? data[0] : []; // only one channel for now
			const sampleRate = (channelData && channelData.buffer && channelData.buffer.sampleRate) ?
				channelData.buffer.sampleRate: 48000; // TODO: change this
			const buffer = channelData && channelData.buffer; 
			const playState = channelData.playState;
			const type = channelData.type;

			const channelElement = type === "audio" ?
			<AudioChannelWithPlay 
				key={ channelId } // list items need a key
				{...passthruProps}

				// for withAudioPlay
				type={type}
				playState={ playState }
				sampleRate={ sampleRate }
				buffer={buffer}
				setChannelPlayState={ playState => 
						this.props.setChannelPlayState(channelId, playState) }
				
				// for Channel
				peaks={ peaksDataMono } 
				length={ length } 
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
				setChannelPlayState={ playState => 
						this.props.setChannelPlayState(channelId, playState) }
				
				// for ImageChannel				
				length={ 500 } 
				bits={ bits } 
				scale={ windowPixelRatio }
				factor={5} 				// TODO needs more work
				source={ channelData.source }
			/>;

			return channelElement;

		});

    return (
			<ChannelGroupWrapper>
				{channelComponents}
      </ChannelGroupWrapper>
		)}
	}

  AudioChannelWithPlay.propTypes = {
    allChannelsData: PropTypes.array, 		// data of all channels
		setChannelPlayState: PropTypes.func.isRequired,
  }