import React, {Component} from 'react';
import * as userActionCreators from '../../store/actions/user';
import {connect } from 'react-redux'
import {withRouter} from 'react-router'
import { Button } from '@material-ui/core';
import LogoutImg from '../../icons/logout.png';

class Logout extends Component {
    onClickLogoutButton = () => {
        this.props.logout()
        this.props.history.push('/signin')
    }

    render () {
        return (
            <div className = 'logout'>
                <Button size = 'small' id = 'logout'onClick = {() => this.onClickLogoutButton()}>
                <img src={LogoutImg} width={30} height={30} />
                    </Button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
      logout : () => dispatch(userActionCreators.logoutRequest()),
    }
}

export default connect(null, mapDispatchToProps)(withRouter(Logout));