import React from 'react';
import {action} from '@storybook/addon-actions';

import Grid from '../Grid';
import WineList from './index';

export default {
	title: 'UI Kit / General / Wine List',
	component: WineList,
};

const winesListItems = [
	{
		ref: '111',
		name: 'Niederhauser Felsensteyer Riesling Spatlese',
		producer: 'Crusius',
		vintage: 2008,
		region: 'Nahe',
		price: 100,
		currency: 'EUR',
		country: 'Germany',
		created_at: '2019-03-21',
		rating: {final_points: 97},
	},
	{
		ref: '222',
		name: 'Eitelsbacher Karthauserhofberg Riesling Trockenbeerenauslese Auktion Nr20',
		producer: 'Karthauserhof',
		vintage: 1999,
		region: 'Mosel',
		price: 200,
		currency: 'EUR',
		country: 'Germany',
		location: 'Hjemme hos Karsten',
		created_at: '2019-03-21',
		rating: {final_points: 85},
	},
	{
		ref: '333',
		name: 'Palacio de Anglona Tempranillo',
		producer: 'Hombre',
		vintage: 2008,
		region: 'Rioja',
		price: 300,
		currency: 'EUR',
		country: 'Spain',
		location: 'Avedøre, Denmark',
		created_at: '2019-03-21',
		rating: {final_points: 69},
	},
];

export const normal = () => (
	<Grid columns={5}>
		<WineList wines={winesListItems} onClickWine={action('Clicked')} />
	</Grid>
);
