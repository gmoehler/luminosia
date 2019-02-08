import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getChannelExportData } from '../actions/generalActions';
import { samplesToRad } from '../utils/conversions';
import Slider from '@material-ui/lab/Slider';

const minRotationSpeed = 0.1;
const maxRotationSpeed = 10;


const AnimationPaneWrapper = styled.div`
	width:  calc(95vw - ${props => props.drawerWidth}px);
	background: black;
	display: flex;
	flex-orientation: row;
`;

const AnimationControl = styled.div`
	width:  96px;
	background: darkgrey;
`;

const AnimationCanvas = styled.canvas`
`;

export default class AnimationPane extends PureComponent {
	constructor(props) {
		super(props);
		this.prevRad = 0;
		this.prevTime = 0;
		this.innerRadius = 2;
		this.margin = 10;
		this.state = {
			rotationSpeed: 2, // rotations per second
		}
	}


	drawArc(cc, arcIdx, color, radius, fromRad, toRad) {

		const {resolution} = this.props;

		const largestRadius = resolution * (30 + this.innerRadius);
		const centerX = this.margin + largestRadius + arcIdx * (this.margin + 2 * largestRadius);
		const centerY = this.margin + largestRadius;

		cc.beginPath();
		cc.arc(centerX , centerY, resolution*radius, fromRad, toRad, false);
		cc.strokeStyle = color;
		cc.lineWidth = 2;
		cc.stroke();
	}

	draw() {

		const {progress, sampleRate, selectedChannels } = this.props;

		if (progress && progress > 0) {
			// get the part of the image that happened during the last update interval
			const expData = getChannelExportData(this.prevTime, progress, sampleRate);

			const canvas = document.getElementById("animationPaneCanvas");
			// canvas.height = 2* (2*this.innerRadius + 60) + 20;
			const cc = canvas.getContext('2d');

			const oneSampleRad  = samplesToRad(1, sampleRate, this.state.rotationSpeed);
			const d = expData.data;
			const numArcs = selectedChannels.length;

			// console.log(`Num arcs: ${numArcs} (${expData.height} x ${expData.width})`)

				for (let w = 0; w < expData.width; w++) { //left to right (i.e. time)
					const toRad = this.prevRad + oneSampleRad;
					for (let i=0; i < 30; i++) { // top to bottom
						for (let arcIdx=0; arcIdx < numArcs; arcIdx++) { // pois
							const row = 30 * arcIdx + i;
							const startIdx = row * expData.width + w;
							// console.log(`animate: ${row} ${startIdx}`)
							const dataIdx = 4 * startIdx;
							const color = `rgba(${d[dataIdx]},${d[dataIdx+1]},${d[dataIdx+2]},255)`;
							this.drawArc(cc, arcIdx, color, i+this.innerRadius, this.prevRad, toRad)
						}
					}
					this.prevRad = toRad;
			}
			this.prevTime = progress;
	}
}
	
	componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }
  
  handleChange = (ev, val) => {
  	const rotationSpeed = 10 / (101-val); // 0.1 ... 10
  	this.setState({rotationSpeed});
  };

  render() {
  	
  	const { rotationSpeed } = this.state;

		const {drawerWidth, selectedChannels, resolution} = this.props;
    return (
			<AnimationPaneWrapper
					drawerWidth = {drawerWidth}>
					<AnimationControl>
						<Slider 
							value={rotationSpeed}
							onChange={this.handleChange}
							vertical
						/>
					</AnimationControl>
					<AnimationCanvas 
						id = "animationPaneCanvas" 
						height = {resolution * 80}
						width = {selectedChannels.length * resolution * 80}/>
        </AnimationPaneWrapper>
        
    )
	}
}

AnimationPane.propTypes = {
	progress: PropTypes.number,
	sampleRate: PropTypes.number.isRequired,
}