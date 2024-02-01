import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect, withRouter} from 'react-router-dom';

import {setPreserveUrl, setSubscriptionWarning} from 'actions/appActions';
import {appConstants, routeConstants} from 'const';

class PrivateRoute extends React.Component {
	render() {
		const {user, preservedUrl, subscriptionStatus, component: Component, ...rest} = this.props;
		const {pathname, search} = this.props.location;

		if (!user.isLoggedIn) {
			this.props.setPreserveUrl(`${pathname}${search}`);

			return <Redirect to={`${routeConstants.HOME}${search}`} />;
		}

		if (user.isLoggedIn && subscriptionStatus === appConstants.SUBSCRIBE_NEW) {
			this.props.setSubscriptionWarning(true);
			return <Redirect to={routeConstants.SUBSCRIPTION} />;
		}

		return <Route {...rest} render={(props) => user.isLoggedIn && <Component {...props} />} />;
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		preservedUrl: state.app.preservedUrl,
		subscriptionStatus: state.user.subscriptionStatus,
	};
}

export default withRouter(
	connect(mapStateToProps, {setPreserveUrl, setSubscriptionWarning})(PrivateRoute)
);
