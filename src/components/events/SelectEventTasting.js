import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
	fetchSelectedEvent,
	setTastingShowcaseData,
	setEventPreventReload,
} from 'actions/eventActions';
import {eventTastingInitStep} from 'actions/multiStepFormActions';
import {routeConstants, tastingsConstants} from 'const';
import {getLinkWithArguments} from 'commons/commons';
import {
	getSelectedEventMetadata,
	getSelectedEventTastingByRef,
} from 'reducers/selectedEventReducer';

import Button from 'components/shared/ui/Button';
import Grid from 'components/shared/ui/Grid';
import L18nText from 'components/shared/L18nText';
import Modal from 'components/shared/ui/Modal';
import Spinner from 'components/shared/ui/Spinner';
import WineInfo from 'components/shared/ui/WineInfo';
import {ReactComponent as Back} from 'components/tasting/Back.svg';

import './SelectEventTasting.scss';

class SelectEventTasting extends Component {
	state = {
		showError: false,
	};

	componentDidMount() {
		this.loadEventTasting();
	}

	loadEventTasting = async () => {
		const {
			match: {
				params: {ref: eventRef, tastingRef},
			},
			location,
			eventTastingType,
			history,
		} = this.props;

		let selectedEvent = this.props.selectedEvent;

		if (!selectedEvent) {
			selectedEvent = await this.props.fetchSelectedEvent(eventRef, history);
		}

		const tastingType =
			eventTastingType || location?.state || tastingsConstants.DEFAULT_EVENT_TASTING_TYPE;
		const selectedTasting = getSelectedEventTastingByRef(selectedEvent, tastingRef);
		this.setState({showError: !selectedTasting});
		this.props.setTastingShowcaseData(tastingType, selectedTasting, eventRef);
	};

	navigateToTasting = () => {
		const {tastingShowCaseData} = this.props;
		this.props.eventTastingInitStep(true);

		this.props.history.replace(
			getLinkWithArguments(routeConstants.EVENT_REF_TASTINGS_REF, {
				eventRef: tastingShowCaseData.eventRef,
				tastingRef: tastingShowCaseData.selectedTasting.ref,
				type: tastingShowCaseData.type,
			})
		);
	};

	closeSelectedWineModal = () => {
		const {tastingShowCaseData, setEventPreventReload} = this.props;

		setEventPreventReload(true);
		this.props.history.replace(`${routeConstants.EVENT}/${tastingShowCaseData.eventRef}`);
	};

	renderNavigation = () => {
		return (
			<div className="multi-step-form-nav">
				<div className="prev-btn">
					<div className="view-lg">
						<Button
							variant="outlined"
							onHandleClick={this.closeSelectedWineModal}
							className="view-lg"
						>
							<L18nText id="tasting_nav_back" defaultMessage="Back" />
						</Button>
					</div>
					<div className="view-sm arrow" onClick={this.closeSelectedWineModal}>
						<Back className="view-sm" />
					</div>
				</div>
			</div>
		);
	};

	render() {
		const {showError} = this.state;
		const {
			tastingShowCaseData: {selectedTasting},
		} = this.props;

		return (
			<Modal
				onClose={this.closeSelectedWineModal}
				title={'event_selected_wine'}
				body={
					<>
						{!selectedTasting && !showError && <Spinner />}
						{!selectedTasting && showError && (
							<L18nText
								id="event_no_tasting"
								defaultMessage="No tasting associated with the event."
							/>
						)}
						{selectedTasting && (
							<div className="EventSummary__Selected_Wine container">
								<Grid columns={4}>
									<div
										key={selectedTasting.ref}
										className="WineList__Item"
										onClick={this.navigateToTasting}
									>
										<WineInfo
											key={selectedTasting.ref}
											name={selectedTasting.name}
											price={selectedTasting.price}
											currency={selectedTasting.currency}
											producer={selectedTasting.producer}
											vintage={selectedTasting.vintage}
											region={selectedTasting.region}
											countryKey={selectedTasting.country_key}
											countryName={selectedTasting.country}
											location={selectedTasting.location}
											date={selectedTasting.created_at}
											isEventWine={true}
										/>
									</div>
								</Grid>
								<div className="StartTasting__Container">
									<Button onHandleClick={this.navigateToTasting}>
										<L18nText id="tasting_nav_start" defaultMessage="Start Tasting" />
									</Button>
								</div>
							</div>
						)}
					</>
				}
				footer={<div className="alignCenter">{this.renderNavigation()}</div>}
			/>
		);
	}
}

function mapStateToProps(state) {
	const eventMetadata = getSelectedEventMetadata(state);
	return {
		tastingShowCaseData: state.events.tastingShowCaseData,
		selectedEvent: state.selectedEvent.data,
		eventTastingType: eventMetadata ? eventMetadata.tastingType : null,
	};
}

export default connect(mapStateToProps, {
	setEventPreventReload,
	eventTastingInitStep,
	fetchSelectedEvent,
	setTastingShowcaseData,
})(SelectEventTasting);
