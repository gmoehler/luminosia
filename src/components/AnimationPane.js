import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AnimationPaneWrapper = styled.div`
	width:  calc(95vw - ${props => props.drawerWidth}px);
	height: 150px;
	background: black;
`;

const ImageExporterCanvas = styled.canvas`
	height: 150px;
`;

export default class AnimationPane extends PureComponent {


	drawCircle(cc, color, radius) {
		cc.beginPath();
		cc.fillStyle = color;
		cc.arc(80, 80, 2*radius, 0, Math.PI * 2, true);
		cc.arc(80, 80, 2*radius+1, 0, Math.PI * 2, true);
		cc.closePath();
		cc.fill();
	}

	draw() {
		const d = this.props.currentFrame;
		if (d){
			const canvas = document.getElementById("animationPaneCanvas");
			const cc = canvas.getContext('2d');

			for (let i=29; i>0; i--){
				const startIdx = i*4;
				const color = `rgba(${d[startIdx]},${d[startIdx+1]},${d[startIdx+2]},255)`
				this.drawCircle(cc, color, i);
			}
		}
	}
	

	componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {

    return (
			<AnimationPaneWrapper>
					<ImageExporterCanvas 
						id = "animationPaneCanvas" />
      </AnimationPaneWrapper>
    )
	}


}

AnimationPane.propTypes = {
	currentFrame: PropTypes.arrayOf(PropTypes.number),
}