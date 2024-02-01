import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

import {isEmailValid} from 'commons/commons';
import Terms from './Terms';
import Grid from 'components/shared/ui/Grid';
import Modal from 'components/shared/ui/Modal';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import Spinner from 'components/shared/ui/Spinner';
import Checkbox from 'components/shared/ui/Checkbox';
import TextInput from 'components/shared/ui/TextInput';
import SubscriptionPage from 'components/subscription';
import BillingPage from 'components/billing';
import DialogBox from 'components/shared/ui/DialogBox';
import wineKnowledgeList from 'assets/json/wine_knowledge.json';
import {setSubscriptionDuration, setSubscriptionType} from 'actions/appActions';
import appConfig from 'config/app';
import {userConstants, routeConstants} from 'const';
import Tooltip from 'components/shared/ui/Tooltip';

import {replaceEmail} from 'commons/commons';
import DropoverInput from 'components/shared/ui/DropoverInput';
import {registerUser, loginUser, clearData, closeWelcomeMessage} from 'actions/userActions';
import {setVoucher, setCurrentState} from 'actions/appActions';
import './SignUp.scss';

class SignUp extends React.Component {
	state = {
		name: '',
		error: false,
		email: '',
		company: '',
		ref: '',
		title: '',
		password: '',
		voucher: '',
		isLoading: '',
		showPasswordError: false,
		showTitleModal: false,
		confirmPassword: '',
		showWarning: false,
		demoMode: false,
		showInvalidNameError: false,
		selectedPlan: '',
		isTermAccepted: false,
		openTermModal: false,
		showInvalidEmailError: false,
		currentState: userConstants.SIGN_UP_PAGE,
	};

	async componentDidMount() {
		const {isAuthenticated} = this.props;
		const url = new URL(window.location.href);
		const email = url.searchParams.get('email');

		if (email) {
			this.setState({email});
		}

		if (isAuthenticated) {
			this.props.history.replace(`${routeConstants.HOME}${window.location.search}`);
		}

		if (window.location.hostname.startsWith('demo')) {
			this.setState({demoMode: true});
		}
	}

	onNext = async (currentState, back) => {
		if (currentState === userConstants.SUBSCRIPTION_PAGE && !back) {
			return this.onSubmitSubscriptionPage();
		}

		this.setState({currentState});
	};

	updateSelectedPlan = (selectedPlan) => this.setState({selectedPlan});

	getIsValidPassword = () => {
		const {password, confirmPassword} = this.state;
		const isValidPassword = this.passwordMatcher(password, confirmPassword);

		return isValidPassword;
	};

	getIsValidForm = () => {
		const {isTermAccepted} = this.state;

		return !!(this.isAllFieldValid() && isTermAccepted);
	};

	isAllFieldValid = () => {
		const {
			isLoading,
			email,
			password,
			title,
			confirmPassword,
			name,
			demoMode,
			voucher,
			showInvalidNameError,
			showInvalidEmailError,
		} = this.state;
		const isValidPassword = this.getIsValidPassword();
		const isRequiredVocher = demoMode ? voucher : true;
		const isVoucherValid = appConfig.VOUCHER_REQUIRED_TO_SIGNUP === false || voucher.length > 0;
		const trimName = name.trim();
		const isValidForm =
			name &&
			!showInvalidNameError &&
			!showInvalidEmailError &&
			isRequiredVocher &&
			email &&
			trimName &&
			title &&
			password &&
			confirmPassword &&
			isValidPassword &&
			isVoucherValid &&
			!isLoading;

		return !!isValidForm;
	};

	submitIfValid = () => {
		if (this.getIsValidForm()) {
			this.onSubmitSubscriptionPage();
		}
	};

	onClose = async () => {
		const {email, password} = this.state;

		this.setState({showWarning: false});

		await this.props.loginUser(email, password);

		this.props.history.replace(`${routeConstants.HOME}${window.location.search}`);
	};

	onToggleModal = (e) => {
		this.setState({openTermModal: !this.state.openTermModal, isTermAccepted: false});
	};

	onChangeTerm = () => {
		this.setState({isTermAccepted: !this.state.isTermAccepted});
	};

	onHandleChange = (value, key) => {
		this.setState({[key]: value});
		if (key === 'name') {
			if (value.length > 30) {
				return this.setState({showInvalidNameError: true});
			}

			return this.setState({showInvalidNameError: false});
		}

		if (key === 'title') {
			this.setState({[key]: value});

			this.onHideTitle();
		}

		if (key === 'voucher') {
			this.props.setVoucher(!!value);
		}

		if (key === 'password') {
			const isValid = this.passwordMatcher(value, this.state.confirmPassword);
			this.setState({showPasswordError: !isValid});
		}

		if (key === 'email') {
			const email = replaceEmail(value);
			this.setState({[key]: email});
		}
	};

