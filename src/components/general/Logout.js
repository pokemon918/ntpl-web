import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {logoutUser} from 'actions/userActions';
import {routeConstants} from 'const';

class Logout extends Component {
	async componentWillMount() {
		await this.props.logoutUser();
		window.localStorage.clear();
		if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
			return;
		window.location.reload();
	}

	render() {
		return <Redirect to={routeConstants.SIGN_IN} />;
	}
}

export default connect(null, {logoutUser})(Logout);
