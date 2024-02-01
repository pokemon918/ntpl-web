import React from 'react';

import PageHeader from './PageHeader';

export default {
	title: 'UI Kit / General / Page Header',
	component: PageHeader,
};

export const normal = () => (
	<PageHeader title="Page Title" description="Page Description">
		<span style={{margin: 10, color: 'white'}}>Header Addon</span>
	</PageHeader>
);
