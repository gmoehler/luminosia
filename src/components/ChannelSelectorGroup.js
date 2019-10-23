import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import ChannelSelector from "./ChannelSelector";

const styles = () => ({
  formGroup: {
    paddingTop: "30px",
    background: "#2c387e",
    borderTop: "1px #3949ab solid",
    borderBottom: "1px #3949ab solid",
  },
});

function ChannelSelectorGroup(props) {

  const { classes, channelIds, ...passthruProps } = props;

  const channelSelectors = props.channelIds
    .map((channelId) => {

      const channelInfo = {
        ...passthruProps,
        ...props.getChannelSelectorData(channelId),
        key: channelId,
      };

      return (<ChannelSelector { ...channelInfo } />);

    });

  return (
    <FormGroup className={ classes.formGroup }>
      {channelSelectors}
    </FormGroup>
  );
}

ChannelSelectorGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  channelIds: PropTypes.array,
  getChannelSelectorData: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChannelSelectorGroup);