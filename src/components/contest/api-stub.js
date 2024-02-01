export const arrival = {
	success: true,
	message: '....',
	data: {
		ref: 'tfyn25z',
		name: 'SWA 2020',
		description: 'A yearly event',
		type: 'contest',
		alias: {
			admin: 'Supervisor',
			leader: 'Team lead',
			guide: 'Senior judge',
			member: 'Judge',
			collection: 'Category',
		},
		admins: [
			{
				name: 'Simon Johnson',
				ref: 'd24ihg93',
			},
			{
				name: 'Amo Duops',
				ref: 'dfdjhkj4h',
			},
		],
		participants: [
			{
				name: 'Nina Kampstrup',
				ref: 'd24ihg93',
				team_ref: '24f3f4',
				role: 'Participant',
				confirmed: '2019-08-04 11:55:31',
			},
			{
				name: 'Rose Rodolfi',
				ref: '774h74h',
			},
			{
				name: 'Uimon Hansen',
				ref: 'd4fwh',
				team_ref: null,
				role: null,
			},
			{
				name: 'Asimon Hansen',
				ref: 'werj4h',
				team_ref: '24f3f4',
				role: 'leader',
			},
			{
				name: 'Simon Hansen',
				ref: 'jhskjd8yshd',
				team_ref: null,
				role: null,
			},
		],
		teams: [
			{
				name: 'SUP',
				ref: '0',
			},
			{
				name: 'Team #1',
				ref: '1',
			},
			{
				name: 'Team #2',
				ref: '2',
			},
			{
				name: 'Team #3',
				ref: '3',
			},
			{
				name: 'Team #4',
				ref: '4',
			},
			{
				name: 'Team #5',
				ref: '5',
			},
			{
				name: 'Team #6',
				ref: '6',
			},
			{
				name: 'Team #7',
				ref: '7',
			},
			{
				name: 'Team #8',
				ref: '8',
			},
			{
				name: 'Team #9',
				ref: '9',
			},
			{
				name: 'Team #10',
				ref: '10',
			},
			{
				name: 'Team #11',
				ref: '11',
			},
			{
				name: 'Team #12',
				ref: '12',
			},
			{
				name: 'Team #13',
				ref: '13',
			},
			{
				name: 'Team #14',
				ref: '14',
			},
			{
				name: 'Team #15',
				ref: '15',
			},
			{
				name: 'Team #16',
				ref: '16',
			},
			{
				name: 'Team #17',
				ref: '17',
			},
			{
				name: 'Team #18',
				ref: '18',
			},
			{
				name: 'Team #19',
				ref: '19',
			},
			{
				name: 'Team #20',
				ref: '20',
			},
		],
	},
};

export const statement = {
	flag: true,
	requested: true,
	statement: 'statement',
	extra_a: 's',
	extra_b: 's',
	extra_c: 's',
	extra_d: 's',
	extra_e: 's',
};

export const team = {
	status: 'sucsses',
	message: '...',
	data: {
		collection: {
			ref: 'jhsdfkj3',
			name: 'Collection A',
		},
		team: {
			ref: 'asdfa',
			name: 'Team awesome',
		},
		subjects: [
			{
				data: {
					name: 'San Agustin',
					producer: 'Wine producer',
					country: 'England',
					region: 'Northern England',
					vintage: '1754',
					grape: 'Cabernet Sauvignon',
					price: 199.99,
					currency: 'DKK',
					clean_key: 'clean',
					producer_key: 'producerkey',
					country_key: 'countrykey',
					region_key: 'regionkey',
					summary_wine: 'This wine is is...',
					summary_personal: 'My personal experience with this is...',
				},
				team_statement: {
					marked_impression: '1',
					flag: false,
					requested: true,
					statement: 'medal',
					extra_a: 'x',
					extra_b: 'y',
					extra_c: 'z',
					extra_d: 'xx',
					extra_e: 'yyy',
				},
				impressions: [
					{
						creator: 'jhskjd8yshd1',
						data: {
							ref: 'sfsdf',
							notes: {
								nose: [
									'condition_clean',
									'noseintensity_mediumplus',
									'development_fullydeveloped',
									'note_acacia',
									'note_chamomile',
									'note_violet',
									'note_tomato_leaf',
									'note_asparagus',
								],
								palate: [
									'condition_clean',
									'noseintensity_mediumplus',
									'development_fullydeveloped',
									'note_acacia',
									'note_chamomile',
									'note_violet',
									'note_tomato_leaf',
									'note_asparagus',
								],
							},
							tasting_note: 'somethig something',
							metadata: '{"medal_page":true}',
							info: {
								drinkability: 0.5,
								maturity: 0.5,
								balance: 1,
								length: 0.5,
								intensity: 0.5,
								complexity: 0.3,
							},
						},
					},
					{
						creator: '774h74h',
						ref: '1',
						data: {
							notes: {
								nose: ['note_tomato_leaf', 'note_asparagus'],
								palate: [
									'condition_clean',
									'noseintensity_mediumplus',
									'note_tomato_leaf',
									'note_asparagus',
								],
							},
							tasting_note: 'somethig else',
							metadata: '{"medal_page":true}',
							info: {
								drinkability: 0.5,
								maturity: 0.5,
								balance: 1,
								length: 0.5,
								intensity: 0.5,
								complexity: 0.3,
								medal: 'gold',
							},
						},
					},
				],
			},
			{
				data: {
					name: 'San Pablo',
					producer: 'wine producer',
					country: 'England',
					region: 'Northern England',
					vintage: '1754',
					grape: 'Cabernet Sauvignon',
					price: 199.99,
					currency: 'DKK',
					clean_key: 'clean',
					producer_key: 'producerkey',
					country_key: 'countrykey',
					region_key: 'regionkey',
					summary_wine: 'This wine is is...',
					summary_personal: 'My personal experience with this is...',
				},
				team_statement: {
					marked_impression: 'sfsdf',
					flag: false,
					requested: true,
					statement: 'medal',
					extra_a: 'x',
					extra_b: 'y',
					extra_c: 'z',
					extra_d: 'xx',
					extra_e: 'yyy',
				},
				impressions: [
					{
						creator: 'jhskjd8yshd',
						data: {
							ref: 'sfsdf',
							notes: {
								nose: [
									'condition_clean',
									'noseintensity_mediumplus',
									'development_fullydeveloped',
									'note_acacia',
									'note_chamomile',
									'note_violet',
									'note_tomato_leaf',
									'note_asparagus',
								],
								palate: [
									'condition_clean',
									'noseintensity_mediumplus',
									'development_fullydeveloped',
									'note_acacia',
									'note_chamomile',
									'note_violet',
									'note_tomato_leaf',
									'note_asparagus',
								],
							},
							tasting_note: 'somethig something',
							metadata: '{"food_pairing":"great"}',
							info: {
								drinkability: 0.5,
								maturity: 0.5,
								balance: 1,
								length: 0.5,
								intensity: 0.5,
								complexity: 0.3,
							},
						},
					},
					{
						creator: '774h74h',
						data: {
							ref: '4353f',
							notes: {
								nose: ['note_tomato_leaf', 'note_asparagus'],
								palate: [
									'condition_clean',
									'noseintensity_mediumplus',
									'note_tomato_leaf',
									'note_asparagus',
								],
							},
							tasting_note: 'somethig else',
							metadata: '{"medal_page":true}',
							info: {
								drinkability: 0.9,
								maturity: 0.5,
								balance: 2,
								length: 0.5,
								intensity: 0.5,
								medal: 'silver',
								complexity: 0.3,
							},
						},
					},
				],
			},
		],
	},
};
