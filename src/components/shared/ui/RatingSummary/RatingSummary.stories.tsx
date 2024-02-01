import React from 'react';

import RatingSummary from './index';

export default {
	title: 'UI Kit / General / Rating Summary',
	component: RatingSummary,
};

export const normal = () => (
	<RatingSummary
		ratings={[
			{name: 'rating_balance_', value: 45},
			{name: 'finish__', value: 72},
			{name: 'rating_intensity__', value: 35},
			{name: 'rating_complexity_', value: 68},
			{name: 'rating_terroir_', value: 53},
		]}
		score={90}
	/>
);
