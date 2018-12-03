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

		// we have data: draw all channels
		const channelComponents = Object.keys(this.props.allChannelsData)
			.map((channelId) => {

			// get channel data
			const {allChannelsData, pixelsPerSecond, ...passthruProps} = this.props;

			const channelData = allChannelsData[channelId];
			if (channelData.loading) {
				return null;
			}

			// if sampleRate is in config: use it, else: use sampleRate from buffer (audio only)
			const sampleRate = channelData.buffer && channelData.buffer.sampleRate 
				? channelData.buffer.sampleRate : channelData.sampleRate;

			const channelProps = {
				...passthruProps,
				key: channelId, // required because of list
				type: channelData.type,
				playState: channelData.playState,
				offset: channelData.offset,
				sampleRate,
				resolution:  sampleRate / pixelsPerSecond,
				buffer: channelData && channelData.buffer,
				scale: windowPixelRatio,
			}

			if (channelData.type === "audio") {
				return (
					<AudioChannelWithPlay 
						{...channelProps}
						setChannelPlayState={ playState => 
								this.props.setChannelPlayState(channelId, playState) }
					/>);
				}

			return (
				<ImageChannelWithPlay
					{...channelProps}
					source={ channelData.src }
					setChannelPlayState={ playState => 
							this.props.setChannelPlayState(channelId, playState) }
				/>);
		});

    return (
			<ChannelGroupWrapper>
				{channelComponents}
      </ChannelGroupWrapper>
		)}
	}

  AudioChannelWithPlay.propTypes = {
		allChannelsData: PropTypes.array, 		// data of all channels
		pixelsPerSecond: PropTypes.number,
		setChannelPlayState: PropTypes.func.isRequired,
  }