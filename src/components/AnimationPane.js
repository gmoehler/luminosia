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
		this.sampleRate = 100
		this.innerRadius = 10;
		this.done= 0;
		this.state = {
			rotationSpeed: 40, // rotations per second
		}
	}


	drawArc(cc, color, radius, fromRad, toRad) {
		cc.beginPath();
		// 2 arcs because of double size
		cc.arc(80, 80, 2*radius, fromRad, toRad, false);
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