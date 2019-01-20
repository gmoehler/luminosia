import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageExporter from './ImageExporter'

import { getChannelData, getMaxDuration } from '../reducers/channelReducer';

export const channelId = 1;

class ImageExporterContainer extends Component {

  render() {

    return (
      <ImageExporter 
        data ={this.props.channelData}
        maxDuration={this.props.maxDuration}
      />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    data: getChannelData(state, channelId),
    maxDuration: getMaxDuration(state),
  }
};

const mapDispatchToProps = dispatch => ({
  // nothing for now
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageExporterContainer);
