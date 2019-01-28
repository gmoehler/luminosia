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
    checkedA: true,
    checkedB: true,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;

    const switches = this.props.channelOverview
    // [{id: 2, type:"image"},{id: 1, type:"audio"},{id: 0, type:"image"}]
      .sort((k1, k2) => {
        const str1 = k1.type + k1.id;
        const str2 = k2.type + k2.id;
        if (str1 < str2) {
          return -1;
        } else if (str2 > str1) {
          return 1;
        }
        return 0;
      })
      .map((channel) => 
        <FormControlLabel
          className={ classes.switchWrapper }
          control={
            <Switch
              checked={this.state.checkedA}
              onChange={this.handleChange('checkedA')}
              value="checkedA"
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