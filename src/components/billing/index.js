import React from 'react';
import {connect} from 'react-redux';
import dateFns, {addDays} from 'date-fns';
import Grid from '../shared/ui/Grid';

import './Billing.scss';
import Terms from 'components/auth/sign-up/Terms';

import bugsnagClient from 'config/bugsnag';
import Modal from 'components/shared/ui/Modal';
import Checkbox from 'components/shared/ui/Checkbox';
import L18nText from 'components/shared/L18nText';
import Radio from 'components/shared/ui/Radio';
import Button from 'components/shared/ui/Button';
import DialogBox from 'components/shared/ui/DialogBox';

import {getSubscriptionPlans} from 'actions/userActions';
import {setSubscriptionDuration, setSubscriptionType} from 'actions/appActions';
import {routeConstants} from 'const';
import {subscriptionTab} from 'components/subscription/subscriptionData';
import ContactEmailLink from 'components/shared/ui/ContactEmailLink';

import Dropover from 'components/shared/ui/Dropover';
import TextInput from 'components/shared/ui/TextInput';

const price = {
	scholar: {
		one: '6',
		six: '5.7',
		tweleve: '5.4',
	},
	pro: {
		one: '4',
		six: '3.8',
		tweleve: '3.6',
	},
	basic: {
		one: '0',
		six: '0',
		tweleve: '0',
	},
};

const getSubscriptionDetail = (type, duration) => {
	return `${type}${duration}m`;
};

class Billing extends React.Component {
	state = {
		showError: false,
		isTermAccepted: false,
		openTermModal: false,
		subscriptionDuration: '1',
		showSubscriptionModal: false,
		url: '',
	};

	onHideSubscriptionModal = () => {
		this.setState({showSubscriptionModal: false});
	};

	onShowSubscriptionModal = (subject) => {
		this.setState({showSubscriptionModal: true});
	};

	async componentDidMount() {
		if (!this.props.isAuthenticated)
			this.props.history.replace(`${routeConstants.SIGN_UP}${window.location.search}`);
		const {getSubscriptionPlans} = this.props;

		await getSubscriptionPlans();
		this.patchHistoryIfSkippedSelectPlan();
	}

	patchHistoryIfSkippedSelectPlan = () => {
		const {
			location: {search},
		} = this.props;

		// replace in the history the route of the landing page for the in-app pricing table
		// to deliver a more seamless navigation experience
		if (search.includes('plan_selected')) {
			window.history.replaceState(null, null, routeConstants.SUBSCRIPTION);
			window.history.pushState(null, null, routeConstants.BILLING);
		}
	};

	handleChangeOption = (value) => {
		this.props.setSubscriptionDuration(value);

		this.setState({subscriptionDuration: value});
	};

	onChangeTerm = () => {
		this.setState((prevState) => ({isTermAccepted: !prevState.isTermAccepted}));
	};

	onToggleModal = (e) => {
		this.setState({openTermModal: !this.state.openTermModal, isTermAccepted: false});
	};

	onBack = () => {
		const {onBack} = this.props;

		if (onBack) {
			onBack();
			return;
		}

		window.history.back(-1);
	};

	onBilling = async () => {
		const {userData = {}, subscriptionType, subscriptionUrl} = this.props;
		const {subscriptionDuration} = this.state;
		const subscriptionDetail = getSubscriptionDetail(
			(subscriptionType && subscriptionType.id) || 'basic',
			subscriptionDuration
		);
		let voucher = '';

		const email = userData.email || '';
		const ref = userData.ref;

		if (ref) {
			const chargifyUrl =
				subscriptionUrl &&
				subscriptionUrl[subscriptionDetail] &&
				subscriptionUrl[subscriptionDetail].url;

			if (chargifyUrl && userData.name) {
				const [firstName, ...otherNames] = userData.name.split(' ').filter(Boolean);
				const lastName = otherNames.join(' ');
				const url = `${chargifyUrl}?first_name=${encodeURIComponent(
					firstName
				)}&last_name=${encodeURIComponent(lastName)}&email=${encodeURIComponent(
					email
				)}&reference=${encodeURIComponent(ref)}&coupon_code=${encodeURIComponent(voucher)}`;

				window.location.href = 'https://forward.noteable.co?goto=' + encodeURIComponent(url);
				return;
			}

			bugsnagClient.notify(
				new Error('Failed to fetch subscription plans.'),
				'Failed to fetch subscription plans.'
			);
			this.setState({showError: true});
		}
	};

	onChangeSubscription = (value) => {
		this.onHideSubscriptionModal();
		this.props.setSubscriptionType(value);
	};

	closeErrorBox = () => {
		this.setState({showError: false});
	};

