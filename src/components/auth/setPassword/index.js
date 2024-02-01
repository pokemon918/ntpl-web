import React from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import Grid from 'components/shared/ui/Grid';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import Spinner from 'components/shared/ui/Spinner';
import TextInput from 'components/shared/ui/TextInput';
import DialogBox from 'components/shared/ui/DialogBox';

import {loginUser, resetAccessWithToken} from 'actions/userActions';
import {routeConstants} from 'const';

const TRIM_LAST_LENGTH = -20;
class SetPassword extends React.Component {
	state = {
		email: '',
		token: '',
		password: '',
		isLoading: '',
		hasToken: false,
		isCompleted: false,
	};

	onHandleChange = (value, key) => {
		this.setState({[key]: value});
	};

	componentDidMount() {
		const url = new URL(window.location.href);
		const token = url.searchParams.get('token');
		const hadToken = !!token;

		let {email} = this.state;
		const emailParam = url.searchParams.get('email');
		const hadEmail = !!emailParam;
		if (hadEmail) {
			email = emailParam;
		}

		this.setState({token, email, hadEmail, hadToken});
	}

	onSubmit = async () => {
		const {password, confirmPassword, token} = this.state;
		const trimToken = token.slice(TRIM_LAST_LENGTH);

		if (password === confirmPassword) {
			this.setState({isLoading: true});

			try {
				const userData = await this.props.resetAccessWithToken(
					password,
					trimToken,
					this.props.history
				);
				await this.props.loginUser(userData.email, password, this.props.history);
			} catch (err) {
				this.setState({isLoading: false});
				return this.setState({error: err.message});
			}

			this.props.history.replace(`${routeConstants.HOME}${window.location.search}`);
			this.setState({isLoading: false});
		}
	};

	navigateToLogin = () => {
		this.props.history.replace(routeConstants.SIGN_IN);
	};

	close = () => {
		this.setState({error: ''});
	};

	render() {
		const {
			error,
			token,
			password,
			isLoading,
			email,
			confirmPassword,
			hadEmail,
			hadToken,
		} = this.state;
		const isValid = password && confirmPassword && password === confirmPassword && !isLoading;

		return (
			<div>
				{error && (
					<DialogBox
						title={'Hmmm...'}
						errorBox={true}
						description={error || 'Token already used'}
						noCallback={this.close}
						yesCallback={this.close}
					/>
				)}
				<Grid columns={4}>
					<div className="SignIn__Wrapper">
						<div className="SignIn_Text">
							<L18nText id="reset_description" defaultMessage="Let's reset your password" />
						</div>
						<div className="title-header">
							<L18nText id="change_password_title" defaultMessage="Set new password" />
						</div>
						{!hadToken && (
							<TextInput
								label={'Reset Token'}
								type="text"
								value={token}
								disabled={this.props.isSigning}
								onChange={this.onHandleChange}
								infoKey={'token'}
							/>
						)}
						{null && !hadEmail && (
							<TextInput
								label={'Email'}
								type="text"
								value={email}
								disabled={this.props.isSigning}
								onChange={this.onHandleChange}
								infoKey={'email'}
							/>
						)}
						<TextInput
							label={'New password'}
							type="password"
							disabled={this.props.isSigning}
							onChange={this.onHandleChange}
							infoKey={'password'}
						/>
						<TextInput
							label={'Confirm new password'}
							type="password"
							disabled={this.props.isSaving}
							onChange={this.onHandleChange}
							infoKey={'confirmPassword'}
							onEnterKeyPress={this.onSubmit}
						/>
						<div className="SignIn__Item">
							<div className="SingUp__Button">
								{isLoading ? (
									<div className="pd-10 pos-relative">
										<Spinner />
									</div>
								) : (
									<Button onHandleClick={this.onSubmit} disabled={!isValid}>
										<L18nText
											id={isLoading ? 'app_loading' : 'reset_set_password'}
											defaultMessage="Set Password"
										/>
									</Button>
								)}
							</div>
							<div className="SignIn__Item" style={{textAlign: 'center'}}>
								<Link to="/login">
									<L18nText id={'app.login'} defaultMessage="Back to Login" />
								</Link>
							</div>
						</div>
					</div>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isSigning: state.user.isLoading,
		isAuthenticated: state.user.isLoggedIn,
	};
}

export default connect(mapStateToProps, {loginUser, resetAccessWithToken})(withRouter(SetPassword));
