import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ImageListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	width: 500px;
	overflow: auto;
	white-space: nowrap;
	padding: 20px 0;
`;

const Image = styled.img`
`;


// contains multiple AudioChannels
export default class ImageList extends Component {

  render() {

		const imagesComponent = this.props.images
			.map((img) => 
				<Image 
					key={ img.src } 
					src={ img.src } 
					draggable
					onDragStart={(e)=>e.dataTransfer.setData("src", img.src)} 
				/>
			);

    return (
			<ImageListWrapper>
				{imagesComponent}
      </ImageListWrapper>
		)}
	}

  ImageList.propTypes = {
		images: PropTypes.array, 		// all images
  }