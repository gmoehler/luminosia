import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";
import isElectron from "is-electron";

import { withStyles } from "@material-ui/core/styles";
import { Tooltip, IconButton, Slider } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors/indigo";

import {
  SaveAlt as DownloadChannelIcon,
  DeleteForever as DeleteChannelIcon,
} from "@material-ui/icons";
import {
  LighthouseOn as UploadImageChannelToPoiIcon,
  ContentDuplicate as ChannelDupIcon
} from "mdi-material-ui";

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

const channelSelectorWidth = 96;

const styles = () => ({
  channelSelectorWrapper: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: "12px",
    height: "92px",
    width: `${channelSelectorWidth}px`,
    border: "1px #3949ab solid",
    borderRight: "none",
  },
  wrapperInActive: {
    background: "#212121",
  },
  wrapperSelected: {
    backgroundColor: "#3f51b5",
  },
  sliderWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "4px",
  },
  icon: {
    fill: "white",
    width: ".8em"
  },
  button: {
    padding: 0,
    margin: 0,
  },
  button1: {
    paddingRight: "8px",
  },
  actionsWrapper: {
    width: "100%",
    paddingRight: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  actionsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionsRow2: {
    padding: "8px 0 2px 0",
  },
});

function ChannelSelector(props) {

  const handleChange = (channelId, active) => (event, val) => {
    props.updateChannel({
      channelId,
      gain: val
    });
    if (val === 0 && active) {
      props.setChannelInactive(channelId);
    } else if (val > 0 && !active) {
      props.setChannelActive(channelId);
    }
  };

  const { classes, channelId, selected, active, gain, type } = props;
  const electronVersion = isElectron();
  const isImageChannel = type === "image";

  return (
    <div key={ channelId }
      className={ classNames(
        classes.channelSelectorWrapper,
        selected && active && classes.wrapperSelected,
        !active && classes.wrapperInActive)
      }
      background={ indigo }>

      <div className={ classes.actionsWrapper }>
        <div className={ classes.actionsRow }>
          {isImageChannel && <Tooltip title="Upload channel to poi">
            <IconButton
              className={ classNames(classes.button, classes.button1) }
              disabled={ !electronVersion }
              onClick={ () => props.uploadImageChannelToPoi(channelId) }>
              <UploadImageChannelToPoiIcon className={ classes.icon } />
            </IconButton>
          </Tooltip>}
          {isImageChannel && <Tooltip title={ "Save channel as binary" }>
            <IconButton
              className={ classes.button }
              onClick={ () => props.saveImageChannelAsBinary(channelId) }>
              <DownloadChannelIcon className={ classes.icon } />
            </IconButton>
          </Tooltip>}
        </div>

        <div className={ classNames(classes.actionsRow, classes.actionsRow2) }>
          {isImageChannel && <Tooltip title="Duplicate channel">
            <IconButton
              className={ classNames(classes.button, classes.button1) }
              onClick={ () => props.duplicateChannel(channelId) }>
              <ChannelDupIcon className={ classes.icon } />
            </IconButton>
          </Tooltip>}

          <Tooltip title="Delete channel">
            <IconButton
              className={ classes.button }
              onClick={ () => props.deleteChannel(channelId) }>
              <DeleteChannelIcon className={ classes.icon } />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={ classes.sliderWrapper }>
        <Tooltip title={ gain === 0 ? "channel off" : `gain: ${gain.toPrecision(2)}` }>
          <WhiteSlider 
            orientation="vertical"
            className={ classes.slider }
            value={ gain }
            onChange={ handleChange(channelId, active) }
            min={ 0 }
            max={ 1 }
            step={ 0.05 } />
        </Tooltip>
      </div>

    </div>);

}

ChannelSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  channelId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["image", "audio"]).isRequired,
  selected: PropTypes.bool,
  active: PropTypes.bool,
  gain: PropTypes.number,
  setChannelActive: PropTypes.func.isRequired,
  setChannelInactive: PropTypes.func.isRequired,
  updateChannel: PropTypes.func.isRequired,
  duplicateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
  uploadImageChannelToPoi: PropTypes.func.isRequired,
  saveImageChannelAsBinary: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelSelector);