import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';



import ChannelControlContainer from './ChannelControlContainer';
import ImageListContainer from './ImageListContainer';
import ChannelGroupContainer from './ChannelGroupContainer';

const drawerWidth = 240;

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
    justifyContent: 'flex-start',
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

class NavBar extends React.Component {
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
            
            <div  className={classes.grow}></div>
            <IconButton color="inherit" aria-label="Open drawer" onClick={ this.handleDrawerOpen } className={ classNames(classes.menuButton, open && classes.hide) }>
            <BurstModeIcon />
          </IconButton>
          </Toolbar>
        </AppBar>
        <main className={ classNames(classes.content, {
                            [classes.contentShift]: open,
                          }) }>
          <div className={ classes.drawerHeader } />
            <ChannelControlContainer />
            <ImageListContainer />
            <ChannelGroupContainer />
        </main>
        <Drawer className={ classes.drawer } variant="persistent" anchor="right" open={ open } 
          classes={ {paper: classes.drawerPaper,} }>
          <div className={ classes.drawerHeader }>
            <IconButton onClick={ this.handleDrawerClose }>
              { theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
            </IconButton>
          </div>
          <Divider />
          <List>
            { ['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem button key={ text }>
                  <ListItemIcon>
                    { index % 2 === 0 ? <InboxIcon /> : <MailIcon /> }
                  </ListItemIcon>
                  <ListItemText primary={ text } />
                </ListItem>
              )) }
          </List>
          <Divider />

        </Drawer>
      </div>
      );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {
  withTheme: true
})(NavBar);