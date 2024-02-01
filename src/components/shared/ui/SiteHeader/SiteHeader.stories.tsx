import React from 'react';
import {action} from '@storybook/addon-actions';

import {RouterDecorator} from 'stories/decorators';
import {SiteHeader} from './index';

export default {
	title: 'UI Kit / General / Site Header',
	component: SiteHeader,
	decorators: [RouterDecorator],
};

export const normal = () => <SiteHeader onMenuClick={action('Menu clicked')} />;

export const onlyHamburgerMenu = () => (
	<SiteHeader onMenuClick={action('Menu clicked')} isOnlyHamburgerView />
);
