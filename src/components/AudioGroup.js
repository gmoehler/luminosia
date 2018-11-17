import React, { Component, Fragment } from 'react';

import AudioChannelContainer from './AudioChannelContainer'

// contains multiple AudioControlContainers
export default class AudioGroup extends Component {

  render() {

    return (
      <div>
        {this.props.channelData.byIds.map((source) => {
        	
        	const {data, /* length, */ bits} = {
      		...this.props.audioData
    		};

     	   const channelData = Array.isArray(data) ? data[0] : [];
    		const scale = window.devicePixelRatio;
        
        	<AudioChannelContainer 
				channelSource=source 
				audioData={ this.props.audioData }
                playState={this.props.playState}
	 		/>
		})
      </div>);
  }
}

