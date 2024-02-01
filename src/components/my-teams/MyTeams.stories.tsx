import React from 'react';

import {UnconnectedMyTeams as MyTeams} from './MyTeams';
import {RouterDecorator} from 'stories/decorators';

export default {
	title: 'Pages / Teams',
	component: MyTeams,
	decorators: [RouterDecorator],
};

const fixture = [
	{
		name: 'first team',
		ref: 'c3ffxz',
		handle: 'eeee',
		description: '',
		avatar: null,
		city: '',
		country: '',
		created_at: '2020-06-19 03:49:32',
		updated_at: '2020-06-19 03:49:32',
		userRelations: ['creator', 'owner'],
		visibility: 'open',
		type: 'traditional',
		membersCount: 1,
	},
	{
		name: 'second team',
		ref: 'apn8zr',
		handle: 'ffff',
		description: '',
		avatar: null,
		city: '',
		country: '',
		created_at: '2020-06-19 04:10:37',
		updated_at: '2020-06-19 04:10:37',
		userRelations: ['creator', 'owner'],
		visibility: 'open',
		type: 'traditional',
		membersCount: 1,
	},
	{
		name: 'foreign team',
		ref: 'fnrz2c',
		handle: 'fri0132team',
		description: '',
		avatar: null,
		city: '',
		country: '',
		created_at: '2020-06-19 04:33:04',
		updated_at: '2020-06-19 04:33:04',
		userRelations: ['member'],
		visibility: 'open',
		type: 'traditional',
		membersCount: 2,
	},
	{
		name: 'team with image',
		ref: 'nlhd3e',
		handle: 'testimage',
		description: '',
		avatar: 'b2g6dd',
		city: '',
		country: '',
		created_at: '2020-06-19 05:11:23',
		updated_at: '2020-06-19 05:11:23',
		userRelations: ['creator', 'owner'],
		visibility: 'open',
		type: 'traditional',
		membersCount: 1,
	},
];

export const normal = () => <MyTeams teams={{myTeams: fixture}} />;
