import React, { Component } from 'react';

import Channel from './Channel';
import { withAudioPlay } from './withAudioPlay'

const AudioChannelWithPlay = withAudioPlay(Channel);

// contains multiple AudioChannels
export default class AudioGroup extends Component {

  render() {

		const scale = window.devicePixelRatio;

		if (!Object.keys(this.props.audioData).length) {
			return null;
		}

		const channelComponents = Object.keys(this.props.audioData).map((source) => {
			const channelAudioData = this.props.audioData[source];
			const {data, /* length, */ bits} = { ...channelAudioData.peaks };
			const channelData = Array.isArray(data) ? data[0] : [];

			return <AudioChannelWithPlay 
				key={ source }
				channelSource={ source }
				// for withAudioPlay
				audioData={ channelAudioData }
				playState={ this.props.playState }
				// for Channel
				peaks={ channelData } 
				length={ 500 } 
				bits={ bits } 
				scale={ scale }
			/>
		});

    return (
			<div>
				{channelComponents}
      </div>
		)}
	}

