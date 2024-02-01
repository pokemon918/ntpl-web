import React from 'react';
import SplashScreen from '.';
import {action} from '@storybook/addon-actions';

export default {
	title: 'UI Kit / General / Splash Screen',
	component: SplashScreen,
};

export const normal = () => (
	<SplashScreen text="Enjoy a fast tasting" onNavigation={action('Navigation completed')} />
);
