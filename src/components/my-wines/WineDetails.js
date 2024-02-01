import React, {Component} from 'react';
import {parse} from 'query-string';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {FaPencilAlt, FaTrash} from 'react-icons/fa';
import get from 'lodash/get';

import {reverseImmutable, getLinkWithArguments, removeExtraBlankLines} from 'commons/commons';
import {routeConstants} from 'const';
import {selectImpressionForEditing} from 'actions/multiStepFormActions';
import {markTasting, unmarkTasting} from 'actions/userActions';
import {deleteTastings} from 'actions/tastingActions';
import Grid from 'components/shared/ui/Grid';
import Modal from 'components/shared/ui/Modal';
import DialogBox from 'components/shared/ui/DialogBox';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import Spinner from 'components/shared/ui/Spinner';
import {fetchSelectedWine} from 'actions/wineActions';
import WineInfo from 'components/shared/ui/WineInfo';
import RatingSummary from 'components/shared/ui/RatingSummary';
import CharacteristicsSummary from 'components/shared/ui/CharacteristicsSummary';

import level3 from 'assets/json/tasting/level3.json';
import quick from 'assets/json/tasting/quick/quick.json';
import swa20 from 'assets/json/tasting/swa20/swa20.json';
import scholar2 from 'assets/json/tasting/scholar2/scholar2.json';
import scholar3 from 'assets/json/tasting/scholar3/scholar3.json';
import scholar4 from 'assets/json/tasting/scholar4/scholar4.json';

import {isScholarView, isSwa20} from 'components/tasting/common';

import {unMarkLoadingSelector, markLoadingSelector} from 'reducers/userReducer';

import {WineEssentials} from './partials';
import './WineDetails.scss';

const personalRating = ['drinkability', 'maturity'];

const flattenNotes = (notesLists) => Object.values(notesLists).flatMap((note) => note);

const otherObservation = [
	'note_legstears',
	'note_deposit',
	'note_petillance',
	'note_bubbles',
	'trait_oily',
	'trait_creamy',
	'trait_austere',
	'trait_luscious',
	'trait_petillance',
];

const getSource = {
	profound: level3,
	profoundMobile: level3,
	quick: quick,
	swa20,
	scholar2: scholar2,
	scholar2m: scholar2,
	scholar3: scholar3,
	scholar3m: scholar3,
	scholar4: scholar4,
	scholar4m: scholar4,
};

class WineDetails extends Component {
	state = {
		event: null,
		windowWidth: window.innerWidth,
		displayDeleteModal: false,
		cannotEdit: false,
	};

	async componentDidMount() {
		const {wine, events, location: {search, pathname} = {}, match: {params = {}} = {}} = this.props;

		this.setState({windowWidth: window.innerWidth});
		window.addEventListener('resize', () => this.setState({windowWidth: window.innerWidth}));

		const {event} = parse(search);
		const wineDetails = wine.find(
			(wineDetail) => wineDetail.ref === params.wineRef || wineDetail.name === params.wineRef
		);
		const eventDetails = events && events.find((event) => event.ref === event);

		this.setState({event: eventDetails || event});
		if (pathname !== routeConstants.NEW_TASTING_RESULT) {
			this.props.fetchSelectedWine(params.wineRef, wineDetails);
		}
	}

	prepareRating(ratings, source) {
		const tastingSrc = getSource[source] || level3;
		let newRatings = Object.assign({}, ratings);
		if (Object.keys(newRatings).includes('final_points')) {
			delete newRatings['final_points'];
			delete newRatings['version'];
		}
		const getOrder = (key) => tastingSrc.rating_.indexOf(key);

		const ratingValue = Object.keys(newRatings)
			.filter((key) => !personalRating.includes(key))
			.map((key) => ({
				name: `rating_${key}_`,
				value: newRatings[key] * 100,
			}))
			.sort((a, b) => getOrder(a.name) - getOrder(b.name));

		return ratingValue;
	}

