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
`;

const Image = styled.img`
`;


// contains multiple AudioChannels
export default class ImageList extends PureComponent {

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
      <ImageListWrapper>
        { imagesComponent }
      </ImageListWrapper>
    )
  }
}

ImageList.propTypes = {
	images: PropTypes.array, // all images
	resolution: PropTypes.number,
}