export const subscriptionTab = [
	{
		id: 'basic',
		product_handle: 'basic',
		name: 'basic',
		price: 5,
		intlPrice: 'subscription_5',
	},
	{
		id: 'pro',
		product_handle: 'pro',
		name: 'pro',
		price: 8,
		intlPrice: 'subscription_8',
	},
	{
		id: 'scholar',
		product_handle: 'scholar',
		name: 'scholar',
		price: 10,
		intlPrice: 'subscription_10',
	},
];

export function getHandleForPlanId(id) {
	const product = subscriptionTab.find((i) => i.id === id);
	return product ? product.product_handle : '';
}

export const subscriptionService = [
	{
		title: 'subscription_quick_tasting',
		subHeader: 'subscription_quick_tasting_desc',
		basic: true,
		pro: true,
		scholar: true,
	},
	{
		title: 'subscription_tasting_summary',
		subHeader: 'subscription_tasting_summary_desc',
		basic: true,
		pro: true,
		scholar: true,
	},
	{
		title: 'subscription_my_tasting',
		subHeader: 'subscription_my_tasting_desc',
		basic: true,
		pro: true,
		scholar: true,
	},
	{
		title: 'subscription_event_look_up',
		subHeader: 'subscription_event_look_up_desc',
		basic: true,
		pro: true,
		scholar: true,
	},
	{
		title: 'subscription_profound_tasting',
		subHeader: 'subscription_profound_tasting_desc',
		basic: false,
		pro: true,
		scholar: true,
	},
	{
		title: 'subscription_note_generator',
		subHeader: 'subscription_note_generator_desc',
		basic: false,
		pro: true,
		scholar: true,
	},
	{
		title: 'subscription_wine_scholar',
		subHeader: 'subscription_wine_scholar_desc',
		basic: false,
		pro: false,
		scholar: true,
	},
];
