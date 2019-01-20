import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ImageExporterWrapper = styled.div`
	background:  ${props => props.backgroundColor};
`;

const ImageExporterCanvas = styled.canvas`
	width: 100px;
	height: 30px;
`;


export default class ImageExporter extends PureComponent {
	constructor(props) {
    super(props);
		this.state = {
			dragging: false
		};
	}


  render() {

		// const { channelData, maxDuration } = this.props;

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