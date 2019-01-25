import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import ChannelControlContainer from './components/ChannelControlContainer';
import ImageControlContainer from './components/ImageControlContainer';
import ImageListContainer from './components/ImageListContainer';
import ChannelGroupContainer from './components/ChannelGroupContainer';
import { Tooltip } from '@material-ui/core';
import ImageExporter from './components/ImageExporter';
import AnimationPaneContainer from './components/AnimationPaneContainer';

const drawerWidth = 400;

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    paddingLeft: 20,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
});

class App extends React.Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({
      open: true
    });
  };

  handleDrawerClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const {classes, theme} = this.props;
    const {open} = this.state;

    return (
      <div className={ classes.root }>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          className={ classNames(classes.appBar, {[classes.appBarShift]: open,}) }
          >
          <Toolbar disableGutters={ !open }>
            <Typography variant="h6" color="inherit" className={ classes.title } noWrap>
              Animation Authoring
            </Typography>
            <ChannelControlContainer/>
            <div  className={classes.grow}></div>
            <Tooltip title="Work with images">
              <IconButton color="inherit" aria-label="Open drawer" onClick={ this.handleDrawerOpen } className={ classNames(classes.menuButton, open && classes.hide) }>
              <BurstModeIcon />
            </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <main className={ classNames(classes.content, {
                            [classes.contentShift]: open,
                          }) }>
          <div className={ classes.drawerHeader } />
          <AnimationPaneContainer drawerWidth={open ? drawerWidth : 0} />
          <ChannelGroupContainer  drawerWidth={open ? drawerWidth : 0} />
          <ImageExporter drawerWidth={open ? drawerWidth : 0} />
        </main>
        <Drawer className={ classes.drawer } variant="persistent" anchor="right" open={ open } 
          classes={ {paper: classes.drawerPaper,} }>
          <div className={ classes.drawerHeader }>
              <IconButton onClick={ this.handleDrawerClose }>
                { theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
              </IconButton>
            <ImageControlContainer/>
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