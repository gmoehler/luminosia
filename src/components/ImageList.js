import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { secondsToPixels } from '../utils/conversions';

const ImageListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	width: 500px;
	overflow: auto;
	white-space: nowrap;
	padding: 20px 0;
	background:  ${props => props.backgroundColor};
`;

const Image = styled.img`
`;


// contains multiple AudioChannels
export default class ImageList extends PureComponent {
	constructor(props) {
    super(props);
		this.state = {
			dragging: false
		};
  }

	handleMouseEvent = (e, eventName) => {
		e.preventDefault();
		e.stopPropagation();
		if (eventName === "dragEnter") {
			this.dragCounter++;			
			this.setState({...this.state, dragging: true})
		} else if (eventName === "dragLeave") {
			this.dragCounter--;
			if (this.dragCounter === 0) {
				this.setState({...this.state, dragging: false});
			}
		} else if (eventName === "drop") {
			this.setState({...this.state, dragging: false});
			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				console.log(eventName);
				const imageFile = e.dataTransfer.files[0];
				var reader = new FileReader();
				const that = this;
    		reader.onload = function(e) {
					that.setState({...that.state, imageFile: reader.result});
					that.props.saveImageToStorage(reader.result, "theImage");
    		}
    		reader.readAsDataURL(imageFile);
				// this.setState({...this.state, imageFile});
				// this.props.saveImageToStorage(e.dataTransfer.files[0], "theImage");
			}
		}
	}

  render() {

		const { images, resolution } = this.props;

		const imagesComponent =  images
			.map((img) => 
			<Image 
				key={ img.src } 
				src={ img.src } 
				draggable onDragStart={ (e) => {
					e.dataTransfer.setData("src", img.src);
					// transfer duration in pixels since this is going to be consumed 
					// in a Channel component which calculates in pixels
					e.dataTransfer.setData("duration", secondsToPixels(img.duration, resolution)); 
				}}
				/>
    );

    return (
			<ImageListWrapper
			onDragEnter={ (e) => this.handleMouseEvent(e, "dragEnter") } 
			onDragEnd={ (e) => this.handleMouseEvent(e, "dragEnd") } 
			onDragExit={ (e) => this.handleMouseEvent(e, "dragExit") } 
			onDragLeave={ (e) => this.handleMouseEvent(e, "dragLeave") } 
			onDragOver={ (e) => this.handleMouseEvent(e, "dragOver") }
			onDragStart={ (e) => this.handleMouseEvent(e, "dragStart") } 
			onDrop={ (e) => this.handleMouseEvent(e, "drop") } 
			backgroundColor={this.state.dragging ? "lightgrey" : "darkgrey"}>
			<Image src={this.state.imageFile}></Image>
        { imagesComponent }
      </ImageListWrapper>
    )
  }
}

ImageList.propTypes = {
	images: PropTypes.array, // all images
	resolution: PropTypes.number,
}