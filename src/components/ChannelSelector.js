import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Tooltip, IconButton } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors/indigo";
import UploadChannelIcon from "@material-ui/icons/Publish";
import DownloadChannelIcon from "@material-ui/icons/SaveAlt";
import DeleteChannelIcon from "@material-ui/icons/DeleteForever";
import ChannelDupIcon from "@material-ui/icons/FileCopy";
import isElectron from "is-electron";

const channelSelectorWidth = 96;

const styles = () => ({
  formGroup: {
    paddingTop: "30px",
    background: "#2c387e",
  },
  channelSelectorWrapper: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    margin: 0,
    padding: 0,
    background: "darkgrey",
    height: "92px",
    width: `${channelSelectorWidth}px`,
    borderTop: "1px #2c387e solid",
    borderBottom: "1px #2c387e solid",
  },
  wrapperActive: {
    background: "#3f51b5",
  },
  wrapperSelected: {
    background: "cornflowerblue",
  },
  switchWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    margin: 0,
    padding: 0,
  },
  icon: {
    fill: "white",
    width: ".8em"
  },
  button: {
    padding: 0,
    margin: 0,
  },
  lowerIcons: {
  	display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "0 9px 12px 9px",
    fill: "white",
  }
});

class ChannelSelector extends React.Component {

  handleChange = channelId => (event, val) => {
    this.props.updateChannel({
    	channelId,
        gain: val
    });
  };

  handleSwitchChange = channelId => event => {
    const active = event.target.checked;
    if (active){
      this.props.setChannelActive(channelId);
    } else {
      this.props.unsetChannelActive(channelId);
    }
  };

  render() {
    const { classes, selectedImageChannelId } = this.props;
    const electronVersion = isElectron();

    const switches = this.props.channelOverview
      .map((channel) => 
        (<div key={ channel.channelId }
            className={ classNames(
              classes.channelSelectorWrapper,
              channel.active && classes.wrapperActive,
              selectedImageChannelId === channel.channelId && classes.wrapperSelected) }
            background = { indigo }>
          <FormControlLabel
              className={ classes.switchWrapper }
              control={
              <Tooltip title={ channel.active?"Mute":"Unmute" }>
                <Slider value={ channel.gain }
                   onChange={ this.handleChange(channel.channelId) }
                   min={0} max={1} />
                <Switch disabled={ channel.type === "audio" }
                    checked={ channel.active }
                    onChange={ this.handleSwitchChange(channel.channelId) }
                />
                </Tooltip>
            }
          />
          <div className={ classes.lowerIcons }>
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
  duplicateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
  exportImageChannel: PropTypes.func.isRequired,
  selectedImageChannelId: PropTypes.number,
};

export default withStyles(styles)(ChannelSelector);