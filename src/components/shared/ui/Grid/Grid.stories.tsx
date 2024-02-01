import React from 'react';

import LoremIpsum from 'stories/components/LoremIpsum';
import Grid from './index';

export default {
	title: 'UI Kit / General / Grid',
	component: Grid,
};

export const normal = () => (
	<Grid>
		Real simple grid component with a default maximum width of 12 columns, which you can scale down
		to limit the space you want a component to take. It's always horizontally aligned to the centre.
		It accepts as many children as you put in and won't break lines. Nothing prevents you from
		putting hundreds of children, it's flexible for the sake of simplicity... All children are
		automatically wrapped under columns with even widths and proper margins between them. Browse the
		examples to take a look.
	</Grid>
);

export const single12Columns = () => (
	<Grid columns={12}>
		<div>One</div>
		<div>Two</div>
		<div>Three</div>
		<div>Four</div>
		<div>Five</div>
		<div>Six</div>
		<div>Seven</div>
		<div>Eight</div>
		<div>Nine</div>
		<div>Ten</div>
		<div>Eleven</div>
		<div>Twelve</div>
	</Grid>
);

export const single6Columns = () => (
	<Grid columns={6}>
		<LoremIpsum />
	</Grid>
);

export const single4Columns = () => (
	<Grid columns={4}>
		<LoremIpsum />
	</Grid>
);

export const hHalf3Columns = () => (
	<Grid columns={6}>
		<LoremIpsum />
		<LoremIpsum />
		<LoremIpsum />
	</Grid>
);

export const half2Columns = () => (
	<Grid columns={6}>
		<LoremIpsum />
		<LoremIpsum />
	</Grid>
);

export const quarter2Columns = () => (
	<Grid columns={4}>
		<LoremIpsum />
		<LoremIpsum />
	</Grid>
);
