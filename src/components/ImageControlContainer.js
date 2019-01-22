import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadImagesfromStorage, saveImagesToStorage, clearImagesfromStorage, clearImageList } from '../actions/imageListActions'
import ImageControl from './ImageControl';

class ImageControlContainer extends Component {

  render() {

    return (
      <ImageControl 
        loadImagesfromStorage={this.props.loadImagesfromStorageAction}
        saveImagesToStorage={this.props.saveImagestoStorageAction}
        clearImageList={this.props.clearImageListAction}
        clearImagesfromStorage={this.props.clearImagesfromStorageAction}
      />
      );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  loadImagesfromStorageAction: () => dispatch(loadImagesfromStorage()),
  saveImagestoStorageAction: () => dispatch(saveImagesToStorage()),
  clearImagesfromStorageAction: () => dispatch(clearImagesfromStorage()),
  clearImageListAction: () => dispatch(clearImageList()),
})


export default connect(mapStateToProps, mapDispatchToProps)(ImageControlContainer);
