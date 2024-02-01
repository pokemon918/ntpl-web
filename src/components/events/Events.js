import {connect} from 'react-redux';
import React, {Component} from 'react';

import {routeConstants} from 'const';
import {Link} from 'react-router-dom';
import Grid from 'components/shared/ui/Grid';
import L18nText from 'components/shared/L18nText';
import Breadcrumb from 'components/shared/ui/Breadcrumb';
import SingleSelector from 'components/shared/ui/SingleSelector';
import {addSelectedEvent, fetchEventsFeatured} from 'actions/eventActions';

import './Events.scss';
import Button from '../shared/ui/Button';
import Spinner from '../shared/ui/Spinner';

class Events extends Component {
	state = {
		isLoading: false,
	};

	componentDidMount() {
		this.initEvents();
	}

	async initEvents() {
		try {
			await this.props.fetchEventsFeatured(this.props.history);
			this.setState({isLoading: false});
		} catch (err) {
			this.setState({isLoading: false});
		}
	}

	navigateToEvent = (event) => {
		this.props.addSelectedEvent(event);
		this.props.history.push(`${routeConstants.EVENT}/${event.ref}`);
	};

	render() {
		const {events} = this.props;
		const {isLoading} = this.state;

		const displayedEvents = events.data
			.filter((ev) => ev && ev.collection && ev.collection.ref)
			.map((ev) => ({
				id: ev.collection.ref,
				...ev,
				...ev.collection,
			}));

		return (
			<div>
				{!displayedEvents.length && (
					<Grid columns={12}>
						<Breadcrumb path="events" />
					</Grid>
				)}
				<Grid columns={5}>
					<div className="Events__Container">
						{!isLoading && (
							<>
								<h1>
									<L18nText id="events" defaultMessage="Events" />
								</h1>

								{!displayedEvents.length && !this.props.events.error && (
									<h2>
										No events at the moment.{' '}
										<Link to={routeConstants.MY_TASTINGS} data-test="navigationTasting">
											Click here
										</Link>{' '}
										to see your tastings
									</h2>
								)}
							</>
						)}

						{isLoading && (
							<div className="Spinner_Wrap">
								<Spinner />
							</div>
						)}

						{events.error && (
							<div className="MyEvents__Error">
								{this.props.events.errorMyEvents && !isLoading && (
									<>
										<div className="MyEvents__Error_Title">
											<L18nText
												id="event_fetch_rejected"
												defaultMessage="Failed to load your events!"
											/>
										</div>

										<Button onHandleClick={this.initEvents.bind(this)}>
											<L18nText id="try_again" defaultMessage="Try Again" />
										</Button>
									</>
								)}
							</div>
						)}

						<div className="Events__Item">
							<SingleSelector
								type="event"
								items={displayedEvents}
								renderSubHeader={(ev) => ev.meta_info}
								renderDescription={(ev) => ev.sub_header /*describeEventDate(ev)*/}
								onSelect={this.navigateToEvent}
								hideArrow={true}
							/>
						</div>
					</div>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		wines: state.wines,
		events: state.events,
	};
}

export default connect(mapStateToProps, {addSelectedEvent, fetchEventsFeatured})(Events);
