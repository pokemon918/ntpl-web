import React from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string';

import Grid from 'components/shared/ui/Grid';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import {resetPassword} from 'actions/userActions';
import TextInput from 'components/shared/ui/TextInput';
import DialogBox from 'components/shared/ui/DialogBox';
import {isEmailValid} from 'commons/commons';

import './Reset.scss';
import {routeConstants} from 'const';

class SignIn extends React.Component {
	state = {
		email: '',
		token: '',
		isLoading: '',
		hasToken: false,
		success: false,
		showInvalidEmailError: false,
		showSetPassword: false,
	};

	componentDidMount() {
		this.getEmailFromQueryString();
	}

	getEmailFromQueryString = () => {
		const {location} = this.props;
		const {email} = queryString.parse(location.search);
		if (email) {
			this.setState({email});
		}
	};

	onHandleChange = (value, key) => {
		this.setState({[key]: value});
	};

	openTokenPage = () => {
		this.props.history.replace(routeConstants.RESET_TOKEN);
	};

	onSubmit = async () => {
		const {email} = this.state;

		if (!email) {
			return true;
		}

		if (this.validateEmail(email)) {
			this.setState({email});
			this.setState({isLoading: true});
			this.setState({isSubmitted: true});

			try {
				await this.props.resetPassword(email, this.props.history);
			} catch (err) {
				this.setState({isLoading: false});
				return this.setState({error: err.message});
			}
			this.setState({isLoading: false});
			this.setState({success: true});
		}
	};

	close = () => {
		this.setState({error: ''});
	};

	validateEmail = (mail) => {
		if (isEmailValid(mail)) {
			return true;
		}

		this.setState({showInvalidEmailError: true});
		return false;
	};

	render() {
		const {error, email, isLoading, success, showInvalidEmailError} = this.state;

		const isValid = !isLoading && email && isEmailValid(email);

		return (
			<div className="SignIn__Wrapper">
				<Grid columns={4}>
					<>
						{showInvalidEmailError && (
							<DialogBox
								title={'Hmmm...'}
								errorBox={true}
								description={`Invalid email address.`}
								noCallback={() => this.setState({showInvalidEmailError: false})}
								yesCallback={() => this.setState({showInvalidEmailError: false})}
							/>
						)}
						<div className="SignIn_Text">
							<L18nText id="reset_description" defaultMessage="Let's reset your password" />
						</div>
						<div className="title-header">
							<L18nText id="reset_title" defaultMessage="Get password reset link" />
						</div>
						{error && (
							<DialogBox
								title={'Hmm...'}
								errorBox={true}
								description={error}
								noCallback={this.close}
								yesCallback={this.close}
							/>
						)}
						<div className="SignIn__Item">
							<TextInput
								label={'E-mail'}
								type="email"
								value={email}
								disabled={success || isLoading}
								onEnterKeyPress={this.onSubmit}
								onChange={this.onHandleChange}
								infoKey={'email'}
							/>
						</div>
						{!showInvalidEmailError && !error && success && (
							<div className="SignIn__Item center">
								<div className="Reset_Text">
									<div className="title">
										<L18nText
											id="reset_inbox"
											defaultMessage="We're on it! Please check your inbox."
										/>
									</div>
								</div>
								<div className="SignIn_Text">
									<L18nText
										id="reset_link_email"
										defaultMessage="If you do not receive a link within 10 minutes, please email us at hello@noteable.co"
									/>
								</div>
							</div>
						)}

						{!success && (
							<div className="SignIn__Item">
								<div className="SingUp__Button">
									{isLoading ? (
										<div className="Reset_Text">
											<div className="title">
												<L18nText
													id="reset_inbox"
													defaultMessage="We're on it! Please check your inbox."
												/>
											</div>
										</div>
									) : (
										<Button onHandleClick={this.onSubmit} disabled={!isValid}>
											<L18nText id={'reset_sendEmail'} defaultMessage="Send email" />
										</Button>
									)}
								</div>
							</div>
						)}
						<div className="center" onClick={this.openTokenPage}>
							<span className="Reset__Token__Title">
								<L18nText id="reset_token" defaultMessage="Already received a reset token?" />
							</span>{' '}
							<span className="Reset__Token__Link">
								<L18nText id="app_click" defaultMessage="Click here" />
							</span>
						</div>
					</>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isSigning: state.user.isLoading,
		isAuthenticated: state.user.isLoggedIn,
		reset: state.user.passwordReset,
	};
}

export default connect(mapStateToProps, {resetPassword})(SignIn);
