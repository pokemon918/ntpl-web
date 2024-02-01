import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import React, {Component} from 'react';
import sortBy from 'sort-by';

import PageHeader from 'components/shared/ui/PageHeader';
import Spinner from 'components/shared/ui/Spinner';
import SearchBar from 'components/shared/ui/SearchBar';
import EventItem from './EventItem';
import ContestItem from './ContestItem';
import EventFeature from './EventFeature';
import ContestFeature from './ContestFeature';
import {fetchEvents, fetchEventsFeatured, addSelectedEvent} from 'actions/eventActions';
import {searchContest} from 'actions/contestActions';
import {compareAsc} from 'date-fns';

import './EventList.scss';
import L18nText from 'components/shared/L18nText';
import {routeConstants} from 'const';
import {isTextInText} from 'components/contest/common';

class EventList extends Component {
	constructor(props) {
		super(props);
		let search = this.props.location.search;
		let params = new URLSearchParams(search);
		let filterKey = params.get('q');

		this.state = {
			event: [],
			search: filterKey,
		};
	}

	async componentDidMount() {
		const {search} = this.state;

		try {
			await this.props.fetchEvents(this.props.history);
			if (search) {
				this.onFilter(search);
			}
			this.props.fetchEventsFeatured(this.props.history);
		} catch (err) {
			this.setState({event: []});
		}
	}

	onFilter = async (search) => {
		const {events = []} = this.props;
		const searchValue = search.toLowerCase();

		if (search) {
			this.props.searchContest(search);
		}

		this.setState({
			events: events.filter((event) => event.name.toLowerCase().includes(searchValue)),
			search,
		});
	};

	navigateToEvent = (event) => {
		this.props.addSelectedEvent(event);
		this.props.history.push(`${routeConstants.EVENT}/${event.ref}`);
	};

	navigateToContest = (contest) => {
		this.props.history.push(`/contest/${contest.ref}`);
	};

	render() {
		const {search} = this.state;
		const {events = [], featuredEvents = {}, isLoading, contest, serverUrl} = this.props;

		let featured = {events: [], contests: [], ...featuredEvents};

		//Show only active feature event
		featured.events = featured.events
			.filter((event) => {
				if (compareAsc(new Date(), new Date(event.feature_start)) > 0) {
					return event;
				}

				return false;
			})
			.filter((event) => {
				if (compareAsc(new Date(event.feature_end), new Date()) > 0) {
					return event;
				}
				return false;
			});

		const eventList = this.state.events || events;

		return (
			<div className="EventList__Wrapper">
				<PageHeader title="events" description="event_description">
					<SearchBar placeholder="event_find" onHandleChange={this.onFilter} value={search} />
				</PageHeader>
				<div className="EventList__Content">
					<div className="EventList__Items">
						{contest && search && (
							<ContestItem
								contest={contest}
								onHandleChange={this.navigateToContest}
								serverUrl={serverUrl}
							/>
						)}
						{eventList &&
							eventList
								.sort(sortBy('start_date', 'name'))
								.filter((el) => !this.state.search || isTextInText(this.state.search, el.name))
								.map((event) => <EventItem event={event} onHandleChange={this.navigateToEvent} />)}

						{this.state.search && !eventList.length && (
							<div class="EventList__Empty links">
								<p>Please refine your search.</p>
							</div>
						)}

						{!this.state.search && !eventList.length && (
							<div class="EventList__Empty links">
								<p>
									<L18nText id="wine_no_event" defaultMessage="Search for an event or" />
									&nbsp;
									<Link to={routeConstants.TASTING}>
										<L18nText id="wine_click_here" defaultMessage="Click here" />
									</Link>
									&nbsp;
									<L18nText id="wine_start_new" defaultMessage="to start a new tasting." />
								</p>
							</div>
						)}

						{isLoading && (
							<div className="Spinner_Wrap">
								<Spinner />
							</div>
						)}
					</div>
					{0 < featured.events.length + featured.contests.length && (
						<div className="EventList__Features">
							<h3>
								<L18nText id="event_featured" defaultMessage="Featured Events" />
							</h3>

							{featured.contests.map((contest) => (
								<ContestFeature
									contest={contest}
									onHandleChange={this.navigateToContest}
									serverUrl={serverUrl}
								/>
							))}
							{featured.events.map((event) => (
								<EventFeature event={event} onHandleChange={this.navigateToEvent} />
							))}
							{null && isLoading && (
								<div className="Spinner_Wrap">
									<Spinner />
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		contest: state.contest.searchedContest,
		userData: state.user.userData,
		events: state.events.data,
		isLoading: state.events.isLoading,
		serverUrl: state.app.advancedOptions.serverUrl,
		featuredEvents: state.events.featuredEvents,
	};
}

export default connect(mapStateToProps, {
	addSelectedEvent,
	fetchEvents,
	fetchEventsFeatured,
	searchContest,
})(EventList);
