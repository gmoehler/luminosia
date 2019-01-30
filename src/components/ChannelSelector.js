import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Tooltip, IconButton } from '@material-ui/core';
import {indigo } from '@material-ui/core/colors/indigo';
import DownloadChannelIcon from '@material-ui/icons/SaveAlt';
import DeleteChannelIcon from '@material-ui/icons/DeleteForever';

const styles = () => ({
  channelControlWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    background: 'darkgrey',
    height: '90px',
    width: '72px',
  },
  wrapperSelected: {
    background: '#3f51b5',
  },
  switchWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
  },
  icon: {
    fill: 'white',
  },
  button: {
    padding: 0,
    margin: 0,
  },
  lowerIcons: {
  	display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '0 9px 12px 9px',
    fill: 'white',
  }
});

class CustomizedSwitches extends React.Component {

  handleChange = id => event => {
    const selected = event.target.checked
    if (selected){
      this.props.selectChannel(id);
    } else {
      this.props.deselectChannel(id);
    }
  };

  render() {
    const { classes } = this.props;

    const switches = this.props.channelOverview
      .map((channel) => 
        <div className={ classNames(
          classes.channelControlWrapper,
          channel.selected && classes.wrapperSelected)}
          background = {indigo}>
          <FormControlLabel
            key={channel.id}
            className={ classes.switchWrapper }
            control={
              <Tooltip title={channel.selected?"Mute":"Unmute"}>
                <Switch disabled={channel.type === "audio"}
                  checked={channel.selected}
                  onChange={this.handleChange(channel.id)}
                />
                </Tooltip>
            }
          />
          <div className={ classes.lowerIcons }>
          <Tooltip title="Export image channel">
            <IconButton 
              className={ classes.button }
              onClick={ () => this.props.exportImageChannel(channel.id) }>
              <DownloadChannelIcon className={classes.icon}/>
            </IconButton>
            </Tooltip>

          <Tooltip title="Delete image channel">
            <IconButton 
              className={ classes.button }
              onClick={ () => this.props.deleteChannel(channel.id) }>
              <DeleteChannelIcon className={classes.icon}/>
            </IconButton>
          </Tooltip>
          </div>

        </div>
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
  selectChannel: PropTypes.func.isRequired,
  deselectChannel: PropTypes.func.isRequired,
};

export default withStyles(styles)(CustomizedSwitches);