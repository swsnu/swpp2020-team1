import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as userActionCreators from '../../../store/actions/userAction';
import {withRouter} from 'react-router'

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';

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
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
        console.log("User Logged In");
        this.props.history.push('/');
      })
      .catch(error => {
          alert('login fail')
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className="Login">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
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
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link variant="body2" onClick={() => this.handlerSignup()}>
                    Don&apos;t have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  onLoginUser: async (user) => { await dispatch(userActionCreators.loginRequest(user)); },
});

const mapStateToProps = (state) => ({
  loginState : state.user.login.status,
  userState : state.user.status
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(SignIn)));