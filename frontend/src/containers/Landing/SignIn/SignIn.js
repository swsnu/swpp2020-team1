import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as userActionCreators from '../../../store/actions/user';
import {withRouter} from 'react-router';
import { Redirect } from 'react-router';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7DBF1A',
      dark: '#7DBF1A',
      light: '#7DBF1A',
      contrastText: "#fff"
    },
  },
});

const styles = (theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#7DBF1A",
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  title: {
    marginTop: 12,
    color: "#818181",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','),
    fontWeight: 900,
  },
  text:{
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','), 
  },
  white: {
    color: "#FFFFFF",
  },
});

class SignIn extends Component { 
  state = {
    email_input: '',
    pw_input: '',
  };

  credentialChecker = (e) => {
    e.preventDefault();
  };

  handlerSignup = () => {
    this.props.history.push('/signup');
  }

  onLoginButtonClick = async () => {
    const user = { 
      username: this.state.email_input, 
      password: this.state.pw_input };
    this.setState({
      email_input: '',
      pw_input: '',
    });

    this.props.onLoginUser(user)
      .then(() => {
        // console.log("User Logged In");
      })
  };

  render() {
    const { classes } = this.props;
    if(this.props.loginState === 'SUCCESS') {
      return <Redirect to='/'/>
    }
    return (
      <MuiThemeProvider theme={theme}>
      <div className="SignIn">
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              로그인 
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={this.state.email_input}
                onChange={(event) => { this.setState({ email_input: event.target.value }); }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={this.state.pw_input}
                onChange={(event) => this.setState({ pw_input: event.target.value })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                id="login-button"
                onClick={(event) => { this.credentialChecker(event); this.onLoginButtonClick(); }}
              >
                Log In
              </Button>
              <Grid container>
                <Grid item xs>

                </Grid>
                <Grid item>
                  <Link id="sign-up" variant="body2" onClick={() => this.handlerSignup()}>
                    Don&apos;t have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              <Dialog
                open={this.props.loginState==="FAILURE"}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.props.onSignup}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">{"로그인 실패"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    이메일 및 비밀번호를 확인해주세요!
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.props.onSignin} color="primary">
                    확인
                  </Button>
                </DialogActions>
              </Dialog> 
            </form>
          </div>
        </Container>
      </div>
      </MuiThemeProvider>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  onLoginUser: async (user) => { await dispatch(userActionCreators.loginRequest(user)); },
  onSignin: async (user) => { await dispatch(userActionCreators.login(user)); }, 
});

const mapStateToProps = (state) => ({
  loginState : state.user.login.status,
  userState : state.user.status
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(SignIn)));