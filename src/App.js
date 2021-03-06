import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import BurstModeIcon from "@material-ui/icons/BurstMode";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import HeaderContainer from "./components/HeaderContainer";
import ImageControlContainer from "./components/ImageControlContainer";
import ImageListContainer from "./components/ImageListContainer";
import ChannelGroupContainer from "./components/ChannelGroupContainer";
import { Tooltip } from "@material-ui/core";
import ImageExporter from "./components/ImageExporter";
import AnimationPaneContainer from "./components/AnimationPaneContainer";
import ChannelSelectorGroupContainer from "./components/ChannelSelectorGroupContainer";
import UploadLogViewContainer from "./components/UploadLogViewContainer";
import MessageViewContainer from "./components/MessageViewContainer";

const drawerWidth = 400;
const channelSelectorWidth = 96;

const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 20,
    minWidth: "6em",
  },
  title1: {
    color: "#f44336",
  },
  title2: {
    color: "#ffc107",
  },
  title3: {
    color: "#e91e63",
  },
  title4: {
    color: "#8bc34a",
  },
  title5: {
    color: "#00bcd4",
  },
  title6: {
    color: "#8bc34a",
  },
  title7: {
    color: "#af52bf",
  },
  title8: {
    color: "#d7e360",
  },
  title9: {
    color: "#ffc107",
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  channelPane: {
    display: "flex",
    flexDirection: "row",
  }
});

class App extends React.Component {
  static getDerivedStateFromError(error) {
    return { error };
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      open: false,
    };
  }

  componentDidCatch(error, state) {
    this.setState({
      ...this.state,
      error
    });
  }


  handleDrawerOpen = () => {
    this.setState({
      ...this.state,
      open: true
    });
  };

  handleDrawerClose = () => {
    this.setState({
      ...this.state,
      open: false
    });
  };

  render() {

    if (this.state.error) {
      return (
        <div>
          <p> ERROR! Cannot continue. </p>
          {this.state.error.message ? <p> {this.state.error.message} </p> : null}
          {this.state.error.stack ? <p> {this.state.error.stack} </p> : null}
        </div>
      );
    }

    const { classes, theme } = this.props;
    const { open } = this.state;

    return (
      <div className={ classes.root }>
        <CssBaseline />
        <AppBar position="fixed"
          className={ classNames(classes.appBar, {
            [classes.appBarShift]: open,
          }) }>
          <Toolbar disableGutters={ !open }>
            <div className={ classes.title }>
              <Typography
                variant="h6"
                className={ classes.title1 }>L</Typography>
              <Typography variant="h6"
                className={ classes.title2 }>u</Typography>
              <Typography variant="h6"
                className={ classes.title3 }>m</Typography>
              <Typography variant="h6"
                className={ classes.title4 }>i</Typography>
              <Typography variant="h6"
                className={ classes.title5 }>n</Typography>
              <Typography variant="h6"
                className={ classes.title6 }>o</Typography>
              <Typography variant="h6"
                className={ classes.title7 }>s</Typography>
              <Typography variant="h6"
                className={ classes.title8 }>i</Typography>
              <Typography variant="h6"
                className={ classes.title9 }>a</Typography>
            </div>
            <HeaderContainer />
            <div className={ classes.grow }></div>
            <Tooltip title="Work with images">
              <IconButton color="inherit"
                aria-label="Open drawer"
                onClick={ this.handleDrawerOpen }
                className={ classNames(classes.menuButton, open && classes.hide) }>
                <BurstModeIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <main className={ classNames(classes.content, {
          [classes.contentShift]: open,
        }) }>
          <div className={ classes.drawerHeader } />
          <MessageViewContainer />
          <UploadLogViewContainer />
          <AnimationPaneContainer drawerWidth={ open ? drawerWidth : 0 } />
          <div className={ classes.channelPane }>
            <ChannelSelectorGroupContainer />
            <ChannelGroupContainer drawerWidth={ open ? drawerWidth + channelSelectorWidth : channelSelectorWidth }
              width={ channelSelectorWidth } />
          </div>
          <ImageExporter drawerWidth={ open ? drawerWidth : 0 } />
        </main>
        <Drawer className={ classes.drawer }
          variant="persistent"
          anchor="right"
          open={ open }
          classes={ { paper: classes.drawerPaper, } }>
          <div className={ classes.drawerHeader }>
            <IconButton onClick={ this.handleDrawerClose }>
              {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <ImageControlContainer />
          </div>
          <Divider />
          <ImageListContainer />
          <Divider />
        </Drawer>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {
  withTheme: true
})(App);