import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {getActivePlan, getUserCounts} from 'actions/userActions';
import {setPreserveUrl} from 'actions/appActions';
import Spinner from 'components/shared/ui/Spinner';
import {routeConstants, appConstants} from 'const';
import {onRedirectToEvent} from 'commons/shared';

import './Landing.scss';

const Landing = (props) => {
	const [homePageRoute, setHomePageRoute] = React.useState(null);

	React.useEffect(() => {
		const getHomePageRoute = async () => {
			const homePageRoute = await determineHomePage(props);
			setHomePageRoute(homePageRoute);
		};

		getHomePageRoute();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // dependencies must be empty, this should run only once on mount

	return !homePageRoute ? <LoadingIndicator /> : <Redirect to={homePageRoute} />;
};

function LoadingIndicator() {
	return (
		<div className="Landing__Container">
			<Spinner />
		</div>
	);
}

async function determineHomePage({user, ...props}) {
	const eventRoute = onRedirectToEvent();
	const activePlan = await props.getActivePlan();

	if (props.preservedUrl && user.isLoggedIn) {
		props.setPreserveUrl('');
		return props.preservedUrl;
	}

	if (!user.isLoggedIn) {
		return routeConstants.SIGN_IN + window.location.search;
	}

	if (!activePlan) {
		return routeConstants.SUBSCRIPTION + window.location.search;
	}

	if (activePlan === appConstants.SUBSCRIBE) {
		return routeConstants.SUBSCRIPTION + window.location.search;
	}

	if (user.isFirstLoggedIn) {
		return routeConstants.WELCOME_THANK_YOU;
	}

	const counts = await props.getUserCounts();
	if (counts) {
		const {impressions, featured_events} = counts;

		const hasNoTastings = impressions === 0;
		const hasSomeEvents = featured_events > 0;

		if (hasNoTastings && hasSomeEvents) {
			return eventRoute;
		}

		const hasAnyTasting = impressions > 0;
		const url = new URL(window.location.href);
		const product = url.searchParams.get('product');
		const event = url.searchParams.get('event');
		if (product !== null && event !== null) {
			return `${routeConstants.NEW_PRODUCT_TASTING}${window.location.search}`;
		} else if (hasAnyTasting) {
			return routeConstants.MY_TASTINGS;
		}
	}

	return routeConstants.NEW_TASTING;
}

function mapStateToProps(state) {
	return {
		user: state.user,
		preservedUrl: state.app.preservedUrl,
	};
}

export default connect(mapStateToProps, {getActivePlan, getUserCounts, setPreserveUrl})(Landing);
