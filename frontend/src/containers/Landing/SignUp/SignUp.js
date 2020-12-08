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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignUp extends Component {
  state = {
    email_input: '',
    pw_input: '',
    pw_confirm_input: '',
    nickname_input: '',
    emailError: false,
    pw_error: false,
    pw_confirm_error: false
  };

  onSignupButtonClick = async (event) => {
    const correctForm = this.credentialChecker(event);
    if (correctForm === true) {
      const user = {
        email: this.state.email_input,
        password: this.state.pw_input,
        nickname : this.state.nickname_input
      };
      this.props.onSignupUser(user)
        .then(() => {
          console.log("User Signed Up");
        })
    }
  };

  credentialChecker = (e) => {
    e.preventDefault();
    const emailReg = /^[^@\s]+@[^@.\s]+\.[^@\s]+$/;
    const passwordReg = /^(?=.*[a-z])(?=.*\d).{6,}$/;

    let emailError = false;
    let passwordError = false;
    let passwordConfirmError = false;
    if (!emailReg.test(this.state.email_input)) {
      emailError = true;
      this.setState({
        emailError,
      });
    } else {
      emailError = false;
      this.setState({
        emailError,
      });
    }
    if (!passwordReg.test(this.state.pw_input)) {
      passwordError = true;
      this.setState({
        pw_error: passwordError,
      });
    } else {
      passwordError = false;
      this.setState({
        pw_error: passwordError,
      });
    }
    if (this.state.pw_input !== this.state.pw_confirm_input) {
      passwordConfirmError = true;
      this.setState({
        pw_confirm_error: passwordConfirmError,
      });
    } else {
      passwordConfirmError = false;
      this.setState({
        pw_confirm_error: passwordConfirmError,
      });
    }
    return (!emailError) && (!passwordError) && (!passwordConfirmError);
  };

  render() {
    const { classes } = this.props;
    if(this.props.loginState === 'SUCCESS') {
      return <Redirect to='/'/>
    }
    return (
      <div className="Signup">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={this.state.emailError}
                  helperText={this.state.emailError ? 'Please use a valid email address.' : false}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => this.setState({ email_input: event.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={this.state.pw_error}
                  helperText={this.state.pw_error ? 'Must contain at least one number and one letter, and at least 6 or more characters.' : false}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(event) => this.setState({ pw_input: event.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={this.state.pw_confirm_error}
                  helperText={this.state.pw_confirm_error ? 'Must match password.' : false}
                  variant="outlined"
                  required
                  fullWidth
                  name="password-confirmation"
                  label="Password Confirmation"
                  type="password"
                  id="password-confirmation"
                  autoComplete="current-password"
                  onChange={(event) => this.setState({ pw_confirm_input: event.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="Nickname"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Nickname"
                  autoFocus
                  onChange={(event) => this.setState({ nickname_input: event.target.value })}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              id="signup-button"
              className={classes.submit}
              onClick={(event) => {
                this.onSignupButtonClick(event);
              }}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Log in
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
  onSignupUser: async (user) => { await dispatch(userActionCreators.signUpRequest(user)); },
});

const mapStateToProps = (state) => ({
  registerState : state.user.register.status,
  registerErrorCode : state.user.register.error,
  userState : state.user.status,
  loginState : state.user.login.status
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(SignUp)));