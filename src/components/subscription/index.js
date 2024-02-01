import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Breadcrumb from 'components/shared/ui/Breadcrumb';
import Grid from 'components/shared/ui/Grid';
import SubscriptionTab from './SubscriptionTab';
import SubscriptionItem from './SubscriptionItem';
import L18nText from 'components/shared/L18nText';
import SubscriptionHeader from './SubscriptionHeader';
import {setSubscriptionUrl, setSubscriptionType, setSkipSelectPlan} from 'actions/appActions';
import SubscriptionItemMobile from './SubscriptionItemMobile';
import SubscriptionHeaderMobile from './SubscriptionHeaderMobile';
import SubscriptionSelect from './SubscriptionSelect';
import SubscriptionSelectMobile from './SubscriptionSelectMobile';
import {getHandleForPlanId, subscriptionTab, subscriptionService} from './subscriptionData';
import DialogBox from 'components/shared/ui/DialogBox';
import {setSubscriptionWarning} from 'actions/appActions';

import './Subscription.scss';
import {routeConstants} from 'const';

const HIGHLIGHT_PLAN = 'scholar';

class Subscription extends React.Component {
	state = {
		isPricingPage: false,
	};

	componentDidMount() {
		if (window.location.pathname === routeConstants.PRICE_COMPARE) {
			this.setState({isPricingPage: true});
		}

		window.scrollTo(0, 0);
		this.shouldDisplayProfileLink();
	}

	shouldDisplayProfileLink = () => {
		const {location: {search = ''} = {}} = this.props;
		return search.includes('profile');
	};

	onSelectSubscription = (plan) => {
		this.props.setSubscriptionType(plan);

		const selectedPlan = getHandleForPlanId(plan);
		if (this.props.onNext) {
			this.props.onNext({selectedPlan});
			return;
		}

		const {isAuthenticated, useTopLevelLocation} = this.props;
		const destinationUrl = isAuthenticated ? routeConstants.BILLING : routeConstants.SIGN_UP;

		if (!isAuthenticated) {
			this.props.setSkipSelectPlan(true);
		}

		if (useTopLevelLocation) {
			const extraArgs = isAuthenticated ? '?plan_selected' : '';
			window.top.location.replace(destinationUrl + extraArgs);
		} else {
			this.props.history.push(destinationUrl);
		}
	};

	render() {
		const {showSubscriptionWarning} = this.props;
		const {isPricingPage} = this.state;

		return (
			<div>
				{showSubscriptionWarning && (
					<DialogBox
						title={'Hmmm...'}
						errorBox={true}
						errorButtonText="subscription_complete_signup"
						description={'subscription_no_access'}
						noCallback={() => this.props.setSubscriptionWarning(false)}
						yesCallback={() => this.props.setSubscriptionWarning(false)}
					/>
				)}
				{this.shouldDisplayProfileLink() && (
					<Breadcrumb path="subscription_back_to_profile" link={routeConstants.PROFILE} />
				)}
				<Grid columns={8}>
					<div>
						{!isPricingPage && (
							<Grid columns={6}>
								<div className="Subscription__Header">
									<div className="Subscription__Header__Title">
										<L18nText id="subscription_name" defaultMessage="Subscription" />
									</div>
									<div className="Subscription__Header__SubTitle">
										<L18nText
											id="subscription_description"
											defaultMessage="
								We've got a plan for every taster out there. Choose the one that suits you best!"
										/>
									</div>
								</div>
							</Grid>
						)}
						<div className="Subscription__Wrapper">
							<div className="SubscriptionItem__Wrapper SubscriptionItem__Header">
								<div className="SubscriptionItem__Title" />
								{subscriptionTab.map((subscription) => (
									<SubscriptionTab
										title={subscription.name}
										highlightPlan={HIGHLIGHT_PLAN === subscription.id}
									/>
								))}
							</div>
							<div className="desktop-only">
								<SubscriptionHeader
									highlightPlan={HIGHLIGHT_PLAN}
									data={subscriptionTab}
									title="subscription_monthly_price"
								/>
								{subscriptionService.map((subscription, index) => (
									<SubscriptionItem
										key={subscription.index}
										highlightPlan={HIGHLIGHT_PLAN}
										title={subscription.title}
										basic={subscription.basic}
										pro={subscription.pro}
										scholar={subscription.scholar}
										subTitle={subscription.subHeader}
									/>
								))}
								<SubscriptionSelect
									highlightPlan={HIGHLIGHT_PLAN}
									onSelectPlan={this.onSelectSubscription}
								/>
							</div>
							<div className="mobile-only">
								<SubscriptionHeaderMobile
									highlightPlan={HIGHLIGHT_PLAN}
									data={subscriptionTab}
									title="Monthly price"
								/>
								{subscriptionService.map((subscription, index) => (
									<SubscriptionItemMobile
										key={subscription.index}
										basic={subscription.basic}
										pro={subscription.pro}
										scholar={subscription.scholar}
										highlightPlan={HIGHLIGHT_PLAN}
										title={subscription.title}
										subTitle={subscription.subHeader}
									/>
								))}
								<SubscriptionSelectMobile
									highlightPlan={HIGHLIGHT_PLAN}
									onSelectPlan={this.onSelectSubscription}
								/>
							</div>
						</div>
						{!isPricingPage && (
							<Grid columns={4}>
								<div className="Subscription__Coupon center">
									<div className="Subscription__Coupon__Header center">
										<L18nText id="subscription_discount" defaultMessage="Get a discount" />
									</div>
									<Grid columns={12}>
										<div className="Subscription__Coupon__Details center">
											<div className="Subscription__Coupon__Title">
												<L18nText id="subscription_6months" defaultMessage="Pay every 6 months" />
											</div>
											<div className="Subscription__Coupon__Save">
												<L18nText id="subscription_save" defaultMessage="Save" />{' '}
												<span className="Subscription__Coupon__Rate">5</span>{' '}
												<span className="Subscription__Coupon__Symbol">%</span>
											</div>
										</div>
										<div className="center">
											<div className="Subscription__Coupon__Title">
												<L18nText id="subscription_12months" defaultMessage="Pay every 12 months" />
											</div>
											<div className="Subscription__Coupon__Save">
												<L18nText id="subscription_save" defaultMessage="Save" />{' '}
												<span className="Subscription__Coupon__Rate">10</span>{' '}
												<span className="Subscription__Coupon__Symbol">%</span>
											</div>
										</div>
									</Grid>
									<div className="Subscription__Coupon__Footer">
										<L18nText
											id="subscription_available_discount"
											defaultMessage="Discount available on all the plans during checkout"
										/>
									</div>
								</div>
							</Grid>
						)}
					</div>
				</Grid>
			</div>
		);
	}
}

Subscription.propTypes = {
	useTopLevelLocation: PropTypes.bool,
};

function mapStateToProps(state) {
	return {
		isAuthenticated: state.user.isLoggedIn,
		showSubscriptionWarning: state.app.showSubscriptionWarning,
		subscriptionType: state.app.subscription ? state.app.subscription.type : null,
	};
}

export default connect(mapStateToProps, {
	setSubscriptionUrl,
	setSubscriptionWarning,
	setSubscriptionType,
	setSkipSelectPlan,
})(Subscription);
