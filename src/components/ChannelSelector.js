import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Tooltip, IconButton } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors/indigo";
import DownloadChannelIcon from "@material-ui/icons/SaveAlt";
import DeleteChannelIcon from "@material-ui/icons/DeleteForever";
import ChannelDupIcon from "@material-ui/icons/FileCopy";

const channelSelectorWidth = 96;

const styles = () => ({
  channelSelectorWrapper: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    margin: 0,
    padding: 0,
    background: "darkgrey",
    height: "90px",
    width: `${channelSelectorWidth}px`,
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

class CustomizedSwitches extends React.Component {

  handleChange = channelId => event => {
    const active = event.target.checked;
    if (active){
      this.props.setChannelActive(channelId);
    } else {
      this.props.unsetChannelActive(channelId);
    }
  };

  render() {
    const { classes, selectedImageChannelId } = this.props;

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
                <Switch disabled={ channel.type === "audio" }
                    checked={ channel.active }
                    onChange={ this.handleChange(channel.channelId) }
                />
                </Tooltip>
            }
          />
          <div className={ classes.lowerIcons }>
          <Tooltip title="Export channel to binary file">
            <IconButton 
                className={ classes.button }
                size={ "large" }
                onClick={ () => this.props.exportImageChannel(channel.channelId) }>
              <DownloadChannelIcon className={ classes.icon } />
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
      <FormGroup>
        {switches}
      </FormGroup>
    );
  }
}

CustomizedSwitches.propTypes = {
  classes: PropTypes.object.isRequired,
  channelOverview: PropTypes.array,
  setChannelActive: PropTypes.func.isRequired,
  unsetChannelActive: PropTypes.func.isRequired,
  duplicateChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
  exportImageChannel: PropTypes.func.isRequired,
  selectedImageChannelId: PropTypes.number,
};

export default withStyles(styles)(CustomizedSwitches);