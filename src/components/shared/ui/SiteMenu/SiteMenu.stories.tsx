import React from 'react';
import {action} from '@storybook/addon-actions';

import {RouterDecorator} from 'stories/decorators';
import SiteMenu from './index';

export default {
	title: 'UI Kit / General / Site Menu',
	component: SiteMenu,
	decorators: [RouterDecorator],
};

export const notAuthenticated = () => (
	<SiteMenu isOpen closeSideNav={action('Close site menu')} navBar={[]} />
);

export const authenticated = () => (
	<SiteMenu isOpen isAuthenticated closeSideNav={action('Close site menu')} navBar={[]} />
);
