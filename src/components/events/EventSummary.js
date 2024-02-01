import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FaCheckCircle} from 'react-icons/fa';

import './EventSummary.scss';
import sortBy from 'lodash/sortBy';
import Grid from 'components/shared/ui/Grid';
import Spinner from 'components/shared/ui/Spinner';
import L18nText from 'components/shared/L18nText';
import Breadcrumb from 'components/shared/ui/Breadcrumb';
import ElementsList from 'components/shared/ui/ElementsList';
import {fetchSelectedEvent} from 'actions/eventActions';
import {ReactComponent as ChevronIcon} from './Icon_ChevronRight.svg';
import {getLinkWithArguments} from 'commons/commons';
import {routeConstants} from 'const';
import Button from 'components/shared/ui/Button';
import {setEventPreventReload} from 'actions/eventActions';
import DialogBox from 'components/shared/ui/DialogBox';
class EventSummary extends Component {
	state = {
		openSelectedWineModal: false,
		showWarningModal: false,
		selectedTasting: null,
	};

	componentDidMount() {
		const {preventReload, setEventPreventReload} = this.props;

		if (!preventReload) {
			this.props.fetchSelectedEvent(this.props.match.params.eventRef, this.props.history);
		}
		setEventPreventReload(false);
	}

	onHideWarningModal = () => {
		return this.setState({showWarningModal: false, selectedTasting: null});
	};

	navigateToEvents = () => {
		this.props.history.replace(routeConstants.EVENTS);
	};

	handleEventTasting = (selectedTasting, existingUserImpression) => {
		const {
			match: {params},
		} = this.props;

		if (existingUserImpression) {
			this.setState({showWarningModal: true, selectedTasting});
			return;
		}

		this.props.history.push(
			getLinkWithArguments(routeConstants.NEW_EVENT_TASTING, {
				ref: params.eventRef,
				tastingRef: selectedTasting.ref,
			})
		);
	};

	renderEventDetails() {
		const {selectedEvent = {}} = this.props;
		const {showWarningModal, selectedTasting} = this.state;
		const {data: event, loading, error} = selectedEvent;

		if (loading) {
			return (
				<div className="EventSummary__Loading">
					<Spinner />
				</div>
			);
		}

		if (error || !event) {
			return (
				<div className="EventSummary__ErrorMessage">
					<L18nText id="event_failed_load" defaultMessage='Failed to load event information!"' />
					<div onClick={this.navigateToEvents}>
						<Button infoKey="nav_newTasting" data-test="nav_newTasting">
							<L18nText id="events" defaultMessage="Events" />
						</Button>
					</div>
				</div>
			);
		}

		return (
			<>
				<div className="EventSummary__Title__Container">
					<div className="EventSummary__Header">
						<div className="Title left">{event.name}</div>
						<div className="EventSummary__MetaEvent">{event.metaEvent}</div>
						<div className="EventSummary__SubHeader">{event.subHeader}</div>
					</div>
					<div className="EventSummary__Description">{event.description}</div>
				</div>
				{event.tastings && (
					<Grid columns={6}>
						<div className="EventSummary__Selection">
							<div className="SubTitle center mx-top-20">
								<L18nText id="wine_select" default="Select Wine" />
							</div>
							<Grid columns={6}>
								<ElementsList>
									<div>
										{sortBy(event.tastings.filter(Boolean), [(tasting) => tasting.name]).map(
											(item) => (
												<>
													{showWarningModal && (
														<DialogBox
															title={'app_are_you_sure'}
															description={
																<p>
																	<L18nText
																		id="event_tasting_already_taken"
																		default="You have already tasted this wine. Are you sure you would like to
																	make a new tasting?"
																	/>
																</p>
															}
															noCallback={this.onHideWarningModal}
															yesCallback={() => this.handleEventTasting(selectedTasting)}
														/>
													)}

													<div
														data-find={item.name}
														className="EventSummary__Tasting"
														onClick={() =>
															this.handleEventTasting(item, item.existing_user_impression)
														}
													>
														<div className="EventSummary__Tasting__Container">
															<div className="EventSummary__Tasting__Text">{item.name}</div>
														</div>
														<div className="EventSummary__Tasting__Chevron">
															{item.existing_user_impression ? (
																<FaCheckCircle className="bit-bigger" />
															) : (
																<ChevronIcon />
															)}
														</div>
													</div>
												</>
											)
										)}
									</div>
								</ElementsList>
							</Grid>
						</div>
					</Grid>
				)}
			</>
		);
	}

	render() {
		const {selectedEvent = {}} = this.props;
		const {data: event, error} = selectedEvent;

		return (
			<Grid columns={6}>
				<div className="EventSummary__Container">
					<>
						{!error && event && (
							<div className="Breadcrumb__Wrapper">
								<Grid columns={12}>
									<Breadcrumb path={`events / ${event ? event.name : 'event_loading'}`} />
								</Grid>
							</div>
						)}
						{this.renderEventDetails()}
					</>
				</div>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		selectedEvent: state.selectedEvent,
		preventReload: state.events.preventReload,
	};
}

export default connect(mapStateToProps, {fetchSelectedEvent, setEventPreventReload})(EventSummary);
