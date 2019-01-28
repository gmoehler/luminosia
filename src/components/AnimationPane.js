import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getChannelExportData } from '../actions/generalActions';
import { samplesToRad } from '../utils/conversions';

const AnimationPaneWrapper = styled.div`
	width:  calc(95vw - ${props => props.drawerWidth}px);
	background: black;
`;

const AnimationCanvas = styled.canvas`
`;

export default class AnimationPane extends PureComponent {
	constructor(props) {
		super(props);
		this.prevRad = 0;
		this.prevTime = 0;
		this.innerRadius = 5;
		this.done= 0;
		this.state = {
			rotationSpeed: 2, // rotations per second
		}
	}


	drawArc(cc, color, radius, fromRad, toRad) {
		cc.beginPath();
		// 2 arcs because of double size
		cc.arc(10 + 2*(30 + this.innerRadius / 2), 
			10 + 2*(30 + this.innerRadius / 2), 
			2*radius, fromRad, toRad, false);
		cc.strokeStyle = color;
		cc.lineWidth = 2;
		cc.stroke();
	}

	draw() {

		const t = this.props.progress;
		if (t && t > 0) {
			// get the part of the image that happened during the last update interval
			const expData = getChannelExportData(this.prevTime, t, this.props.sampleRate);

			const canvas = document.getElementById("animationPaneCanvas");
			// canvas.height = 2* (2*this.innerRadius + 60) + 20;
			const cc = canvas.getContext('2d');

			const oneSampleRad  = samplesToRad(1, this.props.sampleRate, this.state.rotationSpeed);
			const d = expData.data;

			// TODO if height is higher than 30 assume multiple channels

			for (let w = 0; w < expData.width; w++) {
				const toRad = this.prevRad + oneSampleRad;
				for (let i=0; i < 30; i++) {
					const startIdx = 4 * (i * expData.width + w);
					const color = `rgba(${d[startIdx]},${d[startIdx+1]},${d[startIdx+2]},255)`;
					this.drawArc(cc, color, i+this.innerRadius, this.prevRad, toRad)
				}
				this.prevRad = toRad;
			}
			this.prevTime = t;
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
			<AnimationPaneWrapper
					drawerWidth = {this.props.drawerWidth}>
					<AnimationCanvas 
						id = "animationPaneCanvas" 
						canvasHeight = {2*(2*this.innerRadius + 60) + 20}/>
      </AnimationPaneWrapper>
    )
	}


}

AnimationPane.propTypes = {
	progress: PropTypes.number,
	sampleRate: PropTypes.number.isRequired,
}