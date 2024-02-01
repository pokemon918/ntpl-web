import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FormattedDate} from 'react-intl';

import {displayErrorMessage} from 'actions/appActions';
import {delayedCancelSubscription} from 'actions/userActions';
import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';
import DialogBox from 'components/shared/ui/DialogBox';
import Spinner from 'components/shared/ui/Spinner';
import {routeConstants} from 'const';
import Grid from 'components/shared/ui/Grid';
import {refreshSubscription, fetchUserInfo} from 'actions/userActions';

import {ReactComponent as IconBin} from '../icon_bin.svg';
import './SubscriptionPayment.scss';

const cancelModalTitle = {
	asking: <L18nText id="subscription_cancel_confirmation_title" />,
	pending: <L18nText id="subscription_cancel_pending_title" />,
	success: <L18nText id="subscription_cancel_success_title" />,
};

const cancelModalContent = {
	asking: () => <L18nText id="subscription_cancel_confirmation_message" />,
	pending: () => <Spinner position="initial" />,
	success: ({end_date}) => (
		<L18nText
			id="subscription_cancel_success_message"
			values={{
				end_date: <FormattedDate value={end_date} year="numeric" month="long" day="numeric" />,
			}}
		/>
	),
};

const SubscriptionPayment = ({
	activePlan,
	paymentMode,
	fetchUserInfo,
	billingPortalLink,
	subscriptionStatus,
	refreshSubscription,
	subscriptionEndDate,
	...props
}) => {
	const [cancellationStatus, setCancellationStatus] = React.useState(null);
	const [cancellationData, setCancellationData] = React.useState(null);

	const openCancelModal = () => setCancellationStatus('asking');
	const closeCancelModal = () => setCancellationStatus(null);

	const handleCancelSubscription = async () => {
		try {
			setCancellationStatus('pending');
			const {data} = await props.delayedCancelSubscription();
			setCancellationData(data);
			setCancellationStatus('success');
		} catch (err) {
			closeCancelModal();
		}
	};

	const onReload = async () => {
		try {
			await refreshSubscription();
			await fetchUserInfo();
		} catch (err) {
			await fetchUserInfo();
		}
	};

	const renderCancelModalFn = cancelModalContent[cancellationStatus];

	return (
		<div className="SubscriptionPayment__Container">
			<div className="SubscriptionPayment_Title">
				<div className="title">
					<L18nText id="settings_subscription_payment" defaultMessage="Subscription & Payment" />
				</div>
			</div>
			<div className="ProfilePage__Item">
				<div className="SubscriptionPayment_Wrapper">
					<span className="label">
						<L18nText id="settings_your_subscription" defaultMessage="Your subscription" />
					</span>
					<div className="SubscriptionPayment_Info_Wrapper">
						{activePlan === 'subscribe' && (
							<>
								<div className="SubscriptionPayment__StatusText center">
									<L18nText id="subscription_not_subscribed" />
								</div>
								<div className="SubscriptionPayment__ActionButtons">
									<div className="ButtonContainer">
										<Button linkTo={routeConstants.SUBSCRIPTION}>
											<L18nText id="subscription_subscribe_now" />
										</Button>
									</div>
								</div>
							</>
						)}
						{activePlan !== 'subscribe' && (
							<>
								<div className="XSubscriptionPayment__StatusText">
									<p>
										<L18nText
											id="subscription_current_plan"
											values={{
												plan: (
													<b>
														<L18nText id={`subscription_plan_${activePlan}`} />
													</b>
												),
											}}
										/>
									</p>
									<p>
										{subscriptionStatus === 'cancelled' && (
											<L18nText
												id="subscription_delayed_cancellation"
												values={{
													end_date: (
														<FormattedDate
															value={subscriptionEndDate}
															year="numeric"
															month="long"
															day="numeric"
														/>
													),
												}}
											/>
										)}{' '}
										{billingPortalLink && <L18nText id="subscription_change_your_plan" />}
									</p>
								</div>
								<div className="SubscriptionPayment__ActionButtons">
									<div className="ButtonContainer">
										<Button
											linkTo={
												billingPortalLink
													? billingPortalLink
													: `${routeConstants.SUBSCRIPTION}?profile`
											}
											redirectToOtherDomain={billingPortalLink ? true : false}
											linkTarget={billingPortalLink ? '_blank' : null}
										>
											<L18nText id={'subcription_different_plan'} />
										</Button>
									</div>
									{activePlan !== 'view' && subscriptionStatus !== 'cancelled' && (
										<div className="ButtonContainer">
											{billingPortalLink && (
												<Button variant="transparent" skinny onHandleClick={openCancelModal}>
													<IconBin />
													<L18nText id="subscription_cancel_button" />
												</Button>
											)}
											{cancellationStatus !== null && (
												<DialogBox
													title={cancelModalTitle[cancellationStatus]}
													description={
														typeof renderCancelModalFn === 'function'
															? renderCancelModalFn(cancellationData)
															: null
													}
													onClose={closeCancelModal}
													noCallback={closeCancelModal}
													yesCallback={handleCancelSubscription}
													errorBox={cancellationStatus === 'success'}
													disableButtons={cancellationStatus === 'pending'}
													reverseButtons
													outlinedYesButton
												/>
											)}
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>

				<Grid columns={8} customizedColumns>
					<span className="label">
						<L18nText id="settings_reload" defaultMessage="Reload" />
					</span>
					<div className="SubscriptionPayment_Info_Wrapper">
						<L18nText id="setting_change_your_subscriiption" />{' '}
						<span className="link" onClick={onReload}>
							<b>
								<L18nText id="setting_click_here" defaultMessage="click here" />
							</b>
						</span>{' '}
						<L18nText id="setting_reload_page" />
					</div>
				</Grid>
			</div>
		</div>
	);
};

SubscriptionPayment.propTypes = {
	activePlan: PropTypes.string,
	billingPortalLink: PropTypes.string,
	subscriptionStatus: PropTypes.string,
	subscriptionEndDate: PropTypes.string,
};

const mapStateToProps = (state) => ({
	activePlan: state.user.activePlan,
	paymentMode: state.app.subscription && state.app.subscription.paymentMode,
	billingPortalLink: state.user.userData.billing_portal_link,
	subscriptionStatus: state.user.subscriptionStatus,
	subscriptionEndDate: state.user.subscriptionEndDate,
});

export default connect(mapStateToProps, {
	delayedCancelSubscription,
	displayErrorMessage,
	refreshSubscription,
	fetchUserInfo,
})(SubscriptionPayment);
