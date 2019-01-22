import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Channel from './Channel';
import ImageChannel from './ImageChannel';
import { withPlay } from './withPlay'
import ImageExporter from './ImageExporter';

const ChannelGroupWrapper = styled.div`
  width:  calc(95vw - ${props => props.drawerWidth}px);
  transition: width .1s;
	overflow: auto;
	white-space: nowrap;
`;

const windowPixelRatio = window.devicePixelRatio;

// add play functionality to audio channels
const AudioChannelWithPlay = withPlay(Channel);
const ImageChannelWithPlay = withPlay(ImageChannel);

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
        const {allChannelsData, resolution, ...passthruProps} = this.props;

        const channelData = allChannelsData[channelId];
        if (channelData.loading) {
          return null;
        }

        // if sampleRate is in config: use it, else: use sampleRate from buffer (audio only)
        const sampleRate = channelData.buffer && channelData.buffer.sampleRate
          ? channelData.buffer.sampleRate : channelData.sampleRate;

        const channelProps = {
          ...passthruProps,
          id: channelId,
          key: channelId, // required because of list
          type: channelData.type,
          playState: channelData.playState,
          offset: channelData.offset,
          sampleRate,
          resolution,
          buffer: channelData && channelData.buffer,
          parts: channelData.byParts ? Object.values(channelData.byParts) : [],
          scale: windowPixelRatio,
        }

        if (channelData.type === "audio") {
          return (
						<AudioChannelWithPlay 
							{...channelProps} 
							setChannelPlayState={ playState => this.props.setChannelPlayState(channelId, playState) } 
						/>);
        }

        return (
          <ImageChannelWithPlay 
            {...channelProps} 
            setChannelPlayState={ playState => this.props.setChannelPlayState(channelId, playState) } 
            move={ (partId, incr) => this.props.move(channelId, partId, incr) } 
          />);


      });

    return (
      <ChannelGroupWrapper
        drawerWidth={this.props.drawerWidth || 0}>
        <ImageExporter />
        { channelComponents }
      </ChannelGroupWrapper>
    )
  }
}

ChannelGroup.propTypes = {
  allChannelsData: PropTypes.object, // data of all channels
  resolution: PropTypes.number,
  setChannelPlayState: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired,
}