import React from 'react';

import Grid from '../Grid';
import WineInfo from './index';

import 'main.scss';

export default {
	title: 'UI Kit / General / Wine Info',
	component: WineInfo,
};

export const normal = () => (
	<Grid columns={5}>
		<WineInfo
			name="Palacio de Anglona Tempranillo"
			producer="Hombre"
			vintage={2008}
			score={97}
			region="Rioja"
			countryName="Spain"
			price={234}
			currency="EUR"
			location="Avedøre, Denmark"
			date="2019-03-21"
		/>
	</Grid>
);

export const minimalData = () => (
	<Grid columns={5}>
		<WineInfo name="Palacio de Anglona Tempranillo" score={97} />
	</Grid>
);
