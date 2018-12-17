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

		// we have data: audio first, image second, then by source
		const keys = Object.keys(this.props.allChannelsData)
			.sort((k1, k2) => {
				const data1 = this.props.allChannelsData[k1];
				const data2 = this.props.allChannelsData[k2];
				const str1 = data1.type + data1.src;
				const str2 = data2.type + data2.src;
				if (str1 < str2) {
					return -1;
				} else if (str2 > str1) {
					return 1;
				}
				return 0;
			})
		const channelComponents = keys
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
				parts: channelData.byParts,
				scale: windowPixelRatio,
			}

			if (channelData.type === "audio") {
				return (
					<AudioChannelWithPlay 
						{...channelProps}
						setChannelPlayState={ playState => 
								this.props.setChannelPlayState(channelId, playState) }
						moveChannel={ (incr) => 
							this.props.moveChannel(channelId, incr) }
					/>);
				}

			return (
				<ImageChannelWithPlay
					{...channelProps}
					setChannelPlayState={ playState => 
							this.props.setChannelPlayState(channelId, playState) }
					move={  (partId, incr) => 
							this.props.move(channelId, partId, incr) }
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
		move: PropTypes.func.isRequired,
		moveChannel: PropTypes.func.isRequired
  }