	componentWillUnmount() {
		// should preserve the selected plan in memory if it's skipping the select plan page
		if (!this.props.subscription.skipSelectPlan) {
			this.props.setSubscriptionType({id: 'scholar', name: 'Scholar'});
		}
		this.props.setSubscriptionDuration('1');
	}

	onSubmitSubscriptionPage = async () => {
		const {subscription, closeWelcomeMessage} = this.props;
		const {name, email, password, title, voucher} = this.state;
		if (!this.validateEmail(this.state.email)) {
			return this.setState({showInvalidEmailError: true});
		}

		this.setState({isLoading: true});
		const url = new URL(window.location.href);
		const voucherFromQuery = url.searchParams.get('voucher');
		const product = url.searchParams.get('product');
		const event = url.searchParams.get('event');
		try {
			const {data} = await this.props.registerUser(password, {
				email,
				name,
				wine_knowledge: title.id,
				voucher: voucherFromQuery ?? voucher,
			});
			if (voucherFromQuery != null && product != null && event != null) {
				closeWelcomeMessage();
			}
			if (data.subscription && data.subscription.active_plan === 'subscribe') {
				const route = subscription.skipSelectPlan
					? routeConstants.BILLING
					: routeConstants.SUBSCRIPTION;
				this.props.history.push(`${route}${window.location.search}`);
				await this.props.loginUser(email, password);
			} else {
				this.onLogin();
			}
			this.setState({isLoading: false});
		} catch (err) {
			this.setState({isLoading: false});
			this.props.clearData();
		}
	};

	onLogin = async () => {
		const {email, password} = this.state;
		this.setState({isLoading: true, showWarning: true});

		try {
			if (!this.state.demoMode) {
				await this.props.loginUser(email, password);
				this.props.history.replace(`${routeConstants.HOME}${window.location.search}`);
			}
		} catch (err) {
			this.setState({isLoading: false});
			this.setState({error: err.message || true});
		}
	};

	passwordMatcher = (password, confirmPassword) => {
		if (!password || !confirmPassword) {
			return true;
		}

		if (password && confirmPassword && password === confirmPassword) {
			return true;
		}

		return false;
	};

	close = () => {
		this.setState({error: false});
	};

	validateEmail = (mail) => {
		if (!mail) {
			return this.setState({showInvalidEmailError: false});
		}

		if (isEmailValid(mail)) {
			this.setState({showInvalidEmailError: false});
			return true;
		}

		this.setState({showInvalidEmailError: true});
		return false;
	};

	closeInvalidEmailError = () => {
		this.setState({showInvalidEmailError: false});
	};

	onShowTitle = () => {
		this.setState({showTitleModal: true});
	};

	onHideTitle = () => {
		window.scrollTo(0, 0);
		this.setState({showTitleModal: false});
	};

	onBlurPassword = () => {
		const isValid = this.passwordMatcher(this.state.password, this.state.confirmPassword);
		this.setState({showPasswordError: !isValid});
	};

