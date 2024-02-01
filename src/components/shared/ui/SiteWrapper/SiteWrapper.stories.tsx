import React from 'react';

import LoremIpsum from 'stories/components/LoremIpsum';
import {RouterDecorator} from 'stories/decorators';
import {UnconnectedSiteWrapper as SiteWrapper} from './index';

export default {
	title: 'UI Kit / General / Site Wrapper',
	component: SiteWrapper,
	decorators: [RouterDecorator],
};

export const withData = () => (
	<SiteWrapper hasData navBar={[]}>
		<LoremIpsum count={5} />
	</SiteWrapper>
);

export const withText = () => (
	<SiteWrapper navBar={[]}>
		<LoremIpsum count={10} />
	</SiteWrapper>
);
