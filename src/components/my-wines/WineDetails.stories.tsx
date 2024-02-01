import React from 'react';
import {action} from '@storybook/addon-actions';

import {RouterDecorator} from 'stories/decorators';
import {UnconnectedWineDetails as WineDetails} from './WineDetails';

export default {
	title: 'Pages / Tasting Summary',
	component: WineDetails,
	decorators: [RouterDecorator],
	parameters: {
		chromatic: {viewports: [320, 1200]},
	},
};

const baseWine = {
	ref: 'fz2rg7zg6',
	name: 'Sample Profound Tasting',
	producer: '',
	country: 'Slovenia',
	region: 'Podravje',
	vintage: 2017,
	grape: 'Red',
	location: 'Imbibe London',
	summary_wine:
		'This wine is clear and has a colour tending towards garnet. The nose is pronounced with pronounced acacia, violet, rose, asparagus, blackcurrant leaf, bread dough, biscuit, toast, cream, butter, cloves, coconut, toast, charred wood, chocolate and resinous aromas. It is a luscious wine with high acidity and high tannin levels. The alcohol level is high, with a full and pronounced intensity of flavour. Flavours of honeysuckle and blossom can be detected and the finish is long.',
	summary_personal: 'The wine colour is really beautiful.',
	food_pairing: 'Really good with parmesan cheese.',
	rating: {
		final_points: 92,
		balance: 0.88,
		length: 0.96,
		intensity: 0.68,
		terroir: 0.91,
		complexity: 0.85,
	},
	notes: {
		'@': [
			'category_still',
			'clarity_clear',
			'colorintensity_deep',
			'nuance_garnet',
			'nuance_red',
			'quality_outstanding',
			'readiness_suitableforbottleageing',
		],
		nose: [
			'condition_clean',
			'development_fullydeveloped',
			'noseintensity_pronounced',
			'note_acacia',
			'note_asparagus',
			'note_biscuit',
			'note_blackcurrant_leaf',
			'note_bread_dough',
			'note_butter',
			'note_chocolate',
			'note_cloves',
			'note_coconut',
			'note_cream',
			'note_resinous',
			'note_rose',
			'note_toast',
			'note_violet',
			'note_wood_charred',
		],
		palate: [
			'acidity_medium',
			'alcohol_low',
			'body_mediumplus',
			'finish_long',
			'note_blossom',
			'note_honeysuckle',
			'palateintensity_pronounced',
			'sweetness_sweet',
			'finish_mediumminus',
		],
	},
	images: [],
	created_at: '2020-06-14T06:54:41.000000Z',
	price: 500,
	currency: 'app_currency_eur',
	clean_key: '',
	producer_key: '',
	country_key: '',
	region_key: '',
	source: 'profound',
	info: {
		drinkability: 0.77,
		maturity: 0.62,
		parker_blind: 92.41766393,
		balance: 0.88,
		finish: 0.96,
		intensity: 0.68,
		typicity: 0.91,
		complexity: 0.85,
		value_for_money: 0.98,
	},
	metadata: {},
	mold: null,
	team: null,
	collection: null,
};

const profoundWine = {
	...baseWine,
	name: 'Profound Tasting',
	source: 'profound',
};

const swa20Round1Wine = {
	...baseWine,
	name: 'SWA20 Round 1 Tasting',
	source: 'swa20',
	info: {
		...baseWine.info,
		recommendation: 'commended',
	},
};

const swa20Round2Wine = {
	...baseWine,
	name: 'SWA20 Round 2 Tasting',
	source: 'swa20',
	metadata: {
		swa_round_2: true,
	},
	info: {
		...baseWine.info,
		medal: 'gold',
	},
};

const getProps = (wine: any) => ({
	user: {},
	wine: [wine],
	selectedWine: {data: wine},
});

const actions = {
	fetchSelectedWine: action('fetchSelectedWine'),
	markTasting: action('markTasting'),
	unmarkTasting: action('unmarkTasting'),
	deleteTastings: action('deleteTastings'),
	selectImpressionForEditing: action('selectImpressionForEditing'),
};

export const profound = () => <WineDetails {...getProps(profoundWine)} {...actions} />;

export const swa20Round1 = () => <WineDetails {...getProps(swa20Round1Wine)} {...actions} />;

export const swa20Round2 = () => <WineDetails {...getProps(swa20Round2Wine)} {...actions} />;
