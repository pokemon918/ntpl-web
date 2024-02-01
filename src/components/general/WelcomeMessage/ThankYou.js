import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {closeWelcomeMessage} from 'actions/userActions';
import {appConstants, routeConstants} from 'const';
import SubscriptionWelcomeMessage from './SubscriptionWelcomeMessage';

class ThankYou extends PureComponent {
	componentDidMount() {
		this.listenToRouteChanges();
	}

	componentWillUnmount() {
		this.unlistenToRouteChanges();
	}

	listenToRouteChanges = () => {
		const {
			history,
			user: {isFirstLoggedIn},
		} = this.props;

		this.unlistenToRouteChanges = history.listen((location, action) => {
			if (isFirstLoggedIn) {
				this.props.closeWelcomeMessage();
			}
		});
	};

	render() {
		const {user} = this.props;
		const {activePlan, isFirstLoggedIn} = user;

		if (!activePlan || activePlan === appConstants.SUBSCRIBE || !isFirstLoggedIn) {
			return <Redirect to={`${routeConstants.HOME}${window.location.search}`} />;
		}

		return <SubscriptionWelcomeMessage />;
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(mapStateToProps, {closeWelcomeMessage})(ThankYou);
