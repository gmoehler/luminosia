import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = () => ({
  switchWrapper: {
    width: 60,
    height: 90,
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 0,
  },
  switch: {
    transform: 'rotate(-90deg)'
  }
});

class CustomizedSwitches extends React.Component {
  state = {
    // channel{ID} = {is deselected}
  };

  handleChange = id => event => {
    const selected = event.target.checked
    //this.setState({ [id]: deselected });
    if (selected){
      this.props.selectChannel(id);
    } else {
      this.props.deselectChannel(id);
    }
  };

  render() {
    const { classes } = this.props;

    const switches = this.props.channelOverview
    // [{id: 2, type:"image"},{id: 1, type:"audio"},{id: 0, type:"image"}]
      .map((channel) => 
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