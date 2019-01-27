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
		this.sampleRate = 100
		this.innerRadius = 5;
		this.done= 0;
		this.state = {
			rotationSpeed: 40, // rotations per second
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
		const curArray = Object.values(this.props.current);
		if (curArray.length>0){
			const d = curArray[0].data;
			const t = curArray[0].playTime;
			const factor =  t * this.state.rotationSpeed / this.sampleRate;
			const f2 = factor % 1;
			const toRad = 2* Math.PI * f2;

			const canvas = document.getElementById("animationPaneCanvas");
			const cc = canvas.getContext('2d');
			

			for (let i=0; i<30; i++){
				const startIdx = i*4;
				const color = `rgba(${d[startIdx]},${d[startIdx+1]},${d[startIdx+2]},255)`
				this.drawArc(cc, color, i+this.innerRadius, this.prevRad, toRad);
			}
			
			this.prevRad = toRad;
			this.done++;
		}
	}

	draw2() {

		const channelData =  getChannelExportData();
		if (channelData.width > 0) {
			const t = this.props.progress;
			const expData = getChannelExportData(this.props.prevTime, t, this.sampleRate);
			const d = expData.data;

			const canvas = document.getElementById("animationPaneCanvas");
			// canvas.height = 2* (2*this.innerRadius + 60) + 20;
			const cc = canvas.getContext('2d');

			const oneSampleRad  = samplesToRad(1, this.sampleRate, this.state.rotationSpeed);

			// TODO if height is higher than 30 assume multiple channels

			for (let w = 0; w < expData.width; w++) {

				const toRad = this.prevRad + oneSampleRad;
				
				for (let i=0; i < 30; i++) {
					const startIdx = i*4;
					const color = `rgba(${d[startIdx][w]},${d[startIdx+1][w]},${d[startIdx+2][w]},255)`;
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
	current: PropTypes.shape({
		data: PropTypes.arrayOf(PropTypes.number),
		playTime: PropTypes.number,
		}),
}