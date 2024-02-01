import React from 'react';
import {action} from '@storybook/addon-actions';

import countryRank from 'assets/json/countryRank.json';
import AutoSuggestInput from './index';

export default {
	title: 'UI Kit / Inputs / Auto Suggest Input',
	component: AutoSuggestInput,
};

export const normal = () => (
	<AutoSuggestInput
		label="Country"
		infoName="country"
		items={countryRank}
		valueKey="id"
		displayKey="name"
		onSelectItem={action('onSelectItem')}
	/>
);
