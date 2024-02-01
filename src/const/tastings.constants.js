const ENABLED_TASTING_TYPES = [
	{
		id: 'quick',
		name: 'tasting_type_quick_name',
		subHeader: 'tasting_type_quick_time',
		description: 'tasting_type_quick_description',
		group: 'tasting_group_noteable',
		plans: ['basic', 'pro', 'scholar'],
	},
	{
		id: 'profound',
		name: 'tasting_type_profound_name',
		subHeader: 'tasting_type_profound_time',
		description: 'tasting_type_profound_description',
		group: 'tasting_group_noteable',
		plans: ['pro', 'scholar'],
	},
	{
		id: 'profoundMobile',
		name: 'tasting_type_profound_name',
		subHeader: 'tasting_type_profound_time',
		description: 'tasting_type_profound_description',
		group: 'tasting_group_noteable',
		plans: ['pro', 'scholar'],
	},
	{
		id: 'scholar2',
		name: 'tasting_type_scholar2_name',
		subHeader: '',
		description: '',
		group: 'tasting_group_scholar',
		plans: ['scholar'],
	},
	{
		id: 'scholar2m',
		name: 'tasting_type_scholar2_name',
		subHeader: '',
		description: '',
		group: 'tasting_group_scholar',
		plans: ['scholar'],
	},
	{
		id: 'scholar3',
		name: 'tasting_type_scholar3_name',
		subHeader: '',
		description: '',
		group: 'tasting_group_scholar',
		plans: ['scholar'],
	},
	{
		id: 'scholar3m',
		name: 'tasting_type_scholar3_name',
		subHeader: '',
		description: '',
		group: 'tasting_group_scholar',
		plans: ['scholar'],
	},
	{
		id: 'scholar4',
		name: 'tasting_type_scholar4_name',
		subHeader: '',
		description: '',
		group: 'tasting_group_scholar',
		plans: ['scholar'],
	},
	{
		id: 'scholar4m',
		name: 'tasting_type_scholar4_name',
		subHeader: '',
		description: '',
		group: 'tasting_group_scholar',
		plans: ['scholar'],
	},
];

const COLORS_HIDDEN_PER_WINETYPE = {
	type_sherry_: ['nuance_red', 'nuance_orange', 'nuance_rose'],
	type_port: ['nuance_orange'],
};

const tastingsConstants = {
	CREATE_START: 'CREATE_TASTING_START',
	CREATE_FULFILLED: 'CREATE_TASTING_FULFILLED',
	CREATE_ERROR: 'CREATE_TASTING_ERROR',

	DELETE_TASTING_PENDING: 'DELETE_TASTING_PENDING',
	DELETE_TASTING_FULFILLED: 'DELETE_TASTING_FULFILLED',
	DELETE_TASTING_REJECTED: 'DELETE_TASTING_REJECTED',

	// tasting
	ENABLED_TASTING_TYPES,
	COLORS_HIDDEN_PER_WINETYPE,
	LIGHT: 'light',
	PROFOUND: 'profound',
	NECTAR: 'nectar',
	QUICK: 'quick',
	SWA20: 'swa20',
	SCHOLAR2: 'scholar2',
	SCHOLAR3: 'scholar3',
	SCHOLAR4: 'scholar4',
	DEFAULT_EVENT_TASTING_TYPE: 'quick',
};

export default tastingsConstants;
