import {connect} from 'react-redux';
import React, {Component} from 'react';
import {FormattedHTMLMessage} from 'react-intl';

import PaymentProfile from './PaymentProfile';
import Spinner from 'components/shared/ui/Spinner';
import {addUserProfilePic} from 'actions/userActions';
import ProfileBanner from 'components/shared/ui/ProfileBanner';
import SingleSelector from 'components/shared/ui/SingleSelector';
import Grid from '../shared/ui/Grid';

const tastingSelectionListItems = [
	{
		id: 'account',
		name: 'settings_account',
		description: 'Credit card information',
	},
];

class ProfilePage extends Component {
	state = {
		selectedTastingItem: 'account',
	};

	navigateToTasting = (item) => {
		this.setState({selectedTastingItem: item.id});
	};

	settingOption = {
		account: <PaymentProfile />,
	};

	render() {
		const {selectedTastingItem} = this.state;
		const {userData, isLoading, userProfileData} = this.props;

		return (
			<Grid columns={10}>
				{isLoading ? (
					<Spinner />
				) : (
					<div className="ProfilePage__Wrapper">
						<ProfileBanner
							userData={userData}
							isLoading={isLoading}
							userTitle={userProfileData}
							onUpdateImage={this.onUpdateProfile}
						/>
						<div className="ProfilePage__Body">
							<div className="ProfilePage__Body__Left">
								<SingleSelector
									type="default"
									items={tastingSelectionListItems}
									onSelect={this.navigateToTasting}
									selected={{id: selectedTastingItem}}
								/>
							</div>
							<div className="ProfilePage__Body__Right">
								{this.settingOption[selectedTastingItem]}
								<div className="ProfilePage__Footer">
									<FormattedHTMLMessage id="settting_contact" />
								</div>
							</div>
						</div>
					</div>
				)}
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		userData: state.user.userData,
		isLoading: state.user.isLoading,
		selectedType: state.user.selectedType,
		userProfileData: state.user.userProfile,
		fullVersionMode: state.app.advancedOptions.fullVersion,
	};
}

export default connect(mapStateToProps, {addUserProfilePic})(ProfilePage);
