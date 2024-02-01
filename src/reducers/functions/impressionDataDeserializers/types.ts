export interface ImpressionData {
	ref: string;
	name: string;
	producer: string;
	country: string;
	region: string;
	vintage: string;
	grape: string;
	location: string;
	summary_wine: string;
	summary_personal: string;
	food_pairing: string;
	rating?: {
		// TODO: rating from profound tastings, please add a new unit test when adding support to this
	};
	notes: ImpressionNotes;
	images: string[];
	created_at: string;
	price: number;
	currency: string;
	collection: string;
	metadata?: {
		swa_round_2: boolean;
	};
	clean_key: string;
	producer_key: string;
	country_key: string;
	region_key: string;
	source: string;
	info?: {
		parker_blind: number;
		balance: number;
		finish: number;
		intensity: number;
		complexity: number;
		typicity: number;
		drinkability: number;
		maturity: number;
		value_for_money: number;
		medal?: string;
		recommendation?: string;
	};
	mold: string;
}

export interface ImpressionNotes {
	'@'?: string[];
	nose?: string[];
	palate?: string[];
}

export interface SerializerStep {
	key: string;
	data: SerializerStepSetting | SerializerStepSetting[];
}

export interface SerializerStepSetting {
	name: string;
	subtitle: string;
	breadcrumb: string;
	isMultiple: boolean;
	keys: string[];
}

export interface TastingSource {
	[key: string]: string[];
}

export interface TastingSteps {
	[key: string]: TastingStepSetting;
}

export interface TastingStepSetting {
	subSteps: TastingSubSteps;
	isSubStep: boolean;
}

export interface TastingSubSteps {
	[key: string]: TastingStepState;
}

export interface TastingStepState {
	data: {
		selections: TastingStepSelection[];
		activeSelection?: TastingStepSelection;
	};
}

export interface TastingStepSelection {
	key: string;
	activeOption: string | string[];
	options: string[];
	isActive: boolean;
	hideSelection?: boolean;
	hiddenOptions?: string | string[];
}

export interface TastingSelectedItems {
	impressionRef: string;
	appearance: {
		winetype_?: string;
		color_?: string;
	};
	comments: {
		personal_location: string;
		wine_personal: string;
		food_pairing: string;
	};
	info: {
		tasting_name: string;
		tasting_country: string;
		tasting_region: string;
		tasting_producer: string;
		tasting_vintage: string;
		tasting_grape: string;
		tasting_price: number;
		tasting_currency: string;
		tasting_location: string;
	};
	event: {
		swa_round_2: boolean;
	};
	metadata: {
		medal_page: boolean;
	};
	collection: {
		id: string;
		mold: string;
	};
	nose: {
		notes_white_: string[];
	};
	characteristics: {
		sweetness__: string;
		acidity__: string;
		tannins__: string;
		alcohol__: string;
		body__: string;
	};
	observations: {
		readiness__: string;
		quality__: string;
	};
	rating: {
		rating_balance_: number;
		rating_balance_touched: boolean;
		rating_finish__: number;
		rating_finish__touched: boolean;
		rating_intensity__: number;
		rating_intensity__touched: boolean;
		rating_complexity_: number;
		rating_complexity_touched: boolean;
		rating_typicity_: number;
		rating_typicity_touched: boolean;
		rating_drinkability_: number;
		rating_drinkability_touched: boolean;
		rating_maturity_: number;
		rating_maturity_touched: boolean;
		rating_value_for_money_: number;
		rating_value_for_money_touched: boolean;
		previous_quality: string;
	};
	medal: {
		selectedMedal: string;
	};
}
