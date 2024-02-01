import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setEventPreventReload} from 'actions/eventActions';
import {fetchWineEvent} from 'actions/wineActions';
import {setTastingType} from 'actions/multiStepFormActions';
import {routeConstants} from 'const';
import {getLinkWithArguments} from 'commons/commons';
import {getSelectedEventMetadata} from 'reducers/selectedEventReducer';
import Button from 'components/shared/ui/Button';
import Grid from 'components/shared/ui/Grid';
import L18nText from 'components/shared/L18nText';
import Modal from 'components/shared/ui/Modal';
import Spinner from 'components/shared/ui/Spinner';
import WineInfo from 'components/shared/ui/WineInfo';

import './SelectEventTasting.scss';

class RedirectEventTasting extends Component {
	componentDidMount() {
		this.loadEventTasting();
	}

	loadEventTasting = async () => {
		await this.props.fetchWineEvent(this.product, this.event, this.client, this.producer);
	};

	navigateToTasting = () => {
		const url = getLinkWithArguments(routeConstants.NEW_TASTING_TYPE, {type: 'quick'});
		this.props.history.replace(`${url}${window.location.search}`);
		this.props.setTastingType('quick', true);
	};

	get event() {
		return new URL(window.location.href).searchParams.get('event');
	}

	get product() {
		return new URL(window.location.href).searchParams.get('product');
	}

	get client() {
		return new URL(window.location.href).searchParams.get('client');
	}

	get producer() {
		return new URL(window.location.href).searchParams.get('producer');
	}

	closeSelectedWineModal = () => {
		const {setEventPreventReload} = this.props;

		setEventPreventReload(true);
		this.props.history.replace(routeConstants.MY_TASTINGS);
	};

	render() {
		const {wineEvent} = this.props;
		const {loading, error, data} = wineEvent;
		return (
			<Modal
				onClose={this.closeSelectedWineModal}
				title={'event_confirm_wine'}
				body={
					<>
						{loading && <Spinner />}
						{!loading && error && (
							<div style={{textAlign: 'center'}}>
								<L18nText id="event_no_wine" defaultMessage="No wine associated with the event" />
							</div>
						)}
						{data && (
							<div className="EventSummary__Selected_Wine container">
								<Grid columns={4}>
									<div
										key={`${data.event.eventId}_${data.product.productId}`}
										className="WineList__Item"
										onClick={this.navigateToTasting}
									>
										<WineInfo
											key={`${data.event.eventId}_${data.product.productId}`}
											image={data.product.imageUrl}
											name={data.product.shortName}
											producer={data.producer.name}
											vintage={data.product.vintage}
											region={data.product.region}
											countryName={data.product.country}
											hideNoVingate={true}
											displayImage={true}
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
			/>
		);
	}
}

function mapStateToProps(state) {
	const eventMetadata = getSelectedEventMetadata(state);
	return {
		tastingShowCaseData: state.events.tastingShowCaseData,
		wineEvent: state.wineEvent,
		eventTastingType: eventMetadata ? eventMetadata.tastingType : null,
	};
}

export default connect(mapStateToProps, {
	setEventPreventReload,
	fetchWineEvent,
	setTastingType,
})(RedirectEventTasting);
