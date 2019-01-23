import React, { Component } from 'react';
import styled from 'styled-components';

const AnimationPaneWrapper = styled.div`
	width:  calc(95vw - ${props => props.drawerWidth}px);
	height: 150px;
	background: black;
`;

const ImageExporterCanvas = styled.canvas`
	height: 150px;
`;

export default class AnimationPane extends Component {

  render() {

    return (
			<AnimationPaneWrapper>
					<ImageExporterCanvas 
						id = "animationPaneCanvas" />
      </AnimationPaneWrapper>
    )
  }
}