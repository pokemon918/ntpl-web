import React from 'react';

import LoremIpsum from 'stories/components/LoremIpsum';
import {RouterDecorator} from 'stories/decorators';
import {normal as siteHeaderStory} from '../SiteHeader/SiteHeader.stories';
import SplitScreen from './index';

export default {
	title: 'UI Kit / General / Split Screen',
	component: SplitScreen,
	decorators: [RouterDecorator],
};

export const normal = () => (
	<div>
		{siteHeaderStory()}
		<SplitScreen upperChildren={<LoremIpsum />} lowerChildren={<LoremIpsum />} />
	</div>
);
