import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import Button from 'components/shared/ui/Button';
import {saveAdvancedOptions} from 'actions/appActions';
import TextInput from 'components/shared/ui/TextInput';
import L18nText from 'components/shared/L18nText';
import {changeLanguage, updateUserInfo, changeUserPassword} from 'actions/userActions';
import Grid from 'components/shared/ui/Grid';
import Accordion from 'components/shared/ui/Accordion';
import DropoverInput from 'components/shared/ui/DropoverInput';
import {isLocalhost} from 'commons/commons';

const languageOptions = [
	{
		value: 'en',
		label: <L18nText id="settings_language_en" defaultMessage="English" />,
		name: 'English',
	},
	{
		value: 'zh-HANS',
		name: 'Chinese simplified',
		label: <L18nText id="settings_language_zhcn" defaultMessage="Chinese simplified" />,
	},
	{
		value: 'symbols',
		label: <L18nText id="settings_language_sy" defaultMessage="Symbol" />,
		name: 'Symbol',
	},
];

const booleanOptions = [
	{value: true, label: <L18nText id={'settings_on'} />, name: 'On'},
	{value: false, label: <L18nText id={'settings_off'} />, name: 'Off'},
];

const binaryOptions = ['demoMode', 'translatorMode'];

const TRANSLATOR_MODE = 'translator_mode';

