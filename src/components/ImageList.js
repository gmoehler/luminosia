import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { useDragMouseEvent } from "../hooks/useDragMouseEvent";

const ImageListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-content: flex-start;
	width: calc(100% - 16px);
	height: 100%;
	overflow: auto;
	flex-wrap: wrap;
	margin: 20px 8px;
	background:  ${props => props.backgroundColor};
	border: 3px dashed ${props => props.borderColor}; 
	border-radius: 10px;
`;

const ImageInList = styled.img`
	margin: 3px;
	max-height: 30px;
	border: 2px solid ${props => props.borderColor};
`;

const DropHereLabel = styled.label`
	width: 100%;
	padding-top: 80px;
	text-align: center;
	justify-content: center;
	font-size: 14pt;
	font-weight: 600;
	color: darkgrey;
`;

function ImageList(props) {

  useEffect(() => {
    props.loadImagesFromStorage()
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [handleMouseEvent, dragging] = useDragMouseEvent();

  const { images } = props;

  const imagesComponent = images.map((img) => (
    <ImageInList id={img.imageId}
      key={img.imageId}
      src={img.src}
      data-imageid={img.imageId}
      borderColor={props.isEntitySelected(img.imageId) ? "red" : "transparent"}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("imageid", img.imageId);
        e.dataTransfer.setData("duration", img.duration);
      }} />
  ));

  const dropHereLabel = images.length > 0 ? null :
    <DropHereLabel center> Drop your images here </DropHereLabel>;

  return (
    <ImageListWrapper borderColor={images.length > 0 ? "tranparent" : "darkgrey"}
      onMouseUp={(e) => handleMouseEvent("mouseUp", e)}
      onDragEnter={(e) => handleMouseEvent("dragEnter", e)}
      onDragEnd={(e) => handleMouseEvent("dragEnd", e)}
      onDragExit={(e) => handleMouseEvent("dragExit", e)}
      onDragLeave={(e) => handleMouseEvent("dragLeave", e)}
      onDragOver={(e) => handleMouseEvent("dragOver", e)}
      onDrop={(e) => handleMouseEvent("drop", e)}
      backgroundColor={dragging ? "darkgrey" : "white"}>
      {dropHereLabel}
      {imagesComponent}
    </ImageListWrapper>
  );
}


ImageList.propTypes = {
  images: PropTypes.array, // all images
  loadImagesFromStorage: PropTypes.func.isRequired,
  toggleEntitySelection: PropTypes.func.isRequired,
  toggleMultiEntitySelection: PropTypes.func.isRequired,
  isEntitySelected: PropTypes.func.isRequired,
  sampleRate: PropTypes.number.isRequired,
  addImage: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};

export default ImageList;