import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ImageExporterWrapper = styled.div`
	width:  calc(95vw - ${props => props.drawerWidth}px);
	overflow: auto;
`;

const ImageExporterCanvas = styled.canvas`
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
			<ImageExporterWrapper drawerWidth = { this.props.drawerWidth }>
				<ImageExporterCanvas id = "imageExportCanvas" />
      </ImageExporterWrapper>
    );
  }
}

ImageExporter.propTypes = {
  drawerWidth: PropTypes.number,
};