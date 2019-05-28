import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { secondsToPixels, samplesToSeconds } from "../utils/conversions";

const ImageListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-content: flex-start;
	width: calc(100% - 16px);
	height: 100%;
	overflow: auto;
	flex-wrap: wrap;
	margin: 20px 8px;
	background:  ${props => props.backgroundColor};
	border: 3px dashed ${props => props.borderColor}; 
	border-radius: 10px;
`;

const ImageInList = styled.img`
	margin: 3px;
	max-height: 30px;
	border: 2px solid ${props => props.borderColor};
`;

const DropHereLabel = styled.label`
	width: 100%;
	padding-top: 80px;
	text-align: center;
	justify-content: center;
	font-size: 14pt;
	font-weight: 600;
	color: darkgrey;
`;


// contains multiple AudioChannels
export default class ImageList extends PureComponent {
  constructor(props) {
    super(props);
    this.dragCounter = 0;
    this.state = {
      dragging: false
    };
  }

  componentDidMount() {
    this.props.loadImagesFromStorage();
  }

  loadImageAndAddToStore(fileName) {
    var reader = new FileReader();
    var img = new Image();
    const that = this;

    reader.onload = function(e) {
      img.src = reader.result;
    };
    img.onload = function() {
    	
      if (img.height !== 30) {
      	that.props.setMessage("Can only add images with a height of 30 pixels.");
      } else {
      const newImage = {
        width: img.width,
        height: img.height,
        src: reader.result,
        imageId: fileName.name,
        sampleRate: that.props.sampleRate,
        duration: samplesToSeconds(img.width, that.props.sampleRate)
      };
      that.props.addImage(newImage);
      }
    };
    reader.readAsDataURL(fileName);
  }

  handleMouseEvent = (e, eventName) => {
    e.preventDefault();
    e.stopPropagation();
    if (eventName === "mouseUp") {
      let el = e.target;
      const imageId = el.getAttribute("data-imageid");
      if (e.ctrlKey) {
        this.props.selectMultiImage({
          imageId
        });
      } else {
        this.props.selectImage({
          imageId
        });
      }
    } else if (eventName === "dragEnter") {
      this.dragCounter++;
      this.setState({
        ...this.state,
        dragging: true
      });
    } else if (eventName === "dragLeave") {
      this.dragCounter--;
      if (this.dragCounter <= 0) {
        this.setState({
          ...this.state,
          dragging: false
        });
        this.dragCounter = 0;
      }
    } else if (eventName === "drop") {
      // load images on drop
      this.setState({
        ...this.state,
        dragging: false
      });
      this.dragCounter = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        console.log(eventName);
        const fileList = e.dataTransfer.files;
        for (var i = 0; i < fileList.length; i++) {
          this.loadImageAndAddToStore(fileList[i]);
        }
      }
    }
  }


  render() {

    const { images, resolution } = this.props;

    const imagesComponent = images.map((img) => (
      <ImageInList id={ img.imageId }
          key={ img.imageId }
          src={ img.src }
          data-imageid={ img.imageId }
          borderColor={ this.props.selectedImageIds.includes(img.imageId) ?
                                                                                                               "red" : "transparent" }
          draggable
          onDragStart={ (e) => {
                        e.dataTransfer.setData("src", img.src);
                        e.dataTransfer.setData("imageid", img.imageId);
                        // transfer duration in pixels since this is going to be consumed 
                        // in a Channel component which calculates in pixels
                        e.dataTransfer.setData("duration", secondsToPixels(img.duration, resolution));
                      } } />
    ));

    const dropHereLabel = images.length > 0 ? null :
      <DropHereLabel center> Drop your images here </DropHereLabel>;

    return (
      <ImageListWrapper borderColor={ images.length > 0 ? "tranparent" : "darkgrey" }
          onMouseUp={ (e) => this.handleMouseEvent(e, "mouseUp") }
          onDragEnter={ (e) => this.handleMouseEvent(e, "dragEnter") }
          onDragEnd={ (e) => this.handleMouseEvent(e, "dragEnd") }
          onDragExit={ (e) => this.handleMouseEvent(e, "dragExit") }
          onDragLeave={ (e) => this.handleMouseEvent(e, "dragLeave") }
          onDragOver={ (e) => this.handleMouseEvent(e, "dragOver") }
          onDrop={ (e) => this.handleMouseEvent(e, "drop") }
          backgroundColor={ this.state.dragging ? "darkgrey" : "white" }>
        { dropHereLabel }
        { imagesComponent }
      </ImageListWrapper>
      );
  }
}

ImageList.propTypes = {
  images: PropTypes.array, // all images
  resolution: PropTypes.number,
  loadImagesFromStorage: PropTypes.func.isRequired,
  selectImage: PropTypes.func.isRequired,
  selectMultiImage: PropTypes.func.isRequired,
  selectedImageIds: PropTypes.arrayOf(PropTypes.string),
  sampleRate: PropTypes.number.isRequired,
  addImage: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};