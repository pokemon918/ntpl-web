import React from 'react';

import LoremIpsum from 'stories/components/LoremIpsum';

import Accordion from './index';

export default {
	title: 'UI Kit / General / Accordion',
	component: Accordion,
};

export const normal = () => (
	<Accordion
		children={
			<div>
				<LoremIpsum />
				<LoremIpsum />
			</div>
		}
		expandText={'Collapse choices from this tasting'}
		collapseText={'See all choices from this tasting'}
	/>
);
