import React from 'react';
import {action} from '@storybook/addon-actions';

import HeroContainer from './index';

export default {
	title: 'UI Kit / General / Hero Container',
	component: HeroContainer,
};

export const normal = () => <HeroContainer handleMenuClick={action('Menu clicked')} />;

export const sampleText = () => (
	<HeroContainer handleMenuClick={action('Menu clicked')}>
		You can display anything inside the hero container here :)
	</HeroContainer>
);
