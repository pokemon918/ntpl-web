import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import Grid from 'components/shared/ui/Grid';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import Spinner from 'components/shared/ui/Spinner';
import {updateUserInfo} from 'actions/userActions';
import TextInput from 'components/shared/ui/TextInput';
import Select from '../shared/ui/Select';

import countries from 'assets/json/countries';
import wineKnowledgeList from 'assets/json/wine_knowledge.json';

class PersonalSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			phone: '',
			phonePrefix: {},
			linkedIn: '',
			twitter: '',
			selectedWineKnowledge: '',
		};
	}

	onChange(key, value) {
		this.setState({[key]: value});
	}

	savePersonalDetails = async () => {
		const payload = {
			name: this.state.name || '',
			contact: {
				phone: this.state.phone || '',
				phone_prefix: (this.state.phonePrefix && this.state.phonePrefix.phone) || '',
				linkedin: this.state.linkedIn || '',
				twitter: this.state.twitter || '',
			},
			selectedWineKnowledge: '',
		};
		await this.props.updateUserInfo(payload, this.props.history);
		this.setState({isLoading: false});
	};

	componentDidMount() {
		const {name, contact, wine_knowledge} = this.props.userData;

		const phone = contact && contact.phone;
		const phonePrefix = contact && contact.phone_prefix;
		const linkedIn = contact && contact.linkedin;
		const twitter = contact && contact.twitter;
		this.setState({name, phone, linkedIn, twitter, phonePrefix});

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

	render() {
		const {isLoading, error} = this.props;
		return (
			<>
				{isLoading && <Spinner />}
				<div className="title">
					<L18nText id="settings_personal" defaultMessage="Personal details" />
				</div>
				{error && <div className="ProfilePage__Error">{error}</div>}
				<div className="ProfilePage__Item">
					<Grid columns={8}>
						<span className="label">
							<L18nText id="settings_name" defaultMessage="Name" />
						</span>
						<TextInput
							type="text"
							value={this.state.name}
							onChange={(e) => this.onChange('name', e)}
						/>
					</Grid>
				</div>
				<div className="ProfilePage__Item">
					<Grid columns={8}>
						<span className="label">
							<L18nText id="settings_phone" defaultMessage="Phone no" />
						</span>
						<Grid columns={12}>
							<div className="ProfilePage__Phone__Container">
								<div className="ProfilePage__Phone__Prefix">
									<Select
										items={countries.countries}
										valueKey="phone"
										displayKey="name"
										label={this.state.phonePrefix}
										onSelectItem={(e) => this.onChange('phonePrefix', e)}
									/>
								</div>
								<div className="ProfilePage__Phone">
									<TextInput
										type="text"
										value={this.state.phone}
										onChange={(e) => this.onChange('phone', e)}
									/>
								</div>
							</div>
						</Grid>
					</Grid>
				</div>

				<div className="ProfilePage__Item">
					<Grid columns={8}>
						<span className="label">
							<L18nText id="settings_linkedIn" defaultMessage="LinkedIn" />
						</span>
						<TextInput
							type="text"
							value={this.state.linkedIn}
							onChange={(e) => this.onChange('linkedIn', e)}
						/>
					</Grid>
				</div>

				<div className="ProfilePage__Item">
					<Grid columns={8}>
						<span className="label">
							<L18nText id="settings_twitter" defaultMessage="Twitter" />
						</span>
						<TextInput
							type="text"
							value={this.state.twitter}
							onChange={(e) => this.onChange('twitter', e)}
						/>
					</Grid>
				</div>

				<div className="ProfilePage__Item">
					<Button onHandleClick={this.savePersonalDetails} disabled={isLoading}>
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
		error: state.user.error,
		userData: state.user.userData,
		isLoading: state.user.isLoading,
	};
}

export default connect(mapStateToProps, {
	updateUserInfo,
})(withRouter(PersonalSetting));
