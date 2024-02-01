import {UnifiedNumberFormat} from '@formatjs/intl-unified-numberformat';

export interface IWinesStore {
	data: [];
	isLoading: boolean;
	error: string;
	sortBy: string;
}

export interface IWineResponse {
	ref: string;
	name: string;
	producer: string;
	country: string;
	region: string;
	vintage: number;
	location?: string;
	grape?: string;
	summary_wine?: string;
	summary_personal?: string;
	drinkability?: string;
	maturity?: string;
	rating?: {
		final_points?: number;
		balance?: number;
		length?: number;
		intensity?: number;
		terroir?: number;
		complexity?: number;
	};
	notes?: {
		'@': string[];
	};
	images?: [];
	created_at?: string;
	price?: number;
	currency?: string;
	collection?: string;
	metadata?: {};
	clean_key?: string;
	producer_key?: string;
	country_key?: string;
	region_key?: string;
	source?: string;
}
