import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import {saveAdvancedOptions} from 'actions/appActions';
import TextInput from 'components/shared/ui/TextInput';
import DialogBox from 'components/shared/ui/DialogBox';
import Grid from 'components/shared/ui/Grid';
import Radio from 'components/shared/ui/Radio';
import Spinner from 'components/shared/ui/Spinner';
import {updateUserInfo, changeUserPassword, userPasswordChanged} from 'actions/userActions';
import wineKnowledgeList from 'assets/json/wine_knowledge.json';

class AccountDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newUserEmail: '',
			newUserPass: '',
			selectedWineKnowledge: '',
			newUserPassConfirm: '',
			isLoading: false,
			userName: '',
		};

		this.saveAccountDetails = this.saveAccountDetails.bind(this);
	}

	componentDidMount() {
		const {userData} = this.props;
		const {wine_knowledge} = userData;

		this.setState({newUserEmail: userData && userData.email});
		this.setState({userName: userData && userData.name});

		if (wine_knowledge) {
			const wineKnowledge = wineKnowledgeList.wine_knowledge_list.find(
				(wine) => wine.title_key === wine_knowledge
			);

			const selectedWineKnowledge = {
				title_key: wineKnowledge.title_key,
				description: wineKnowledge.description,
				role: wineKnowledge.role,
			};

			this.setState({selectedWineKnowledge});
		}
	}

	getIsValidForm = () => {
		const {newUserEmail, title} = this.state;
		const {userData} = this.props;
		let isValidForm = newUserEmail !== userData.email;

		if (title && title.role) {
			isValidForm = true;
		}

		return isValidForm;
	};

	onHandleChange = (value, key) => {
		this.setState({[key]: value});
	};

	getIsValidForm = () => {
		const {newUserPass, newUserPassConfirm, userName} = this.state;
		const {userData} = this.props;
		const isValidPassword = this.getIsValidPassword();
		let isValidForm = false;
		const newUserName = userName.trim();

		if (newUserName !== userData.name && newUserName !== '') isValidForm = true;

		if ((isValidForm && newUserPass !== '') || newUserPassConfirm !== '') {
			isValidForm = newUserPass && newUserPassConfirm && isValidPassword;
		}

		return isValidForm;
	};

	saveAccountDetails() {
		const {userData = {}, changeUserPassword} = this.props;
		const {newUserPass, newUserPassConfirm, userName} = this.state;
		const newUserName = userName.trim();

		if (this.getIsValidPassword() && newUserPass && newUserPassConfirm) {
			changeUserPassword(userData.email, newUserPass, this.props.history);
			this.setState({newUserPass: '', newUserPassConfirm: ''});
		}

		if (newUserName !== userData.name && newUserName !== '') {
			const payload = {
				name: newUserName || '',
			};
			this.props.updateUserInfo(payload, this.props.history);
		}
	}

	getIsValidPassword = () => {
		const {newUserPass, newUserPassConfirm} = this.state;
		const isValidPassword = this.passwordMatcher(newUserPass, newUserPassConfirm);
		return isValidPassword;
	};

	passwordMatcher = (newUserPass, newUserPassConfirm) => {
		if (!newUserPass || !newUserPassConfirm) {
			return true;
		}

		if (newUserPass && newUserPassConfirm && newUserPass === newUserPassConfirm) {
			return true;
		}
		return false;
	};

	onHandleChange = (value, key) => {
		this.setState({[key]: value});
	};

	handleChangeOption = (selected) => {
		const wineList = wineKnowledgeList.wine_knowledge_list;

		wineList.forEach((item) => {
			if (item.title_key === selected) {
				this.setState({selectedWineKnowledge: item});
			}
		});
	};

	saveWineKnowledgeTitle = async () => {
		const {selectedWineKnowledge, userName} = this.state;

		const newUserName = userName.trim();
		const payload = {
			name: newUserName || '',
			wine_knowledge: selectedWineKnowledge && selectedWineKnowledge.title_key,
		};

		await this.props.updateUserInfo(payload, this.props.history);
	};

	closeModal = () => {
		this.setState({error: false, isLoading: false});
		this.props.userPasswordChanged(false);
	};

	render() {
		const {isLoading, passwordChange} = this.props;
		const wineList = wineKnowledgeList.wine_knowledge_list;
		const {newUserPassConfirm, newUserPass, selectedWineKnowledge} = this.state;

		return (
			<>
				{isLoading && <Spinner />}
				{passwordChange && (
					<DialogBox
						title={'settings_account_title'}
						description={'settings_account_change_password_success'}
						errorBox={true}
						noCallback={this.closeModal}
					/>
				)}
				<div className="title">
					<L18nText id="settings_account" defaultMessage="Account details" />
				</div>

				<div className="ProfilePage__Item">
					<Grid columns={8} customizedColumns>
						<span className="label">
							<L18nText id="settings_user_profile_name" defaultMessage="Name" />
						</span>
						<TextInput
							type="text"
							value={this.state.userName}
							onChange={this.onHandleChange}
							infoKey={'userName'}
						/>
					</Grid>
				</div>

				<div className="ProfilePage__Item">
					<Grid columns={8} customizedColumns>
						<span className="label">
							<L18nText id="settings_user_profile_email" defaultMessage="Email" />
						</span>
						<TextInput
							type="text"
							disabled
							value={this.state.newUserEmail}
							onChange={this.onHandleChange}
							infoKey={'newUserEmail'}
						/>
					</Grid>
				</div>

				<div className="ProfilePage__Item">
					<Grid columns={8} customizedColumns>
						<span className="label">
							<L18nText id="settings_user_profile_password" defaultMessage="Password" />
						</span>
						<TextInput
							type="password"
							onChange={this.onHandleChange}
							infoKey={'newUserPass'}
							value={newUserPass}
						/>
					</Grid>
				</div>
				<div className="ProfilePage__Item">
					<Grid columns={8} customizedColumns>
						<span className="label">
							<L18nText
								id="settings_user_profile_password_confirm"
								defaultMessage="Confirm Password"
							/>
						</span>
						<TextInput
							type="password"
							value={newUserPassConfirm}
							onChange={this.onHandleChange}
							infoKey={'newUserPassConfirm'}
						/>
					</Grid>
				</div>

				{!this.getIsValidPassword() && (
					<span className="SignUp__Error">
						<L18nText
							id="settings_user_profile_password_do_not_match"
							defaultMessage="Passwords don't match"
						/>
					</span>
				)}

				<div className="ProfilePage__Item">
					<Button onHandleClick={this.saveAccountDetails} disabled={!this.getIsValidForm()}>
						<L18nText id={isLoading ? 'app_updating' : 'app_update'} defaultMessage="Update" />
					</Button>
				</div>

				<div className="WineKnowledge__Wrapper">
					<div className="WineKnowledge__Block">
						<div className="WineKnowledge__Title title">
							<L18nText id="settings_wine_title" defaultMessage="Title" />
						</div>
						<div className="WineKnowledge__WrapperItems">
							<div className="WineKnowledge__Items">
								{wineList.map((item, i) => {
									let isChecked = selectedWineKnowledge.title_key === item.title_key;
									return (
										<div key={i}>
											<Radio
												id={item.title_key}
												label={<L18nText id={item.title_key} defaultMessage={item.description} />}
												name={'wine_knowledge'}
												isChecked={isChecked}
												onChange={this.handleChangeOption}
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				<div className="ProfilePage__Item">
					<Button onHandleClick={this.saveWineKnowledgeTitle} disabled={isLoading}>
						<L18nText id={isLoading ? 'app_updating' : 'app_update'} defaultMessage="Update" />
					</Button>
				</div>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		lang: state.user.language,
		userData: state.user.userData,
		userEmail: state.user.userData.email,
		passwordChange: state.user.passwordChange,
		isLoading: state.user.isLoading,
	};
}

export default connect(mapStateToProps, {
	saveAdvancedOptions,
	updateUserInfo,
	changeUserPassword,
	userPasswordChanged,
})(withRouter(AccountDetails));