	preparePersonalRating(ratings, {maturity = 0, drinkability = 0}) {
		let ratingValue = [];

		ratingValue.push(
			{name: `rating_drinkability_`, value: drinkability * 100},
			{name: `rating_maturity_`, value: maturity * 100}
		);

		return ratingValue;
	}

	getMetadataTastingNote = () => {
		const {selectedWine} = this.props;
		const tastingSrc = getSource[selectedWine.data.source];

		if (!selectedWine.data.info || !tastingSrc || !tastingSrc.rating_) {
			return [];
		}

		const {info} = selectedWine.data;

		const ratingKeysFromMetadata = {
			rating_balance_: 'balance',
			rating_finish__: 'finish',
			rating_intensity__: 'intensity',
			rating_complexity_: 'complexity',
			rating_typicity_: 'typicity',
			rating_drinkability_: 'drinkability',
			rating_maturity_: 'maturity',
			rating_value_for_money_: 'value_for_money',
		};

		return tastingSrc.rating_.map((ratingItem) => {
			const key = ratingKeysFromMetadata[ratingItem];
			const value = info[key] || 0;
			return {
				name: ratingItem,
				value: value * 100,
			};
		});
	};

	getMedalInfo = () => {
		const {selectedWine} = this.props;
		const medal = get(selectedWine, 'data.info.medal');
		return medal;
	};

	getRecommendationInfo = () => {
		const {selectedWine} = this.props;
		const recommendation = get(selectedWine, 'data.info.recommendation');
		return recommendation;
	};

	onCloseModal = () => {
		const {event} = this.state;

		const linkUrl = event
			? getLinkWithArguments(routeConstants.EVENT_REF, {
					eventRef: event.ref || event,
			  })
			: routeConstants.TASTING;
		this.props.history.replace(linkUrl);
	};

	onEditTasting = () => {
		const {data} = this.props.selectedWine;
		const {source, ref} = data;

		if (source !== 'swa20') {
			this.setState({cannotEdit: true});
			return;
		}

		this.props.selectImpressionForEditing(data);
		this.props.history.push(
			getLinkWithArguments(routeConstants.EDIT_TASTING, {
				ref,
				type: source,
			})
		);
	};

	onDeleteTasting = () => {
		this.setState({displayDeleteModal: true});
	};

	confirmDeleteTasting = () => {
		const selectedWine = this.props.selectedWine.data;
		this.props.deleteTastings(selectedWine.ref);
		this.props.history.replace(routeConstants.MY_TASTINGS);
	};

	cancelDeleteTasting = () => {
		this.setState({displayDeleteModal: false});
	};

	handleToggleChosen = (wineRef, isChosen) => {
		let elements = [...document.getElementsByClassName('WineInfo__ChosenMark')];
		elements.map((el) => el.classList.remove('show'));

		if (isChosen) {
			this.props.markTasting(wineRef, () => elements.map((el) => el.classList.add('show')));
		} else {
			this.props.unmarkTasting(wineRef, () => elements.map((el) => el.classList.add('show')));
		}
	};

	prepareCharacteristics(notes, source) {
		const flattenedNotes = flattenNotes(notes);
		if (!Array.isArray(flattenedNotes)) return [];
		const characteristicKeys = [
			'sweetness__',
			'acidity__',
			'tannins__',
			'alcohol__',
			'body__',
			'mousse__',
			'flavourintensity__',
			'finish__',
		];

		const tastingSrc = getSource[source] || level3;
		const characteristicValues = {
			sweetness__: tastingSrc['sweetness__'],
			acidity__: tastingSrc['acidity__'],
			tannins__: tastingSrc['tannins__'],
			alcohol__: tastingSrc['alcohol__'],
			body__: tastingSrc['body__'],
			finish__: tastingSrc['finish__'],
			mousse__: tastingSrc['mousse__'],
			flavourintensity__: tastingSrc['flavourintensity__'],
		};

		let payload = [];

		characteristicKeys.map((characteristic) => {
			return (
				characteristicValues[characteristic] &&
				characteristicValues[characteristic]
					.filter((item, key) => flattenedNotes.includes(item))
					.forEach((item, key) => {
						const data = reverseImmutable(characteristicValues[characteristic]);
						const hasNone = data.find((item) => item.includes('_none'));
						const steps = hasNone ? data.length - 1 : data.length;
						const value = item.includes('_none')
							? null
							: hasNone
							? data.indexOf(item)
							: data.indexOf(item) + 1;

						payload.push({
							name: characteristic,
							steps: steps,
							value: value,
						});
					})
			);
		});
		return payload;
	}

