import {
	getGeneralNotes,
	filterNotes,
	createNotesFinder,
	getSelectedTrophy,
	hasMedalPage,
} from './helpers';
import {ImpressionData, TastingSelectedItems} from './types';

const DEFAULT_RATING = 0.45; // default value if ratings are missing
const DEFAULT_TOUCHED = true; // whether the rating sliders should show as touched, without the initial animation

export function getSelectedItemsFromImpression(data: ImpressionData): TastingSelectedItems {
	const notes = getGeneralNotes(data.notes);
	const findNote = createNotesFinder(notes);
	const descriptors = notes.filter(filterNotes('notes_'));
	const wineType = notes.find((i) => i.startsWith('category_') || i.startsWith('type_'));
	const wineColor = notes.find((i) => i.startsWith('nuance_') || i.startsWith('color_'));

	return {
		impressionRef: data.ref,
		appearance: {
			winetype_: wineType,
			color_: wineColor,
		},
		comments: {
			personal_location: data.location,
			wine_personal: data.summary_personal,
			food_pairing: data.food_pairing,
		},
		info: {
			tasting_name: data.name,
			tasting_country: data.country,
			tasting_region: data.region,
			tasting_producer: data.producer,
			tasting_vintage: data.vintage,
			tasting_grape: data.grape,
			tasting_price: data.price,
			tasting_currency: data.currency,
			tasting_location: data.location,
		},
		event: {
			swa_round_2: data.metadata?.swa_round_2 ?? false,
		},
		metadata: {
			medal_page: hasMedalPage(data),
		},
		collection: {
			id: data.collection,
			mold: data.mold,
		},
		nose: {
			notes_white_: descriptors,
		},
		characteristics: {
			sweetness__: findNote('sweetness_'),
			acidity__: findNote('acidity_'),
			tannins__: findNote('tannins_'),
			alcohol__: findNote('alcohol_'),
			body__: findNote('body_'),
		},
		observations: {
			readiness__: findNote('readiness_'),
			quality__: findNote('quality_'),
		},
		rating: {
			rating_balance_: data.info?.balance ?? DEFAULT_RATING,
			rating_balance_touched: DEFAULT_TOUCHED,
			rating_finish__: data.info?.finish ?? DEFAULT_RATING,
			rating_finish__touched: DEFAULT_TOUCHED,
			rating_intensity__: data.info?.intensity ?? DEFAULT_RATING,
			rating_intensity__touched: DEFAULT_TOUCHED,
			rating_complexity_: data.info?.complexity ?? DEFAULT_RATING,
			rating_complexity_touched: DEFAULT_TOUCHED,
			rating_typicity_: data.info?.typicity ?? DEFAULT_RATING,
			rating_typicity_touched: DEFAULT_TOUCHED,
			rating_drinkability_: data.info?.drinkability ?? DEFAULT_RATING,
			rating_drinkability_touched: DEFAULT_TOUCHED,
			rating_maturity_: data.info?.maturity ?? DEFAULT_RATING,
			rating_maturity_touched: DEFAULT_TOUCHED,
			rating_value_for_money_: data.info?.value_for_money ?? DEFAULT_RATING,
			rating_value_for_money_touched: DEFAULT_TOUCHED,
			previous_quality: findNote('quality_'),
		},
		medal: {
			selectedMedal: getSelectedTrophy(data),
		},
	};
}
