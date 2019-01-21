import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ImageExporterWrapper = styled.div`
	width: 800px;
`;

const ImageExporterCanvas = styled.canvas`
	height: 30px;
	overflow: auto;
	flex-wrap: wrap;
`;


export default class ImageExporter extends PureComponent {
	constructor(props) {
    super(props);
		this.state = {
			dragging: false
		};
	}


  render() {


    return (
			<ImageExporterWrapper>
					<ImageExporterCanvas 
						id = "imageExportCanvas" />
      </ImageExporterWrapper>
    )
  }
}

ImageExporter.propTypes = {
	channelData: PropTypes.object, // data of a channel
	maxDuration: PropTypes.number,
}