class AdvancedOption extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: {
				serverUrl: false,
				demoMode: false,
				translatorMode: false,
			},
			serverUrl: '',
			demoMode: false,
			fullVersion: false,
			showLanguage: false,
			translatorMode: false,
			newUserEmail: '',
			newUserPass: '',
			showDemoMode: false,
			showFullMode: false,
			showLanguage: false,
			showTranslatorMode: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.saveOptions = this.saveOptions.bind(this);
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.saveAccountDetails = this.saveAccountDetails.bind(this);
	}

	getSelectedLanguage() {
		return languageOptions.find((i) => i.value === this.props.lang);
	}

	getSelectedDemoValue() {
		return booleanOptions.find((i) => i.value === this.props.app.advancedOptions.demoMode);
	}

	getSelectedTranslator() {
		return booleanOptions.find((i) => i.value === this.props.app.advancedOptions.demoMode);
	}

	getSelectedFullVersion() {
		return booleanOptions.find((i) => i.value === this.state.fullVersion);
	}

	handleChange(event, name) {
		let value = event.value;

		this.onHideTranslatorMode();
		this.onHideDemoMode();
		this.onHideFullMode();

		if (binaryOptions.includes(name)) {
			value = Boolean(Number(value));
		}

		this.setState({[name]: value});
	}

	handleLanguageChange(option) {
		this.props.changeLanguage(option.value);
	}

	handleUserEmailChange(option) {
		this.setState({newUserEmail: option});
	}

	handleUserPasswordChange(option) {
		this.setState({newUserPass: option});
	}

	saveOptions() {
		this.props.saveAdvancedOptions({
			serverUrl: this.state.serverUrl,
			demoMode: this.state.demoMode,
			fullVersion: this.state.fullVersion,
		});

		// must refresh page after switching translator mode
		const translatorMode = this.state.translatorMode ? 'on' : 'off';

		if (translatorMode !== localStorage.getItem(TRANSLATOR_MODE)) {
			localStorage.setItem(TRANSLATOR_MODE, translatorMode);
			window.location.reload();
		}
	}

	saveAccountDetails() {
		const {userProfile, updateUserInfo, changeUserPassword} = this.props;
		const {newUserPass, newUserEmail} = this.state;

		if (newUserEmail && newUserEmail !== userProfile.email) {
			let payload = {
				email: newUserEmail,
				name: userProfile.name,
			};
			updateUserInfo(payload, this.props.history);
		}

		if (newUserPass) {
			changeUserPassword(userProfile.email, newUserPass, this.props.history);
		}
	}

	async componentDidMount() {
		const hasFullVersionData = this.props.app.advancedOptions.fullVersion;

		this.setState({
			fullVersion: hasFullVersionData !== null ? hasFullVersionData : isLocalhost(),
		});

		if (this.props.app.advancedOptions.serverUrl !== this.state.serverUrl) {
			this.setState({serverUrl: this.props.app.advancedOptions.serverUrl});
		}
		this.setState({demoMode: this.props.app.advancedOptions.demoMode});
		this.setState({translatorMode: this.props.app.advancedOptions.translatorMode});

		if (this.props.userEmail) {
			this.setState({newUserEmail: this.props.userEmail});
		}

		this.setState({translatorMode: localStorage.getItem(TRANSLATOR_MODE) === 'on'});
	}

	render() {
		const selectedLang = this.getSelectedLanguage();
		const selectedFullVersion = this.getSelectedFullVersion();
		const {demoMode, translatorMode} = this.state;

		return (
			<>
				{this.props.showSettings && (
					<>
						<div className="title">
							<L18nText id="settings_account" defaultMessage="Account details" />
						</div>
						<div className="ProfilePage__Item">
							<Grid columns={8}>
								<span className="label">
									<L18nText id="settings_user_profile_email" defaultMessage="Email" />
								</span>
								<TextInput
									type="text"
									value={this.state.newUserEmail}
									onChange={(e) => this.handleUserEmailChange(e)}
								/>
							</Grid>
						</div>

						<div className="ProfilePage__Item">
							<Grid columns={8}>
								<span className="label">
									<L18nText id="settings_user_profile_password" defaultMessage="Password" />
								</span>
								<TextInput type="password" onChange={(e) => this.handleUserPasswordChange(e)} />
							</Grid>
						</div>

						<div className="ProfilePage__Item">
							<Button
								onHandleClick={this.saveAccountDetails}
								disabled={
									this.state.newUserEmail === this.props.userEmail && !this.state.newUserPass.length
								}
							>
								<L18nText id="app_update" defaultMessage="Update" />
							</Button>
						</div>
					</>
				)}

				{this.props.showAdvanceSetting && (
					<Accordion
						children={
							<>
								<Grid columns={8}>
									<L18nText id="settings_change_language" defaultMessage="Change Language" />
									<DropoverInput
										label="Select Language"
										options={languageOptions}
										onSelect={this.handleLanguageChange}
										value={selectedLang.name || 'English'}
									/>
								</Grid>
								<div className="ProfilePage__Item">
									<Grid columns={8}>
										<span className="label">
											<L18nText id="settings_server_url" defaultMessage="Server Url" />
										</span>
										<TextInput
											type="text"
											value={this.state.serverUrl}
											onChange={(e) => this.handleChange({value: e}, 'serverUrl')}
										/>
									</Grid>
								</div>

								<div className="ProfilePage__Item">
									<Grid columns={8}>
										<span className="label">
											<L18nText
												id="settings_advanced_options_demo_mode"
												defaultMessage="Demo mode"
											/>
											:
										</span>
										<DropoverInput
											label="Select Demo Mode"
											options={booleanOptions}
											onSelect={(e) => this.handleChange(e, 'demoMode')}
											value={demoMode ? 'On' : 'Off'}
										/>
									</Grid>
								</div>

								<div className="ProfilePage__Item">
									<Grid columns={8}>
										<span className="label">
											<L18nText id="settings_translator_mode_" defaultMessage="Translator mode" />
										</span>
										<DropoverInput
											label="Select Translate Mode"
											options={booleanOptions}
											onSelect={(e) => this.handleChange(e, 'translatorMode')}
											value={translatorMode ? 'On' : 'Off'}
										/>
									</Grid>
								</div>

								<div className="ProfilePage__Item">
									<Grid columns={8}>
										<span className="label">
											<L18nText id="settings_full_version" defaultMessage="Full Version" />
										</span>
										<DropoverInput
											label="Select Application Mode"
											options={booleanOptions}
											onSelect={(e) => this.handleChange(e, 'fullVersion')}
											value={selectedFullVersion.name ? 'On' : 'Off'}
										/>
									</Grid>
								</div>

								<div className="ProfilePage__Item">
									<Button onHandleClick={this.saveOptions}>
										<L18nText id="app_update" defaultMessage="Update" />
									</Button>
								</div>
							</>
						}
						defaultView={true}
						noBorder={true}
						expandText={'app_advanced'}
						collapseText={'app_advanced'}
					/>
				)}
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		lang: state.user.language,
	};
}

export default connect(mapStateToProps, {
	saveAdvancedOptions,
	changeLanguage,
	updateUserInfo,
	changeUserPassword,
})(withRouter(AdvancedOption));
