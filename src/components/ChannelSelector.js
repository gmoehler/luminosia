import React from 'react';
import PropTypes from 'prop-types';
import styled /*, { withTheme } */ from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Tooltip, IconButton } from '@material-ui/core';
import {indigo } from '@material-ui/core/colors/indigo';
import DownloadChannelIcon from '@material-ui/icons/SaveAlt';
import DeleteChannelIcon from '@material-ui/icons/DeleteForever';

const ChannelControlWrapper = styled.div`
  display: flex
  justify-content: space-between;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 90;
  background: #3f51b5;
  height: 90;
`;

const LowerIcons = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
`;

const styles = () => ({
  switchWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
  },
  switch: {
    fill: 'white',
  },
  button: {
    padding: 0,
    margin: 0,
  },
  lowerIcons: {
  	display: 'flex',
  	flexDirection: 'row',
  	margin: 0,
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
        <ChannelControlWrapper background = {indigo}>
          <FormControlLabel
            key={channel.id}
            className={ classes.switchWrapper }
            control={
              <Switch disabled={channel.type === "audio"}
                checked={channel.selected}
                onChange={this.handleChange(channel.id)}
              />
            }
          />
          <div className={ classes.lowerIcons }>
          <Tooltip title="Export image channel">
            <IconButton color="inherit" 
              className={ classes.button }
              onClick={ () => this.props.exportImageChannel(channel.id) }>
              <DownloadChannelIcon/>
            </IconButton>
            </Tooltip>

          <Tooltip title="Delete image channel">
            <IconButton color="inherit" 
              className={ classes.button }
              onClick={ () => this.props.deleteChannel(channel.id) }>
              <DeleteChannelIcon/>
            </IconButton>
          </Tooltip>
          </div>

        </ChannelControlWrapper>
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