	get wine() {
		const {isLoading} = this.props.selectedWine ?? {};
		const selectedWine = this.props.selectedWine?.data ?? {};
		const selectedWineInfo = selectedWine?.info ?? {};
		const selectedWineError = this.props.selectedWine?.error;
		const {event, displayDeleteModal} = this.state;
		const {location, match, user, unMarkLoading, markLoading} = this.props;

		const linkUrl = event ? `/event/${event.ref || event}` : routeConstants.MY_TASTINGS;
		const isTastingResult =
			location?.pathname === routeConstants.TASTING_RESULT + '/' + match?.params?.wineRef;

		let preparedRatings = null;
		let preparePersonalRating = null;
		let prepareCharacteristicsRating = null;

		prepareCharacteristicsRating =
			(selectedWine &&
				selectedWine.notes &&
				this.prepareCharacteristics(selectedWine.notes, selectedWine.source)) ||
			[];

		let featuredImage = '';
		let notes = selectedWine && selectedWine.notes;
		const otherNotes =
			(notes && notes.nose && notes.nose.filter((note) => otherObservation.includes(note))) || [];
		const otherPalate =
			(notes && notes.palate && notes.palate.filter((note) => otherObservation.includes(note))) ||
			[];
		const prepareOtherObservations = otherNotes.concat(otherPalate);

		const generalNotes = get(notes, '@', []);
		const readiness = generalNotes.find((i) => i.startsWith('readiness_'));
		const quality = generalNotes.find((i) => i.startsWith('quality_'));

		const medal = this.getMedalInfo();
		const recommendation = this.getRecommendationInfo();
		const isRound2 = get(selectedWine, 'metadata.swa_round_2', false);

		if (selectedWine && selectedWine.rating) {
			preparedRatings = this.prepareRating(selectedWine.rating, selectedWine.source);
			preparePersonalRating = this.preparePersonalRating(selectedWine.rating, {
				maturity: selectedWineInfo.maturity,
				drinkability: selectedWineInfo.drinkability,
			});
		}

		if (selectedWine && selectedWine.images && selectedWine.images.length > 0) {
			featuredImage = selectedWine.images[0];
		}

		const hasData = selectedWine;
		const createdDate = hasData && selectedWine.created_at;
		let tastingNote = selectedWine
			? selectedWine.summary_wine || selectedWine.summary_personal
			: '';
		tastingNote = tastingNote && tastingNote.replace('\r', '').replace(/\n{3,}/g, '\n\n');
		const foodPairing = removeExtraBlankLines(selectedWine ? selectedWine.food_pairing : null);
		const justCreatedTasting = location?.pathname.startsWith(routeConstants.NEW_TASTING_RESULT);

		const summary_personal =
			selectedWine &&
			selectedWine.summary_personal &&
			selectedWine.summary_personal.replace('\r', '').replace(/\n{3,}/g, '\n\n');

		return (
			<Modal
				onClose={this.onCloseModal}
				title={'tasting_summary'}
				body={
					<div className="container wine-details mx-10">
						<Modal.Breadcrumb path="nav_myTasting / tasting_summary" />
						{isLoading && <Spinner />}
						{hasData && (
							<Grid columns={6}>
								<div className="WineDetails__Wrapper">
									<WineInfo
										image={featuredImage}
										name={selectedWine.name}
										price={selectedWine.price}
										updatedRef={selectedWine.updatedRef}
										currency={selectedWine.currency}
										producer={selectedWine.producer}
										vintage={selectedWine.vintage}
										region={selectedWine.region}
										score={selectedWine.rating ? selectedWine.rating.final_points : 0}
										countryKey={selectedWine.country_key}
										countryName={selectedWine.country}
										date={createdDate}
										isLoading={unMarkLoading === 'loading' || markLoading === 'loading'}
										location={selectedWine.location}
										isChosen={user?.markedTastings?.[selectedWine.ref]}
										handleToggleChosen={(isChosen) =>
											this.handleToggleChosen(selectedWine.ref, isChosen)
										}
									/>
									<div className="WineDetails__Item">
										{preparedRatings && preparedRatings.length > 0 && (
											<RatingSummary ratings={preparedRatings} hideScore={false} />
										)}
									</div>
									{prepareCharacteristicsRating.length > 0 && (
										<div className="WineDetails__Item">
											<CharacteristicsSummary characteristics={prepareCharacteristicsRating} />
										</div>
									)}
									<div className="WineDetails__Item">
										<div className="WineDetails__Text__Wrapper">
											<header>
												<L18nText id="tasting_note" defaultMessage="Tasting Note" />
											</header>
											<div className="WineDetails__Item_Content">{tastingNote || '-'}</div>
										</div>
									</div>

									{isRound2 && (
										<div className="WineDetails__Item">
											<div className="WineDetails__Text__Wrapper">
												<header>
													<L18nText id="tasting_food_pairing" />
												</header>
												<div className="WineDetails__Item_Content">{foodPairing || '-'}</div>
											</div>
										</div>
									)}

									<div className="WineDetails__Item">
										<div className="WineDetails__Text__Wrapper">
											<header>
												<L18nText id="wine_essentials" defaultMessage="Essentials" />
											</header>
											<WineEssentials
												features={selectedWine.notes}
												metadata={selectedWine.metadata}
												otherObservations={prepareOtherObservations}
											/>
										</div>
									</div>
									{!isScholarView(selectedWine.source) && !isSwa20(selectedWine.source) && (
										<>
											<header>
												<L18nText id="tasting_personal_notes" defaultMessage="Personal Notes" />
											</header>
											{selectedWine.summary_personal && (
												<div className="WineDetails__Item">
													<div className="WineDetails__Text__Wrapper">
														<p>{summary_personal}</p>
													</div>
												</div>
											)}
											<div>
												<RatingSummary ratings={preparePersonalRating} hideHeader={true} />
											</div>
										</>
									)}
									{isSwa20(selectedWine.source) && (
										<>
											<header>
												<L18nText id="rating_your_rating" />
											</header>
											<div>
												<RatingSummary ratings={this.getMetadataTastingNote()} hideHeader />
											</div>
											<div className="WineDetails__FeatureList">
												<div className="WineDetails__FeatureItem">
													<label>
														<L18nText id="readiness__" />
													</label>
													<span>
														<L18nText id={readiness} />
													</span>
												</div>
												<div className="WineDetails__FeatureItem">
													<label>
														<L18nText id="rating_quality__" />
													</label>
													<span>
														<L18nText id={quality} />
													</span>
												</div>
												{medal && (
													<div className="WineDetails__FeatureItem">
														<label>
															<span className="LabelMargin">
																<L18nText id="tasting_medal" />
															</span>
														</label>
														<span>
															<L18nText id={`tasting_medal_${medal}`} />
														</span>
													</div>
												)}
												{recommendation && (
													<div className="WineDetails__FeatureItem">
														<label>
															<span className="LabelMargin">
																<L18nText id="tasting_recommendation" />
															</span>
														</label>
														<span>
															<L18nText id={`tasting_recommendation_${recommendation}`} />
														</span>
													</div>
												)}
											</div>
										</>
									)}
									<div className="WineDetails__FooterActions">
										<div className="WineDetails__ActionButtons">
											{!justCreatedTasting && (
												<Button
													variant="icon"
													infoKey="deleteTasting"
													onHandleClick={this.onDeleteTasting}
												>
													<FaTrash />
												</Button>
											)}
										</div>
										{displayDeleteModal && (
											<L18nText
												id="tasting_delete_confirmation"
												values={{wineName: selectedWine.name, wineVintage: selectedWine.vintage}}
											>
												{(confirmationText) => (
													<DialogBox
														title="tasting_delete_title"
														description={confirmationText}
														yesCallback={this.confirmDeleteTasting}
														noCallback={this.cancelDeleteTasting}
													/>
												)}
											</L18nText>
										)}
									</div>
								</div>
							</Grid>
						)}
						{selectedWineError && (
							<Grid columns={6}>
								<div className="WineDetail__Error">
									<L18nText
										id="error_connection_request"
										defaultMessage="An error occurred while processing your request."
									/>
									<div className="MyWines__Text">
										Please <Link to={routeConstants.MY_TASTINGS}>click here</Link> to view all your
										tastings.
									</div>
								</div>
							</Grid>
						)}
					</div>
				}
				footer={
					<div className="WineDetails__Footer">
						{isLoading ? (
							<div className="center mx-10">
								<Button variant="default" disabled={true}>
									<L18nText id="app_loading" defaultMessage={'Loading'} />
								</Button>
							</div>
						) : (
							<div>
								{isTastingResult ? (
									<div className="center mx-10">
										<div className={'done-btn'} data-test="doneBtn">
											<div className="center">
												<Link to={linkUrl} className="Button Button__Default" data-test="allWines">
													<L18nText id="wine_event" defaultMessage="Done">
														{(eventText) => (
															<L18nText
																id={event ? 'wine_back_to_event_name' : 'tasting_done_button'}
																defaultMessage="Done"
																values={{eventName: (event && event.name) || eventText}}
															/>
														)}
													</L18nText>
												</Link>
											</div>
										</div>
									</div>
								) : (
									<>
										<div className="center mx-10">
											<Button
												variant="default"
												infoKey="backToNewTasting"
												onHandleClick={this.onCloseModal}
											>
												<L18nText
													id={'tasting_back_to_new_tasting'}
													defaultMessage={'New Tasting'}
												/>
											</Button>
										</div>
										{!justCreatedTasting && (
											<Modal.FooterLeft className="mx-10">
												<Button
													variant="icon"
													infoKey="editTasting"
													onHandleClick={this.onEditTasting}
												>
													<FaPencilAlt />
												</Button>
												{this.state.cannotEdit && (
													<DialogBox
														title="app_oops"
														description="tasting_cannot_edit_tasting"
														noCallback={() => this.setState({cannotEdit: false})}
														errorBox
													/>
												)}
											</Modal.FooterLeft>
										)}
									</>
								)}
							</div>
						)}
					</div>
				}
			/>
		);
	}

	render() {
		const wine = this.wine;
		return <div className="my-wines-page">{wine}</div>;
	}
}
function mapStateToProps(state) {
	return {
		user: state.user,
		wine: state.wines.data,
		events: state.events.data,
		selectedEvent: state.selectedEvent,
		selectedWine: state.selectedWine,
		unMarkLoading: unMarkLoadingSelector(state),
		markLoading: markLoadingSelector(state),
	};
}

const mapDispatchToProps = {
	fetchSelectedWine,
	markTasting,
	unmarkTasting,
	deleteTastings,
	selectImpressionForEditing,
};

export {WineDetails as UnconnectedWineDetails};

export default connect(mapStateToProps, mapDispatchToProps)(WineDetails);
