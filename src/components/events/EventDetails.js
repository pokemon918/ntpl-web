import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Card, CardBody, CardImage, CardTitle, CardText} from 'mdbreact';

import {fetchSelectedEvent} from 'actions/eventActions';
import {redirect, getFullDateAndTime, getLinkWithArguments} from 'commons/commons';
import {RatingTotal} from 'components/shared';
import {routeConstants} from 'const';
import {FaLongArrowAltLeft} from 'react-icons/fa';

import './EventDetails.scss';
import L18nText from 'components/shared/L18nText';

class EventDetails extends Component {
	componentDidMount() {
		const {
			match: {params},
		} = this.props;

		this.props.fetchSelectedEvent(params.eventRef, this.props.history);
	}

	get tastings() {
		const {selectedEvent = {}} = this.props;
		const tastings = selectedEvent.data && selectedEvent.data.tastings;

		let content = null;

		if (tastings == null || tastings.length <= 0) {
			content = (
				<div>
					<L18nText id="event_no_tastings" defaultMessage="You currently have no tastings." />
				</div>
			);
		}

		if (tastings) {
			content = tastings.map((wine) => {
				let wineImg = wine.images[0]
					? wine.images[0]
					: require('assets/images/wine-bottle-default.jpg');

				return (
					<div key={wine.ref} className={'wine-list-col col-md-3 mb-3'}>
						<Link to={getLinkWithArguments(routeConstants.TASTING_RESULT_REF, {wineRef: wine.ref})}>
							<Card className="wine-card">
								<CardImage className="img-fluid wine-img" src={wineImg} alt="Wine bottle" />
								<CardBody>
									<CardTitle>
										{wine.region}
										<br />
										{wine.name}
									</CardTitle>
									<CardText>
										<span>
											{wine.vintage}, {wine.country}
										</span>
										<br />
									</CardText>
									<button
										onClick={(e) => {
											redirect(
												this.props.history,
												getLinkWithArguments(routeConstants.TASTING_RESULT_REF, {
													wineRef: wine.ref,
												})
											);
										}}
										className="btn btn-primary see-more-btn"
									>
										<L18nText id="event_see_more" defaultMessage="See more" />
									</button>
									<div className="rating-total-wrapper">
										<RatingTotal showLabel={false} ratings={wine.rating} />
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>
				);
			});
		}

		return content;
	}

	get event() {
		const selectedEvent = this.props.selectedEvent.data || {};
		const startDate =
			selectedEvent.start_date && getFullDateAndTime(new Date(selectedEvent.start_date));
		const endDate = selectedEvent.end_date && getFullDateAndTime(new Date(selectedEvent.end_date));

		if (selectedEvent === null) {
			return (
				<h2>
					<L18nText id="event_data_load_error" defaultMessage="Unable to load data." />
				</h2>
			);
		}

		const visibility = {
			unlisted: 'event_visibility_hidden',
			open: 'event_visibility_open',
			private: 'event_visibility_private',
		};

		return (
			<div className="container event-details-page">
				<div className="my-events-btn-wrapper">
					<Link to={routeConstants.MY_EVENTS} className="btn btn-primary">
						<FaLongArrowAltLeft className="arrow-icon" />
						&nbsp; <L18nText id="event_title" defaultMessage="My Events" />
					</Link>
				</div>
				<div className="jumbotron p-3 p-md-5 rounded bg-light">
					<div className="col-md-6 px-0">
						<h1 className="display-4 font-italic">
							<L18nText id="event" defaultMessage="Event" />: {selectedEvent.name}
						</h1>
						<p className="lead my-3">{selectedEvent.description}</p>
						<p>
							<L18nText id="event_new_start_date" defaultMessage="Start date" />: {startDate} |{' '}
							<L18nText id="event_new_end_date" defaultMessage="End date" />: {endDate}
						</p>
						<p>
							<L18nText id="event_visibility" defaultMessage="Visibility" />:{' '}
							{selectedEvent.visibility && (
								<L18nText
									id={visibility[selectedEvent.visibility]}
									defaultMessage={selectedEvent.visibility}
								/>
							)}
						</p>
						<p>
							<L18nText id="event_url" defaultMessage="Event Url" />:{' '}
							<span className="text-info">event/preview/{selectedEvent.ref}</span>
						</p>
					</div>
				</div>

				<div className="container-fluid">
					<div className="row">{this.tastings}</div>
				</div>
			</div>
		);
	}

	render() {
		const event = this.event;

		return <div className="container event-details-page">{event}</div>;
	}
}

function mapStateToProps(state) {
	return {
		events: state.events.data,
		selectedEvent: state.selectedEvent,
	};
}

export default connect(mapStateToProps, {fetchSelectedEvent})(withRouter(EventDetails));
