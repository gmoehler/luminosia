import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { Tooltip, IconButton, Typography } from "@material-ui/core";
import Slider from "@material-ui/lab/Slider";
import { indigo } from "@material-ui/core/colors/indigo";
import UploadChannelIcon from "@material-ui/icons/Publish";
import DownloadChannelIcon from "@material-ui/icons/SaveAlt";
import DeleteChannelIcon from "@material-ui/icons/DeleteForever";
import ChannelDupIcon from "@material-ui/icons/FileCopy";
import isElectron from "is-electron";
import styled from "styled-components";

const WhiteSlider = styled(Slider) `
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
  formGroup: {
    paddingTop: "30px",
    background: "#2c387e",
  },
  channelSelectorWrapper: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: "12px",
    height: "92px",
    width: `${channelSelectorWidth}px`,
    borderColor: "#3949ab",
    borderTop: "1px #2c387e solid",
    borderBottom: "1px #2c387e solid",
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
  actionsWrapper:{
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
    paddingTop: "8px",
  },
});

class ChannelSelector extends React.Component {

  handleChange = (channelId, active) => (event, val) => {
    this.props.updateChannel({
    	channelId,
        gain: val
    });
    if (val === 0 && active) {
    	this.props.unsetChannelActive(channelId);
    } else if (val > 0 && !active){
    	this.props.setChannelActive(channelId);
    } 
  };

  render() {
    const { classes, selectedImageChannelId, channelOverview } = this.props;
    const electronVersion = isElectron();

    const switches = channelOverview
      .map((channel) => 
        (<div key={ channel.channelId }
            className={ classNames(
              classes.channelSelectorWrapper,
              selectedImageChannelId === channel.channelId && channel.active && classes.wrapperSelected,
              !channel.active && classes.wrapperInActive) 
            }
            background = { indigo }>

          <div className={ classes.actionsWrapper }>
            <div className={ classes.actionsRow }>
            <Tooltip title={ electronVersion ? "Upload channel to poi" : "Download binary channel data" }>
              <IconButton 
                  className={ classes.button }
                  size={ "large" }
                  onClick={ () => this.props.exportImageChannel(channel.channelId) }>
                { electronVersion ? 
                  <UploadChannelIcon className={ classes.icon } /> :
                  <DownloadChannelIcon className={ classes.icon } /> }
              </IconButton>
              </Tooltip>
            </div>

            <div className={ classNames(
              classes.actionsRow, classes.actionsRow2) }>
              <Tooltip title="Duplicate channel">
                <IconButton 
                    className={ classes.button }
                    onClick={ () => this.props.duplicateChannel(channel.channelId) }>
                  <ChannelDupIcon className={ classes.icon } />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete channel">
              <IconButton 
                  className={ classes.button }
                  onClick={ () => this.props.deleteChannel(channel.channelId) }>
                <DeleteChannelIcon className={ classes.icon } />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={ classes.sliderWrapper }>
        <Tooltip title={ channel.gain === 0 ? "off" : channel.gain }>
          <WhiteSlider vertical 
              className={ classes.slider }
              value={ channel.gain }
              onChange={ this.handleChange(channel.channelId, channel.active) }
              min={ 0 }
              max={ 1 } />
        </Tooltip>
      </div>

        </div>)
      );

    return (
      <FormGroup className={ classes.formGroup }>
        {switches}
      </FormGroup>
    );
  }
}

ChannelSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  channelOverview: PropTypes.array,
  setChannelActive: PropTypes.func.isRequired,
  unsetChannelActive: PropTypes.func.isRequired,
  updateChannel: PropTypes.func.isRequired,
  duplicateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
  exportImageChannel: PropTypes.func.isRequired,
  selectedImageChannelId: PropTypes.number,
};

export default withStyles(styles)(ChannelSelector);