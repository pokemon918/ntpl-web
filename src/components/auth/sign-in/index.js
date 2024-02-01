import React from 'react';
import {connect} from 'react-redux';
import {Link, withRouter, Redirect} from 'react-router-dom';

import {isEmailValid, isLocalhost} from 'commons/commons';
import Grid from 'components/shared/ui/Grid';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import Spinner from 'components/shared/ui/Spinner';
import TextInput from 'components/shared/ui/TextInput';
import DialogBox from 'components/shared/ui/DialogBox';
import {routeConstants} from 'const';
import Tooltip from 'components/shared/ui/Tooltip';
import {loginUser, clearData} from 'actions/userActions';
import {replaceEmail} from 'commons/commons';

import './SignIn.scss';

class SignIn extends React.Component {
	state = {
		errorMessage: '',
		email: '',
		invalidEmailError: '',
		password: '',
		showInvalidEmailError: false,
		invalidUser: false,
		isLoading: '',
	};

	async componentDidMount() {
		const {isAuthenticated} = this.props;

		const url = new URL(window.location.href);
		const email = url.searchParams.get('email');

		if (email) {
			this.setState({email});
		}

		if (isAuthenticated) {
			return this.props.history.replace(`${routeConstants.HOME}${window.location.search}`);
		}

		localStorage.clear();
	}

	getIsValid = () => {
		const {email, password, isLoading, showInvalidEmailError} = this.state;

		const isValid = !!(email && password && !isLoading && !showInvalidEmailError);

		return isValid;
	};

	clearPasswordIfInvalid = (err) => {
		if (!err || !err.response || !err.response.data || !err.response.data.error) return;
		if (err.response.data.error.code === 'invalid_credentials') {
			this.setState({password: ''});
		}
	};

	onHandleChange = (value, key) => {
		this.setState({[key]: value});

		if (key === 'email') {
			const email = replaceEmail(value);
			this.setState({[key]: email});
		}
	};

	onSubmit = async () => {
		const {email, password} = this.state;
		this.setState({isLoading: true});

		try {
			await this.props.loginUser(email, password, this.props.history);
		} catch (err) {
			const {status} = err;
			if (status === 400) {
				this.setState({invalidUser: err.message});
			}

			if (status === 401) {
				this.setState({invalidEmailError: err.message});
			}

			this.setState({isLoading: false});
			this.clearPasswordIfInvalid(err);
			this.props.clearData();
		}
	};

	submitIfValid = () => {
		if (!this.validateEmail(this.state.email)) {
			return this.setState({showInvalidEmailError: true});
		}

		if (this.getIsValid()) {
			this.onSubmit();
		}
	};

	close = () => {
		this.setState({error: false, invalidEmailError: false});
	};

	navigateToRegistration = () => {
		const {email} = this.state;
		var link;
		if (window.location.search.indexOf('?') !== -1) {
			link = `${routeConstants.SIGN_UP}${window.location.search}&email=${email}`;
		} else {
			const params = email != null && email.length > 0 ? `?email=${email}` : '';
			link = `${routeConstants.SIGN_UP}${params}`;
		}
		this.props.history.push(link);
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

	closeDialogBox = () => {
		this.setState({invalidUser: false});
	};

	render() {
		const {isAuthenticated} = this.props;
		const {
			email,
			password,
			isLoading,
			invalidEmailError,
			showInvalidEmailError,
			invalidUser,
		} = this.state;

		if (isAuthenticated) {
			return <Redirect to={`${routeConstants.HOME}${window.location.search}`} />;
		}

		return (
			<>
				<Grid columns={4}>
					{!this.props.isAuthenticated && (
						<div>
							<div className="title-header sign margin" data-test="authorization_title">
								<L18nText id="signIn_header" defaultMessage="Sign In" />
							</div>
							<div className="SignIn__Wrapper padding">
								{invalidEmailError && (
									<DialogBox
										title={'Hello stranger'}
										description={`The email ${email} is unknown. Would you like to do a sign-up?`}
										noCallback={this.close}
										yesCallback={this.navigateToRegistration}
									/>
								)}
								{invalidUser && (
									<DialogBox
										title={'Hmmm...'}
										errorBox={true}
										description={invalidUser}
										noCallback={this.closeDialogBox}
										yesCallback={this.closeDialogBox}
									/>
								)}
								<Tooltip show={showInvalidEmailError} text="Invalid email address." sticky>
									<TextInput
										label={'app_email'}
										type="email"
										value={email}
										onFocus={() => this.setState({showInvalidEmailError: false})}
										onBlur={(e) => this.validateEmail(e.target.value)}
										disabled={isLoading}
										onEnterKeyPress={this.submitIfValid}
										onChange={(e) => this.onHandleChange(e, 'email')}
										infoKey={'email'}
									/>
								</Tooltip>
								<TextInput
									label={'app_password'}
									type="password"
									value={password}
									disabled={isLoading}
									onEnterKeyPress={this.submitIfValid}
									onChange={this.onHandleChange}
									infoKey={'password'}
								/>
								<div className="SignIn__ForgetPassword">
									<Link to={`${routeConstants.RESET_PASSWORD}?email=${email}`}>
										<L18nText id="signIn_forgot_password" defaultMessage="Forgot your password?" />
									</Link>
								</div>
							</div>
							<div className="SignIn__Item">
								<div className="SingUp__Button">
									{isLoading ? (
										<div className="pd-10 pos-relative">
											<Spinner />
										</div>
									) : (
										<Button
											infoKey="login_submit"
											id="login_submit"
											onHandleClick={this.submitIfValid}
											disabled={!this.getIsValid()}
										>
											<L18nText
												id={isLoading ? 'auth_sign_in_pending' : 'signIn_title'}
												defaultMessage="Sign In"
											/>
										</Button>
									)}
								</div>
							</div>
							<hr />
							<div className="SignIn_SignUpPart">
								<div className="SignIn_Title">
									<L18nText
										id="signIn_already_account"
										defaultMessage="Don't have an account yet?"
									/>
								</div>
								<Button
									variant="outlined"
									infoKey="signup_submit"
									id="signup_submit"
									onHandleClick={this.navigateToRegistration}
								>
									<L18nText id="signIn_register" defaultMessage="Sign up here" />
								</Button>
							</div>
						</div>
					)}
				</Grid>

				{false &&
					isLocalhost() &&
					`
password:     1q1q
Supervisor:   merle.admin.h.50@hotmail.com
Team leader:  cara.leader.c.51@yahoo.com
Senior judge: nels.guide.d.99@hotmail.com
Judge:        tremaine.member.b.46@gmail.com
Search event: swa5687
								`
						.split('\n')
						.map((line) => (
							<tt>
								{line}
								<br />
							</tt>
						))}
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		isAuthenticated: state.user.isLoggedIn,
	};
}

export default connect(mapStateToProps, {loginUser, clearData})(withRouter(SignIn));
