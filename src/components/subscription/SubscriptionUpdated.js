import React from 'react';
import {connect} from 'react-redux';

import {setSkipSelectPlan} from 'actions/appActions';
import {refreshSubscription} from 'actions/userActions';
import ContactEmailLink from 'components/shared/ui/ContactEmailLink';
import FullPageStatus from 'components/shared/ui/FullPageStatus';
import L18nText from 'components/shared/L18nText';
import bugsnagClient from 'config/bugsnag';
import {routeConstants} from 'const';
import Spinner from 'components/shared/ui/Spinner';

const title = {
	pending: 'subscription_almost_ready',
	error: 'app_oops',
};

const statusMessage = {
	pending: <L18nText id="subscription_please_hold" />,
	error: (
		<>
			<p>
				<L18nText id="subscription_refresh_error" />
			</p>
			<p>
				<L18nText id="subscription_please_contact" values={{email: <ContactEmailLink />}} />
			</p>
		</>
	),
};

const SubscriptionUpdated = ({isAuthenticated, history, ...props}) => {
	const [currentStatus, setCurrentStatus] = React.useState('pending');

	React.useEffect(() => {
		const tryRefreshSubscription = async () => {
			if (!isAuthenticated) {
				history.replace(routeConstants.SIGN_IN);
				return;
			}

			try {
				const {data} = await props.refreshSubscription();
				if (data.active_plan === 'subscribe') {
					bugsnagClient.notify(
						new Error('Refreshing the subscription failed, the active_plan is still subscribe!'),
						{data}
					);
					setCurrentStatus('error');
					return;
				}
				props.setSkipSelectPlan(false);
				history.replace(routeConstants.WELCOME_THANK_YOU);
			} catch (error) {
				bugsnagClient.notify(new Error('Attempt to refresh subscription failed!'), {error});
				setCurrentStatus('error');
			}
		};
		tryRefreshSubscription();
	}, [isAuthenticated, history, props]);

	return (
		<FullPageStatus animate={currentStatus !== 'pending'} title={title[currentStatus]}>
			<div>{statusMessage[currentStatus]}</div>
			{currentStatus === 'pending' ? <Spinner position="initial" light transparent /> : null}
		</FullPageStatus>
	);
};

function mapStateToProps(state) {
	return {
		isAuthenticated: state.user.isLoggedIn,
	};
}

export default connect(mapStateToProps, {refreshSubscription, setSkipSelectPlan})(
	SubscriptionUpdated
);
