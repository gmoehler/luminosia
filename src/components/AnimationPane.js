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
	constructor(props) {
		super(props);
		this.prevRad = 0;
		this.state = {
			rotationSpeed: 10, // rotations per second
			sampleRate: 100
		}
	}


	drawArc(cc, color, radius, fromRad, toRad) {
		cc.beginPath();
		cc.fillStyle = color;
		// 2 arcs because of double size
		cc.arc(80, 80, 2*radius, fromRad, toRad, true);
		//cc.arc(80, 80, 2*radius+1, fromRad, toRad, true);
		cc.closePath();
		//cc.fill();
		cc.lineWidth = 2;
		cc.stroke();
	}

	draw() {
		const d = this.props.current.data;
		if (d){
			const t = this.props.current.playTime;
			const toRad = 2* Math.PI * t * this.state.rotationSpeed / this.state.sampleRate;
			
			const canvas = document.getElementById("animationPaneCanvas");
			const cc = canvas.getContext('2d');

			for (let i=29; i>0; i--){
				const startIdx = i*4;
				const color = `rgba(${d[startIdx]},${d[startIdx+1]},${d[startIdx+2]},255)`
				this.drawArc(cc, color, i, this.prevRad, toRad);
			}
			
			this.prevRad = toRad;
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
	current: PropTypes.shape({
		data: PropTypes.arrayOf(PropTypes.number),
		playTime: PropTypes.number,
		}),
}