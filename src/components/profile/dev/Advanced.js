import React, {Component} from 'react';
import {connect} from 'react-redux';

import Button from 'components/shared/ui/Button';
import {saveAdvancedOptions} from 'actions/appActions';
import TextInput from 'components/shared/ui/TextInput';
import L18nText from 'components/shared/L18nText';
import {changeLanguage} from 'actions/userActions';
import Grid from 'components/shared/ui/Grid';
import Dropover from 'components/shared/ui/Dropover';
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

class Advanced extends Component {
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
			translatorMode: false,
			showDemoMode: false,
			showFullMode: false,
			showLanguage: false,
			showTranslatorMode: false,
		};

		this.handleChange = this.handleChange.bind(this);
		this.saveOptions = this.saveOptions.bind(this);
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
	}
	onHideFullMode = () => {
		this.setState({showFullMode: false});
	};

	onShowFullMode = () => {
		this.setState({showFullMode: true});
	};

	onHideLanguage = () => {
		this.setState({showLanguage: false});
	};

	onShowLanguage = (subject) => {
		this.setState({showLanguage: true});
	};

	onHideDemoMode = () => {
		this.setState({showDemoMode: false});
	};

	onShowDemoMode = () => {
		this.setState({showDemoMode: true});
	};

	onHideTranslatorMode = () => {
		this.setState({showTranslatorMode: false});
	};

	onShowTranslatorMode = () => {
		this.setState({showTranslatorMode: true});
	};

	componentDidMount() {
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
		this.onHideLanguage();
		this.props.changeLanguage(option.value);
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

	render() {
		const {
			showLanguage,
			showDemoMode,
			showTranslatorMode,
			showFullMode,
			demoMode,
			translatorMode,
		} = this.state;

		const selectedLang = this.getSelectedLanguage();
		const selectedFullVersion = this.getSelectedFullVersion();

		return (
			<div className="DevAdvanced__Container">
				<h2>
					<L18nText id="app_advanced" defaultMessage="Advanced" />
				</h2>
				<p>
					<i>__TAGS__ b__BUILD__ __BRANCH__ __COMMIT__ __DATETIME__</i>
				</p>
				<Grid columns={8}>
					<L18nText id="settings_change_language" defaultMessage="Change Language" />
					{showLanguage && (
						<Dropover
							title={'Select Language'}
							onClose={this.onHideLanguage}
							options={languageOptions}
							onSelect={this.handleLanguageChange}
						/>
					)}
					<TextInput
						type="text"
						onFocus={() => this.onShowLanguage()}
						value={selectedLang.name || 'English'}
						infoKey={'title'}
						isDropover
						readOnly
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
							<L18nText id="settings_advanced_options_demo_mode" defaultMessage="Demo mode" />:
						</span>
						{showDemoMode && (
							<Dropover
								title={'Select Language'}
								onClose={this.onHideDemoMode}
								options={booleanOptions}
								onSelect={(e) => this.handleChange(e, 'demoMode')}
							/>
						)}
						<TextInput
							type="text"
							onFocus={() => this.onShowDemoMode()}
							value={demoMode ? 'On' : 'Off'}
							infoKey={'title'}
							isDropover
							readOnly
						/>
					</Grid>
				</div>

				<div className="ProfilePage__Item">
					<Grid columns={8}>
						<span className="label">
							<L18nText id="settings_translator_mode_" defaultMessage="Translator mode" />
						</span>
						{showTranslatorMode && (
							<Dropover
								title={'Select Translate Mode'}
								onClose={this.onHideTranslatorMode}
								options={booleanOptions}
								onSelect={(e) => this.handleChange(e, 'translatorMode')}
							/>
						)}
						<TextInput
							type="text"
							onFocus={() => this.onShowTranslatorMode()}
							value={translatorMode ? 'On' : 'Off'}
							infoKey={'title'}
							isDropover
							readOnly
						/>
					</Grid>
				</div>

				<div className="ProfilePage__Item">
					<Grid columns={8}>
						<span className="label">
							<L18nText id="settings_full_version" defaultMessage="Full Version" />
						</span>
						{showFullMode && (
							<Dropover
								title={'Select Application Mode'}
								onClose={this.onHideFullMode}
								options={booleanOptions}
								onSelect={(e) => this.handleChange(e, 'fullVersion')}
							/>
						)}
						<TextInput
							type="text"
							onFocus={() => this.onShowFullMode()}
							label={selectedFullVersion?.name}
							infoKey={'title'}
							isDropover
							readOnly
						/>
					</Grid>
				</div>

				<div className="ProfilePage__Item ActionButtons">
					<Button onHandleClick={this.saveOptions}>
						<L18nText id="app_update" defaultMessage="Update" />
					</Button>
				</div>
			</div>
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
})(Advanced);
