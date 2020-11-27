import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getChannelExportData } from "../actions/ioActions";
import { samplesToRad } from "../utils/conversions";
import { Typography, Slider } from "@material-ui/core";

const minRotationSpeed = 0.1;
const maxRotationSpeed = 9.9;

const WhiteSlider = styled(Slider)`
  .MuiSlider-track {
    background-color: white;
  }
  .MuiSlider-thumbWrapper {
    button {
      background-color: white;
    }
  }
`;

const AnimationPaneWrapper = styled.div`
	width:  calc(95vw - ${props => props.drawerWidth}px);
	background-color: black;
	display: flex;
	flex-direction: row;
`;

const AnimationControl = styled.div`
	width:  96px;
	background-color: #2c387e;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: flex-end;
	padding: 20px;
	color: #3f51b5;
	font-weight: 600;
`;

const RotationSpeed = styled(Typography)`
	color: white
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
		};
	}

	componentDidMount() {
		this.draw();
	}

	componentDidUpdate(prevProps) {
		const initiallyBlack = this.props.progress && !prevProps.progress;
		this.draw(initiallyBlack);
	}

	drawArc(cc, arcIdx, color, radius, fromRad, toRad) {

		const { resolution } = this.props;

		const largestRadius = resolution * (30 + this.innerRadius);
		const centerX = this.margin + largestRadius + arcIdx * (this.margin + 2 * largestRadius);
		const centerY = this.margin + largestRadius;

		cc.beginPath();
		cc.arc(centerX, centerY, resolution * radius, fromRad, toRad, false);
		cc.strokeStyle = color;
		cc.lineWidth = 2;
		cc.stroke();
	}

	draw(initiallyBlack = false) {

		const { progress, sampleRate, activeChannels } = this.props;

		if (progress && progress > 0) {
			// get the part of the image that happened during the last update interval
			const expData = getChannelExportData(this.prevTime, progress, sampleRate);

			const canvas = document.getElementById("animationPaneCanvas");
			// canvas.height = 2* (2*this.innerRadius + 60) + 20;

			const cc = canvas.getContext("2d");
			if (initiallyBlack) {
				cc.fillStyle = "black";
				cc.fillRect(0, 0, canvas.width, canvas.height);
			}

			const oneSampleRad = samplesToRad(1, sampleRate, this.state.rotationSpeed);
			const d = expData.data;
			const numArcs = activeChannels.length;

			// console.log(`Num arcs: ${numArcs} (${expData.height} x ${expData.width})`)

			for (let w = 0; w < expData.width; w++) { //left to right (i.e. time)
				const toRad = this.prevRad + oneSampleRad;
				for (let i = 0; i < 30; i++) { // top to bottom
					for (let arcIdx = 0; arcIdx < numArcs; arcIdx++) { // pois
						const row = 30 * arcIdx + i;
						const startIdx = row * expData.width + w;
						// console.log(`animate: ${row} ${startIdx}`)
						const dataIdx = 4 * startIdx;
						const color = `rgba(${d[dataIdx]},${d[dataIdx + 1]},${d[dataIdx + 2]},255)`;
						this.drawArc(cc, arcIdx, color, i + this.innerRadius, this.prevRad, toRad);
					}
				}
				this.prevRad = toRad;
			}
			this.prevTime = progress;
		}
	}


	speed2slider(speed) {
		return (speed - minRotationSpeed) / (maxRotationSpeed - minRotationSpeed) * 100;
	}

	slider2speed(val) {
		//100 -> max, 0 -> min
		return minRotationSpeed + val / 100 * (maxRotationSpeed - minRotationSpeed);
	}

	handleChange = (ev, val) => {
		const rotationSpeed = this.slider2speed(val);
		this.setState({
			rotationSpeed
		});
	};

	render() {

		const { rotationSpeed } = this.state;

		const { drawerWidth, activeChannels, resolution } = this.props;
		return (
			<AnimationPaneWrapper drawerWidth={ drawerWidth }>
				<AnimationControl>
					<RotationSpeed>	{rotationSpeed.toFixed(1)}</RotationSpeed>

					<WhiteSlider value={ this.speed2slider(rotationSpeed) }
						onChange={ this.handleChange }
						orientation="vertical"
						style={ { width: 0 } } />
				</AnimationControl>
				<AnimationCanvas
					id="animationPaneCanvas"
					height={ resolution * 80 }
					width={ activeChannels.length * resolution * 80 } />
			</AnimationPaneWrapper>

		);
	}
}

AnimationPane.propTypes = {
	progress: PropTypes.number,
	sampleRate: PropTypes.number.isRequired,
	resolution: PropTypes.number.isRequired,
	activeChannels: PropTypes.arrayOf(PropTypes.string),
	drawerWidth: PropTypes.number,
};