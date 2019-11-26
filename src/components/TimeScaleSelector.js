import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import { Tooltip, IconButton } from "@material-ui/core";

import {
  Magnet as SnapIcon,
} from "mdi-material-ui";

const channelSelectorWidth = 96;

const styles = () => ({
  snapWrapper: {
    height: "30px",
    width: `${channelSelectorWidth}px`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    border: "1px #3949ab solid",
    borderRight: "none",
  },
  snapButton: {
    color: props => props.snapToMarkers ? "red" : "white",
  },
  snapIcon: {
    width: ".6em"
  },
  checked: {} // default checkbox style
});

function TimeScaleSelector(props) {

  const { classes, snapToMarkers } = props;
  const tooltipText = `Snap to markers: ${snapToMarkers ? "on" : "off"}`;

  return (
    <div
      className={ classes.snapWrapper }>
      <Tooltip title={ tooltipText }>
        <IconButton
          props={ { snapToMarkers } }
          className={ classes.snapButton }
          onClick={ props.toggleSnapToMarkers }>
          <SnapIcon
            className={ classes.snapIcon } />
        </IconButton>

      </Tooltip>
    </div >

  );
};

TimeScaleSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  snapToMarkers: PropTypes.bool.isRequired,
  toggleSnapToMarkers: PropTypes.func.isRequired,
};

export default withStyles(styles)(TimeScaleSelector);