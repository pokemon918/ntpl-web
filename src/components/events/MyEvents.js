import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import React, {Component} from 'react';
import {FaPlusCircle} from 'react-icons/fa';
import {MdEvent} from 'react-icons/md';

import {routeConstants} from 'const';
import {CreateEventModal} from './partials';
import {fetchMyEvents, addEvent, addEventImage} from 'actions/eventActions';

import './MyEvents.scss';
import L18nText from 'components/shared/L18nText';
import Button from '../shared/ui/Button';
import Spinner from '../shared/ui/Spinner';

class MyEvents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			isLoading: false,
			nameCreatedEvent: '',
			pictureCreatedEvent: '',
		};
		this.toggle = this.toggle.bind(this);
		this.saveEvent = this.saveEvent.bind(this);
	}

	componentDidMount() {
		this.initEvents();
	}

	async initEvents() {
		try {
			this.setState({isLoading: false});
			await this.props.fetchMyEvents(this.props.history);
			this.setState({isLoading: false});
		} catch (err) {
			this.setState({isLoading: false});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.createdEventRef !== prevProps.createdEventRef) {
			if (
				!this.props.events.error &&
				this.state.pictureCreatedEvent &&
				this.props.createdEventRef
			) {
				let formData = new FormData();
				formData.append('avatar', this.state.pictureCreatedEvent);
				formData.append('name', this.state.nameCreatedEvent);

				this.props.addEventImage(this.props.createdEventRef, formData);

				this.setState({
					pictureCreatedEvent: '',
					nameCreatedEvent: '',
				});
			}
		}
	}

	toggle() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	async saveEvent(eventData, saveCallback = null) {
		const avatar = eventData.avatar;

		delete eventData.avatar;

		let addEventCallback = () => {
			if (saveCallback) {
				saveCallback();
			}
			this.toggle();
		};

		this.setState({
			pictureCreatedEvent: avatar,
			nameCreatedEvent: eventData.name,
		});

		await this.props.addEvent(eventData, addEventCallback, this.props.history);
	}

	get events() {
		const {events} = this.props;
		const {isLoading} = this.state;

		let content = null;

		if (events.myEvents && events.myEvents.length <= 0 && events.error === null) {
			content = (
				<div className="EventList__Empty">
					<L18nText id="event_no_events" defaultMessage="No events" />
				</div>
			);
		}

		if (events.errorMyEvents) {
			content = (
				<div className="MyEvents__Error">
					{this.props.events.errorMyEvents && !isLoading && (
						<>
							<div className="MyEvents__Error_Title">
								<L18nText id="event_fetch_rejected" defaultMessage="Failed to load your events!" />
							</div>

							<Button onHandleClick={this.initEvents.bind(this)}>
								<L18nText id="try_again" defaultMessage="Try Again" />
							</Button>
						</>
					)}
				</div>
			);
		}

		if (events.myEvents && events.myEvents.length > 0) {
			content = (
				<div>
					{events.myEvents.map((event, i) => {
						return (
							<Link key={i} to={`${routeConstants.EVENT}/${event.ref}`}>
								<div className="MyEvents__Item">{event.name}</div>
							</Link>
						);
					})}
				</div>
			);
		}

		return content;
	}

	render() {
		const {wines} = this.props;
		const {isLoading} = this.state;
		const winesData = wines.data || [];
		const eventWines = winesData.map((wine) => {
			return {
				value: wine.ref,
				label: wine.name,
			};
		});

		return (
			<div className="container my-events-page">
				<h1 className="title clearfix">
					<L18nText id="event_title" defaultMessage="My Events" />
					<Link to={routeConstants.EVENTS} className={'btn btn-primary create-event-btn'}>
						<L18nText id="event_attend_button" defaultMessage="Attend Event" />{' '}
						<MdEvent className="arrow-icon" />
					</Link>
					<button className={'btn btn-primary create-event-btn'} onClick={() => this.toggle()}>
						<L18nText id="event_create_button" defaultMessage="Create Event" />{' '}
						<FaPlusCircle className="arrow-icon" />
					</button>
				</h1>
				{this.props.events.errorMyEvents && this.props.loading && (
					<div className="Spinner_Wrap">
						<Spinner />
					</div>
				)}
				{this.events}
				<CreateEventModal
					isOpen={this.state.modal}
					saveCallback={this.saveEvent}
					toggle={this.toggle}
					eventWines={eventWines}
					isSaving={isLoading}
				/>
			</div>
		);
	}
}

MyEvents.defaultProps = {
	events: {data: []},
	wines: {data: []},
	fetchMyEvents: () => {},
};

export {MyEvents as UnconnectedMyEvents};

function mapStateToProps(state) {
	return {
		app: state.app,
		wines: state.wines,
		events: state.events,
		createdEventRef: state.events.createdEventRef,
	};
}

export default connect(mapStateToProps, {fetchMyEvents, addEvent, addEventImage})(MyEvents);
