import React, {Component} from 'react';
import {connect} from 'react-redux';

import Modal from 'components/shared/ui/Modal';
import Button from 'components/shared/ui/Button';

import {setTastingType} from 'actions/multiStepFormActions';
import {getLinkWithArguments} from 'commons/commons';
import DialogBox from 'components/shared/ui/DialogBox';
import SingleSelector from 'components/shared/ui/SingleSelector';
import Grid from 'components/shared/ui/Grid';
import {routeConstants, tastingsConstants} from 'const';
import L18nText from 'components/shared/L18nText';

import './SelectTasting.scss';

const getTastingsByActivePlan = (activePlan, isDevelopmentMode) => {
	const {ENABLED_TASTING_TYPES} = tastingsConstants;

	// if (isDevelopmentMode) {
	// 	return ENABLED_TASTING_TYPES;
	// }

	let displayedTastings = [...ENABLED_TASTING_TYPES];

	if (activePlan !== 'scholar') {
		displayedTastings = [
			...ENABLED_TASTING_TYPES.filter((i) => i.group !== 'tasting_group_scholar'),
			{
				id: 'scholar',
				name: 'tasting_type_scholar_name',
				description: '',
			},
		];
	}

	return displayedTastings.map((tasting) => {
		const isVisibleToActivePlan = () =>
			Array.isArray(tasting.plans) && tasting.plans.includes(activePlan);

		return {
			...tasting,
			disabled: !isVisibleToActivePlan(),
		};
	});
};

class SelectTasting extends Component {
	state = {
		needUpgrade: false,
		showWarning: true,
	};

	navigateToTasting = (newTasting) => {
		const {eventTasting, handleEventTasting} = this.props;

		if (eventTasting) {
			handleEventTasting(newTasting.id);
		} else {
			this.props.history.replace(
				getLinkWithArguments(routeConstants.NEW_TASTING_TYPE, {type: newTasting.id})
			);
			this.props.setTastingType(newTasting.id, true);
		}
	};

	navigateToHome = () => {
		this.props.history.replace(routeConstants.MY_TASTINGS);
	};

	onCloseModal = () => {
		const {eventTasting, onClose, history} = this.props;
		if (eventTasting && onClose) {
			onClose();
		} else {
			history.push(routeConstants.MY_TASTINGS);
		}
	};

	close = () => {
		this.setState({showWarning: false});
	};

	render() {
		const {history, activePlan, fullVersionMode} = this.props;
		const {needUpgrade} = this.state;

		const isDevelopmentMode = fullVersionMode && !/noteable.co/.test(window.location.host);
		const tastingsForActivePlan = getTastingsByActivePlan(activePlan, isDevelopmentMode);
		const shouldGroupTastings = activePlan === 'scholar' || isDevelopmentMode;

		return (
			<Modal
				onClose={this.onCloseModal}
				title={'tasting_choose_title'}
				body={
					<div className="select-tasting-page container">
						<Grid columns={4}>
							<SingleSelector
								type="default"
								items={tastingsForActivePlan}
								onSelect={this.navigateToTasting}
								onDisabledClick={() => this.setState({needUpgrade: true})}
								groupItems={shouldGroupTastings}
								shortSubHeaderOnMobile
							/>
						</Grid>
						{needUpgrade && (
							<DialogBox
								title="upgrade_you_need_title"
								description="upgrade_you_need_message"
								noText="upgrade_go_back"
								yesText="upgrade_go_to_profile"
								noCallback={() => this.setState({needUpgrade: false})}
								yesCallback={() => history.push('/profile')}
							/>
						)}
					</div>
				}
				footer={
					<div className="alignCenter pd-10">
						<Button
							variant="outlined"
							onHandleClick={this.navigateToHome}
							infoKey="backToMyTastings"
						>
							<L18nText id={'nav_myTasting'} defaultMessage="My Tastings" />
						</Button>
					</div>
				}
			/>
		);
	}
}

SelectTasting.defaultProps = {
	eventTasting: false,
};

function mapStateToProps(state) {
	return {
		fullVersionMode: state.app.advancedOptions.fullVersion,
		activePlan: state.user.activePlan,
	};
}

export default connect(mapStateToProps, {setTastingType})(SelectTasting);
