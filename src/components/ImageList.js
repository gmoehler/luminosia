import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { secondsToPixels, samplesToSeconds } from '../utils/conversions';

const ImageListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	width: 800px;
	overflow: auto;
	flex-wrap: wrap;
	white-space: nowrap;
	padding: 20px 0;
	background:  ${props => props.backgroundColor};
`;

const ImageInList = styled.img`
	margin: 3px;
	border: 2px solid ${props => props.borderColor};
`;

const DropHereLabel = styled.label`
	padding-left: 30px;
`;


// contains multiple AudioChannels
export default class ImageList extends PureComponent {
	constructor(props) {
    super(props);
		this.state = {
			dragging: false
		};
	}

	loadImageAndAddToStore(fileName) {
		var reader = new FileReader();
		var img = new Image();
		const that = this;

		reader.onload = function(e) {
			img.src = reader.result;
		}
		img.onload = function() {
			const newImage = {
				width: img.width,
				height: img.height,
				src: reader.result,
				id: fileName.name,
				sampleRate: that.props.sampleRate,
				duration: samplesToSeconds(img.width, that.props.sampleRate)
			}
			that.props.addImage(newImage);
		};
		reader.readAsDataURL(fileName);
	}

	handleMouseEvent = (e, eventName) => {
		e.preventDefault();
		e.stopPropagation();
		if (eventName === "mouseUp"){
			let el = e.target;
			const imageId = el.getAttribute("data-imageid");
			this.props.selectImage({
				imageId,
				selected: true
			});
		} else if (eventName === "dragEnter") {
			this.dragCounter++;			
			this.setState({...this.state, dragging: true})
		} else if (eventName === "dragLeave") {
			this.dragCounter--;
			if (this.dragCounter === 0) {
				this.setState({...this.state, dragging: false});
			}
		} else if (eventName === "drop") {
			// load images on drop
			this.setState({...this.state, dragging: false});

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

		const imagesComponent =  images
			.map((img) => 
			<ImageInList 
				key={ img.id } 
				src={ img.src } 
				data-imageid={ img.id }
				borderColor={this.props.selectedImage && img.id === this.props.selectedImage.imageId ? 
					"white" : "transparent" }
				draggable onDragStart={ (e) => {
					e.dataTransfer.setData("src", img.src);
					// transfer duration in pixels since this is going to be consumed 
					// in a Channel component which calculates in pixels
					e.dataTransfer.setData("duration", secondsToPixels(img.duration, resolution)); 
				}}
				/>
		);
		
		const dropHereLabel = images.length > 0 ? null : 
			<DropHereLabel center> Drop your images here </DropHereLabel>

    return (
			<ImageListWrapper
				onMouseUp={ (e) => this.handleMouseEvent(e, "mouseUp") } 

				onDragEnter={ (e) => this.handleMouseEvent(e, "dragEnter") } 
				onDragEnd={ (e) => this.handleMouseEvent(e, "dragEnd") } 
				onDragExit={ (e) => this.handleMouseEvent(e, "dragExit") } 
				onDragLeave={ (e) => this.handleMouseEvent(e, "dragLeave") } 
				onDragOver={ (e) => this.handleMouseEvent(e, "dragOver") }
				onDrop={ (e) => this.handleMouseEvent(e, "drop") } 
				backgroundColor={this.state.dragging ? "lightgrey" : "darkgrey"}>
					{ dropHereLabel }
					{ imagesComponent }
				<canvas id="exportCanvas"></canvas>
      </ImageListWrapper>
    )
  }
}

ImageList.propTypes = {
	images: PropTypes.array, // all images
	resolution: PropTypes.number,
}