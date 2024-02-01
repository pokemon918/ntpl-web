export interface TastingSetupFactory {
	[key: string]: (data: any) => TastingSetupParameters;
}

export interface TastingSetupParameters {
	tastingSrc: any;
	steps: {
		[key: string]: any;
	};
}
