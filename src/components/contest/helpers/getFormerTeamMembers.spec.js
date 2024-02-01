import {getFormerTeamMembers} from './index';

import fixtures from './getFormerTeamMembers.fixtures.json';

describe('getFormerTeamMembers', () => {
	const {teamStats, currentMembers} = fixtures;

	it('gets list of former team members from team stats', () => {
		const formerTeamMembers = getFormerTeamMembers(teamStats, []);
		expect(formerTeamMembers).toEqual([
			{
				ref: 'x83lek',
				name: 'Hailey Leader Corwin',
				email: 'hailey_leader_corwin96@gmail.com',
				role: 'member',
			},
			{
				ref: 'rcet3z',
				name: 'Kaylah Guide Lowe',
				email: 'kaylah_guide_lowe23@yahoo.com',
				role: 'member',
			},
		]);
	});

	it('filters out current team members from the result', () => {
		const formerTeamMembers = getFormerTeamMembers(teamStats, currentMembers);
		expect(formerTeamMembers).toEqual([
			{
				ref: 'rcet3z',
				name: 'Kaylah Guide Lowe',
				email: 'kaylah_guide_lowe23@yahoo.com',
				role: 'member',
			},
		]);
	});
});