	render() {
		const {
			subscriptionDuration,
			isTermAccepted,
			openTermModal,
			showError,
			showSubscriptionModal,
		} = this.state;
		const {subscriptionType} = this.props;
		const nextDate = dateFns.format(addDays(new Date(), 30), 'Do MMMM YYYY');

		if (openTermModal) {
			return (
				<Modal
					onClose={this.onToggleModal}
					title="Terms and conditions"
					body={
						<Grid columns={6}>
							<div className="SignUp__Modal">
								<div>
									<Terms />
								</div>
							</div>
						</Grid>
					}
					footer={
						<div className="pd-10">
							<Button variant="outlined" onHandleClick={this.onToggleModal}>
								<L18nText id="app_close" defaultMessage="Close" />
							</Button>
						</div>
					}
				/>
			);
		}

		return (
			<Grid columns={6}>
				<div className="Billing__Wrapper">
					<div className="Billing__Title">
						<L18nText id="subscription_billing" defaultMessage="Billing" />
					</div>
					{showError && (
						<DialogBox
							title={'error_title'}
							errorBox={true}
							description={
								<>
									<p className="Billing__Error">
										<L18nText id="error_technical_glitch" />
									</p>
									<p className="Billing__Error">
										<L18nText
											id="subscription_please_contact"
											values={{email: <ContactEmailLink />}}
										/>
									</p>
								</>
							}
							noCallback={this.closeErrorBox}
							yesCallback={this.closeErrorBox}
						/>
					)}

					<div className="Billing__Description">
						<div className="Billing__Info">
							<div className="Billing__Day">
								<L18nText id="subscription_30" defaultMessage="30" />
							</div>
							<div className="Billing__Days">
								<L18nText id="subscription_days" defaultMessage="DAYS" />
							</div>
							<div className="Billing__Free">
								<L18nText id="subscription_free" defaultMessage="FREE" />
							</div>
						</div>
						<div className="Billing__Payment__Details">
							<L18nText
								id="subscription_payment_detail"
								defaultMessage="We need your payment details now, but don't worry."
							/>{' '}
							<span className="Billing__Payment__Cancel">
								<L18nText id="subscription_cancel" defaultMessage="You can cancel anytime before" />{' '}
								{nextDate}.
							</span>
						</div>
					</div>
					<div className="Billing__Subscription__Wrapper">
						<div className="Billing__Subscription">
							<div className="Billing__Subscription__Info">
								<div className="Billing__Subscription__Header_Wrapper">
									<div className="Billing__Subscription__Header">
										<L18nText id={subscriptionType.name} defaultMessage={subscriptionType.name} />{' '}
										<L18nText id={'subscription'} defaultMessage="subscription" />
									</div>

									<div className="Billing__Subscription__Plan">
										{showSubscriptionModal && (
											<Dropover
												title={'subscriptionType.name'}
												onClose={this.onHideSubscriptionModal}
												options={subscriptionTab}
												onSelect={this.onChangeSubscription}
											/>
										)}
										<TextInput
											type="text"
											onFocus={() => this.onShowSubscriptionModal()}
											value={subscriptionType}
											infoKey={'title'}
											isDropover
											readOnly
										/>
									</div>
								</div>
								<div className="Billing__Subscription__SubHeader">
									<L18nText
										id="subscription_pay_duration"
										defaultMessage="I want to pay every..."
									/>
								</div>
								<div className="Billing__Subscription__Type">
									abc123
									<Grid columns={8}>
										<Radio
											id={'1'}
											isChecked={subscriptionDuration === '1'}
											label={'subscription_monthly'}
											name={'subscriptionDuration'}
											type={
												subscriptionType &&
												price[subscriptionType.id] &&
												price[subscriptionType.id]['one']
											}
											onChange={() => this.handleChangeOption('1')}
										/>
									</Grid>
									<Grid columns={8}>
										<Radio
											onChange={() => this.handleChangeOption('6')}
											id={'6'}
											isChecked={subscriptionDuration === '6'}
											label="subscription_bi_annual"
											name={'subscriptionDuration'}
										/>
									</Grid>
									<Grid columns={8}>
										<Radio
											onChange={() => this.handleChangeOption('12')}
											id={'12'}
											isChecked={subscriptionDuration === '12'}
											label="subscription_annual"
											name={'subscriptionDuration'}
										/>
									</Grid>
								</div>
							</div>
						</div>
						<div className="SignUp__Item SignUp__Checkbox">
							<Checkbox
								label={
									<span>
										<L18nText
											id="signUp_term"
											defaultMessage="									
									By submitting this order you agree to the general"
										/>{' '}
										<span onClick={this.onToggleModal} className="Signup__Terms__Link">
											<L18nText id={'signUp_term_link'} defaultMessage="terms & conditions." />
										</span>
									</span>
								}
								isChekced={this.state.isTermAccepted}
								disabled={this.props.isSaving}
								onChange={this.onChangeTerm}
								infoKey="confirmReg"
							/>
						</div>
					</div>
					<div className="Billing__Buttons">
						<span className="Billing__Back">
							<Button variant="outlined" onHandleClick={this.onBack}>
								<L18nText id="tasting_nav_back" defaultMessage="Back" />
							</Button>
						</span>
						<span className="Billing__Continue">
							<Button variant="default" onHandleClick={this.onBilling} disabled={!isTermAccepted}>
								<L18nText id="tasting_nav_continue" defaultMessage="Continue" />
							</Button>
						</span>
					</div>
				</div>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		userData: state.user.userData,
		isAuthenticated: state.user.isLoggedIn,
		subscriptionUrl: state.user.subscriptionUrl,
		subscriptionType: state.app.subscription ? state.app.subscription.type : null,
	};
}

export default connect(mapStateToProps, {
	setSubscriptionDuration,
	setSubscriptionType,
	getSubscriptionPlans,
})(Billing);