	render() {
		const {
			isLoading,
			email,
			name,
			password,
			confirmPassword,
			selectedPlan,
			error,
			ref,
			openTermModal,
			title,
			voucher,
			currentState,
			showWarning,
			showPasswordError,
			showInvalidNameError,
			showInvalidEmailError,
		} = this.state;
		const {isAuthenticated} = this.props;
		const titleOptons = wineKnowledgeList.wine_knowledge_list.map((knowledge) => {
			return {
				id: knowledge.title_key,
				name: knowledge.role,
				title_key: knowledge.title_key,
				role: knowledge.role,
			};
		});

		if (isAuthenticated) {
			return <Redirect to={`${routeConstants.MY_TASTINGS}${window.location.search}`} />;
		}

		const url = new URL(window.location.href);
		const voucherFromQuery = url.searchParams.get('voucher');
		const hideVoucherTextInput = voucherFromQuery != null;

		if (this.state.demoMode && showWarning) {
			return (
				<DialogBox
					title={'app_data_lost'}
					errorBox={true}
					errorButtonText={'app_ok'}
					onClose={this.onClose}
					description={
						'This page is intended for demonstrations only. This means that your user credentials and any tastings you made might get reset without further notice. Enjoy!'
					}
					noCallback={this.onClose}
				/>
			);
		}

		const isValid = this.getIsValidForm();

		return (
			<div>
				{currentState === userConstants.SUBSCRIPTION_PAGE && (
					<SubscriptionPage
						onNext={({selectedPlan}) => {
							this.onNext(userConstants.BILLING_PAGE);
							this.updateSelectedPlan(selectedPlan);
						}}
						onBack={() => this.onNext(userConstants.SIGN_UP_PAGE, true)}
					/>
				)}
				{currentState === userConstants.BILLING_PAGE && (
					<BillingPage
						info={{email, voucher, ref, selectedPlan}}
						onBack={() => this.onNext(userConstants.SUBSCRIPTION_PAGE, true)}
						onNext={() => this.onLogin()}
					/>
				)}

				{currentState === userConstants.SIGN_UP_PAGE && (
					<div>
						{openTermModal ? (
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
						) : (
							<Grid columns={4}>
								<div>
									<div className="title-header sign" data-test="registration-title">
										<L18nText id="signUp_header" defaultMessage="Create an account today" />
									</div>
									<hr />
									<div className="SignUp__Wrapper">
										{error && (
											<DialogBox
												title={'Hmmm...'}
												errorBox={true}
												description={error}
												noCallback={this.close}
												yesCallback={this.close}
											/>
										)}
										<Tooltip
											sticky
											show={showInvalidNameError}
											text="Fullname must not be this long."
										>
											<TextInput
												label={'app_full_name'}
												type="text"
												invalid={showInvalidNameError}
												value={name}
												disabled={isLoading}
												onChange={this.onHandleChange}
												onFocus={() => this.setState({showInvalidNameError: false})}
												infoKey={'name'}
											/>
										</Tooltip>
										<div className="Signup_Title_Input">
											<DropoverInput
												label="Title"
												hideTextLabel
												options={titleOptons}
												disabled={isLoading}
												value={title.name}
												onSelect={(e) => this.onHandleChange(e, 'title')}
											/>
										</div>
										<Tooltip show={showInvalidEmailError} text="Invalid email address." sticky>
											<TextInput
												label={'app_email'}
												type="email"
												value={email}
												onBlur={(e) => this.validateEmail(e.target.value)}
												disabled={isLoading}
												onChange={(e) => this.onHandleChange(e, 'email')}
												onFocus={() => this.setState({showInvalidEmailError: false})}
												infoKey={'email'}
											/>
										</Tooltip>
										<TextInput
											label={'app_password'}
											type="password"
											value={password}
											onBlur={this.onBlurPassword}
											disabled={isLoading}
											onChange={this.onHandleChange}
											infoKey={'password'}
										/>
										<Tooltip show={showPasswordError} text="Password didn't match">
											<TextInput
												label={'app_confirm_password'}
												type="password"
												value={confirmPassword}
												disabled={isLoading}
												onEnterKeyPress={this.submitIfValid}
												onChange={this.onHandleChange}
												onBlur={this.onBlurPassword}
												onFocus={() => this.setState({showPasswordError: false})}
												infoKey={'confirmPassword'}
											/>
										</Tooltip>
										{hideVoucherTextInput ? null : (
											<TextInput
												label={this.state.demoMode ? 'app_voucher' : 'app_voucher_optional'}
												type="text"
												value={voucher}
												disabled={isLoading}
												onChange={this.onHandleChange}
												infoKey={'voucher'}
											/>
										)}
										<div className="SignUp__Item">
											<Checkbox
												customClass={'glow'}
												label={
													<span>
														<L18nText
															id="signUp_term"
															defaultMessage="									
                    Yes, I'd like to sign up to Noteable and hereby accept"
														/>{' '}
														<span onClick={this.onToggleModal} className="Signup__Terms__Link">
															<L18nText
																id={'signUp_term_link'}
																defaultMessage="terms & conditions."
															/>
														</span>
													</span>
												}
												isValid={this.isAllFieldValid()}
												isChekced={this.state.isTermAccepted}
												disabled={isLoading}
												onChange={this.onChangeTerm}
												infoKey="confirmReg"
											/>
										</div>
										<div>
											<div className="SingUp__Button margin">
												{isLoading ? (
													<div className="pd-10 pos-relative">
														<Spinner />
													</div>
												) : (
													<Tooltip show={!isValid} text="app_fill_all_fields">
														<Button
															onHandleClick={() => this.onNext(userConstants.SUBSCRIPTION_PAGE)}
															disabled={!isValid}
															infoKey="reg-submit"
															id="reg-submit"
														>
															<L18nText
																id={isLoading ? 'auth_register_pending' : 'signUp_title'}
																defaultMessage="Sign Up"
															/>
														</Button>
													</Tooltip>
												)}
											</div>
										</div>
									</div>
									<hr />
									<div className="SignUp_Text">
										<L18nText
											id="signUp_already_account"
											defaultMessage="Already have an account?"
										/>{' '}
										<Link to={`${routeConstants.SIGN_IN}${window.location.search}`}>
											<L18nText id="signUp_signIn" defaultMessage="Sign in here" />
										</Link>
									</div>
								</div>
							</Grid>
						)}
					</div>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		subscription: state.app.subscription,
		activePlan: state.user.activePlan,
		isAuthenticated: state.user.isLoggedIn,
	};
}

export default connect(mapStateToProps, {
	registerUser,
	loginUser,
	setCurrentState,
	setVoucher,
	setSubscriptionDuration,
	setSubscriptionType,
	closeWelcomeMessage,
	clearData,
})(SignUp);
