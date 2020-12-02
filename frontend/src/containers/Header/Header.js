import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Logout from '../Header/LogOut';

const drawerWidth = 240;
const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class Header extends Component {
  componentDidMount() {
    if (this.props.logged_in) {
      this.props.onGetUser();
    }
  }

  clickRedirectToMain = () => {
    this.props.history.push('/');
  };

  render() {
    const { classes } = this.props;
    if (!this.props.logged_in) {
      return (
        <div className={classes.root}>
          <AppBar position="static" className={classes.appBar} style={{ background: 'white', boxShadow: 'black' }}>
            <Toolbar>
              <IconButton
              edge="start"
              id="redirect-main"
              onClick={() => this.clickRedirectToMain()}
              aria-label="menu">
                <Typography variant="h6" className={classes.title} style={{ color: 'black' }}>
                  HOME
                </Typography>
              </IconButton>
              <Typography variant="h6" className={classes.title} style={{ color: 'black' }} align="center">
                Welcome {this.props.current_user}!
              </Typography>
              <Logout/>
            </Toolbar>
          </AppBar>
        </div>
      );
    }

    return (
      <div></div>
    );
  }
}

const mapStateToProps = (state) => ({
  logged_in: state.user.logged_in,
  current_user: state.user.status.currentUser
  
});

const mapDispatchToProps = (dispatch) => ({
  // onSignout: () => { dispatch(userActionCreators.signoutUser()); },
  // onDeleteToken: (FCMToken) => { dispatch(userActionCreators.deleteUserDevice({ data: { fcmtoken: FCMToken } })); },
  // onGetUser: () => { dispatch(userActionCreators.getUserInfo()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter((withStyles(styles)(Header))));