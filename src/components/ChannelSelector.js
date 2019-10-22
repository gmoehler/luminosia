import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";
import isElectron from "is-electron";

import { withStyles } from "@material-ui/core/styles";
import { Tooltip, IconButton } from "@material-ui/core";
import { Slider } from "@material-ui/lab";
import { indigo } from "@material-ui/core/colors/indigo";
import {
  Publish as UploadChannelIcon,
  SaveAlt as DownloadChannelIcon,
  DeleteForever as DeleteChannelIcon,
  FileCopy as ChannelDupIcon,
} from "@material-ui/icons";

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
    borderTop: "1px #3949ab solid",
    borderBottom: "1px #3949ab solid",
  },
  wrapperInActive: {
    background: "#212121",
  },
  wrapperSelected: {
    background: "#8c9eff",
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
  actionsWrapper: {
    width: "100%",
    paddingRight: "18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  actionsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
      props.unsetChannelActive(channelId);
    } else if (val > 0 && !active) {
      props.setChannelActive(channelId);
    }
  };

  const { classes, channelId, selected, active, gain } = props;
  const electronVersion = isElectron();

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
          <Tooltip title="Upload channel to poi">
            <IconButton
              className={ classes.button }
              disabled={ !electronVersion }
              onClick={ () => props.uploadImageChannel(channelId) }>
              <UploadChannelIcon className={ classes.icon } />
            </IconButton>
          </Tooltip>
          <Tooltip title={ "Download channel" }>
            <IconButton
              className={ classes.button }
              onClick={ () => props.downloadImageChannel(channelId) }>
              <DownloadChannelIcon className={ classes.icon } />
            </IconButton>
          </Tooltip>
        </div>

        <div className={ classNames(
          classes.actionsRow, classes.actionsRow2) }>
          <Tooltip title="Duplicate channel">
            <IconButton
              className={ classes.button }
              onClick={ () => props.duplicateChannel(channelId) }>
              <ChannelDupIcon className={ classes.icon } />
            </IconButton>
          </Tooltip>

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
          <WhiteSlider vertical
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
  selected: PropTypes.bool,
  active: PropTypes.bool,
  gain: PropTypes.number,
  setChannelActive: PropTypes.func.isRequired,
  unsetChannelActive: PropTypes.func.isRequired,
  updateChannel: PropTypes.func.isRequired,
  duplicateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
  uploadImageChannel: PropTypes.func.isRequired,
  downloadImageChannel: PropTypes.func.isRequired,
  selectedImageChannelId: PropTypes.number,
};

export default withStyles(styles)(ChannelSelector);