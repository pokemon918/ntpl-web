import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, CardBody, CardImage, CardTitle, CardText} from 'mdbreact';

import {setTastingShowcaseData} from 'actions/eventActions';
import {setTastingType} from 'actions/multiStepFormActions';
import {RatingTotal} from 'components/shared';
import {routeConstants} from 'const';
import {TastingTypeSelectModal} from './partials';

import './EventTastingList.scss';
import L18nText from 'components/shared/L18nText';

class EventTastingList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			selectedTasting: null,
		};
		this.promptTastingSelect = this.promptTastingSelect.bind(this);
		this.toggle = this.toggle.bind(this);
		this.goToTasting = this.goToTasting.bind(this);
	}

	goToTasting(type, selectedTasting) {
		this.props.setTastingType(type);
		this.props.setTastingShowcaseData(type, selectedTasting);
		this.props.history.push(
			`${routeConstants.EVENT}/${this.props.selectedEvent}/${selectedTasting.ref}`
		);
	}

	promptTastingSelect(e, selectedTasting) {
		e.preventDefault();
		this.toggle();
		this.setState({selectedTasting});
	}

	toggle() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	get eventTastings() {
		const eventTastings = this.props.showCaseData.event_tastings;

		let content = null;

		if (eventTastings == null || eventTastings.length <= 0) {
			content = <div>You currently have no eventTastings.</div>;
		}

		if (eventTastings) {
			content = eventTastings.map((wine) => {
				let wineImg = wine.images[0]
					? wine.images[0]
					: require('assets/images/wine-bottle-default.jpg');

				return (
					<div key={wine.ref} className={'wine-list-col col-md-3 mb-3'}>
						<Card className="wine-card" onClick={(e) => this.promptTastingSelect(e, wine)}>
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
									onClick={(e) => this.promptTastingSelect(e, wine)}
									className="btn btn-primary see-more-btn"
								>
									<L18nText id="event_view_tasting" defaultMessage="View Tasting" />
								</button>
								<div className="rating-total-wrapper">
									<RatingTotal showLabel={false} ratings={wine.rating} />
								</div>
							</CardBody>
						</Card>
					</div>
				);
			});
		}

		return content;
	}

	render() {
		return (
			<div className="container event-showcase-page">
				<h1 className="title clearfix">
					<L18nText id="event_showcase" defaultMessage="Event Showcase" />
				</h1>
				<div className="row">{this.eventTastings}</div>
				<TastingTypeSelectModal
					isOpen={this.state.modal}
					saveCallback={this.saveEvent}
					toggle={this.toggle}
					selectedTasting={this.state.selectedTasting}
					selectCallback={this.goToTasting}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		selectedEvent: state.events.selectedEvent,
		showCaseData: state.events.showCaseData,
	};
}

export default connect(mapStateToProps, {setTastingType, setTastingShowcaseData})(EventTastingList);
