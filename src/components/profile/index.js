import {connect} from 'react-redux';
import React, {Component} from 'react';
import {FormattedHTMLMessage} from 'react-intl';

import './profile.scss';
import Spinner from 'components/shared/ui/Spinner';
import PersonalDetails from './PersonalDetails';
import {fetchUserInfo, addUserProfilePic} from 'actions/userActions';
import ProfileBanner from 'components/shared/ui/ProfileBanner';
import SingleSelector from 'components/shared/ui/SingleSelector';
import AccountDetails from './AccountDetails';
import WineEducation from './settings/WineEducation';
import Grid from '../shared/ui/Grid';
import {withRouter} from 'react-router';
import SubscriptionPayment from './settings/SubscriptionPayment';
import Accordion from '../shared/ui/Accordion';

let tastingSelectionListItems = [
	{
		id: 'account',
		name: 'settings_account',
		description: 'settings_account_description',
	},
	/*{
		id: 'personal',
		name: 'settings_personal',
		description: 'settings_personal_description',
	},*/
	{
		id: 'subscription',
		name: 'settings_subscription_payment',
		description: 'settings_subscription_payment_description',
	},
	{
		id: 'education',
		name: 'settings_wine_education_title',
		description: 'settings_wine_education_description',
	},
];

const notfullModeSelectionListItems = [
	{
		id: 'account',
		name: 'settings_account',
		description: 'settings_account_description',
	},
	{
		id: 'subscription',
		name: 'settings_subscription_payment',
		description: 'settings_subscription_payment_description',
	},
	{
		id: 'education',
		name: 'settings_wine',
		description: 'settings_wine_description',
	},
];

const MOBILE_DEVICE_WIDTH = 768;

class ProfilePage extends Component {
	state = {
		selectedTastingItem: 'account',
		windowWidth: window.innerWidth,
	};

	async componentDidMount() {
		await this.props.fetchUserInfo(this.props.history);
		this.setState({windowWidth: window.innerWidth});
		window.addEventListener('resize', () => this.setState({windowWidth: window.innerWidth}));
		this.patchActiveTab();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', () => this.setState({windowWidth: window.innerWidth}));
	}

	patchActiveTab = () => {
		const {location: {search = ''} = {}} = this.props;

		const subscriptionTab = notfullModeSelectionListItems.find((i) => i.id === 'subscription');
		if (subscriptionTab && search.includes(subscriptionTab.id)) {
			this.navigateToTasting(subscriptionTab);
		}
	};

	navigateToTasting = (item) => {
		this.setState({selectedTastingItem: item.id});
	};

	settingOption = {
		account: <AccountDetails />,
		personal: <PersonalDetails />,
		education: <WineEducation />,
		subscription: <SubscriptionPayment />,
	};

	onUpdateProfile = (file) => {
		const formData = new FormData();
		formData.append('avatar', file[0]);

		this.props.addUserProfilePic(formData);
	};

	render() {
		const {selectedTastingItem, windowWidth} = this.state;
		const {
			userData,
			isLoading,
			userProfileData,
			fullVersionMode,
			serverUrl,
			mustLoginAgain,
		} = this.props;

		const selectionListItems = fullVersionMode
			? tastingSelectionListItems
			: notfullModeSelectionListItems;

		return (
			<Grid columns={10}>
				{isLoading ? (
					<Spinner />
				) : (
					<div className="ProfilePage__Wrapper">
						<ProfileBanner
							serverUrl={serverUrl}
							userData={userData}
							isLoading={isLoading}
							userTitle={userProfileData}
							mustLoginAgain={mustLoginAgain}
							onUpdateImage={this.onUpdateProfile}
						/>
						{windowWidth > MOBILE_DEVICE_WIDTH
							? !mustLoginAgain && (
									<div className="ProfilePage__Body isDesktop">
										<div className="ProfilePage__Body__Left">
											<SingleSelector
												type="default"
												items={selectionListItems}
												onSelect={this.navigateToTasting}
												selected={{id: selectedTastingItem}}
												hideArrow={true}
											/>
										</div>
										<div className="ProfilePage__Body__Right">
											{this.settingOption[selectedTastingItem]}
											<div className="ProfilePage__Footer">
												<FormattedHTMLMessage id="settting_contact" />
											</div>
										</div>
									</div>
							  )
							: !mustLoginAgain && (
									<div className="ProfilePage__Body isMobile">
										{selectionListItems.map((item) => (
											<Accordion
												expandText={item.name}
												collapseText={item.name}
												description={item.description}
											>
												{this.settingOption[item.id]}
											</Accordion>
										))}
									</div>
							  )}
					</div>
				)}
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		fullVersionMode: state.app.advancedOptions.fullVersion,
		serverUrl: state.app.advancedOptions.serverUrl,
		userData: state.user.userData,
		isLoading: state.user.isLoading,
		selectedType: state.user.selectedType,
		userProfileData: state.user.userProfile,
		mustLoginAgain: state.appErrorModal && state.appErrorModal.mustLoginAgain,
	};
}

export default connect(mapStateToProps, {fetchUserInfo, addUserProfilePic})(
	withRouter(ProfilePage)
);
