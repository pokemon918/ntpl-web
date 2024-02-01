import {normalizeTeamMembers} from './index';

import getFormerTeamMembersFixtures from './getFormerTeamMembers.fixtures.json';
import duplicateTestFixture from './duplicateTestFixture.json';

const testFixture = {
	teamRef: 'a2xm72',
	participants: [
		{
			ref: 'ykdk4g',
			name: 'Reed leader Little',
			division: 'a2xm72',
			role: 'member',
			metadata: null,
		},
		{
			ref: 'etgqlk',
			name: 'Jordyn guide Wisozk',
			division: 'a2xm72',
			role: 'guide',
			metadata: {confirmed_arrival: '2020-01-28T09:19:38.850Z'},
		},
		{
			ref: 's34nf3',
			name: 'Dawn member Kreiger',
			division: 'a2xm72',
			role: 'member',
			metadata: {confirmed_arrival: '2020-01-28T08:50:53.974Z'},
		},
		{
			ref: 'az9fxq',
			name: 'Lucio leader Glover',
			division: 'yb3be2',
			role: 'leader',
			metadata: {confirmed_arrival: '2020-01-28T09:19:40.100Z'},
		},
		{
			ref: 'pk8chl',
			name: 'Nicolas guide Nolan',
			division: 'yb3be2',
			role: 'guide',
			metadata: null,
		},
		{
			ref: 'qc75pk',
			name: 'Adell member Brakus',
			division: 'yb3be2',
			role: 'member',
			metadata: {confirmed_arrival: '2020-01-28T08:50:47.745Z'},
		},
		{
			ref: 'ngl3s7',
			name: 'Ephraim leader Mann',
			division: 'nf9ypc',
			role: 'leader',
			metadata: {confirmed_arrival: '2020-01-28T09:19:36.877Z'},
		},
		{
			ref: 'ep7zhk',
			name: 'Tyrese guide Thiel',
			division: 'nf9ypc',
			role: 'guide',
			metadata: null,
		},
		{
			ref: 'df8lch',
			name: 'Marilyne member Weissnat',
			division: 'nf9ypc',
			role: 'member',
			metadata: null,
		},
		{ref: 'q7f5pk', name: 'Test', division: 'a2xm72', role: 'member', metadata: null},
		{ref: 'g5zzam', name: 'Alberte', division: 'a2xm72', role: 'member', metadata: null},
		{ref: 'asdf123', name: 'Joanna', division: 'a2xm72', role: 'leader', metadata: null},
		{ref: 'bkdrbp', name: 'Albert', division: 'a2xm72', role: 'member', metadata: null},
	],
	alias: {
		admin: 'Supervisor',
		leader: 'Team leader',
		guide: 'Senior judge',
		member: 'Judge',
		collection: 'Flight',
		theme: 'Category',
	},
};

describe('normalizeTeamMembers', () => {
	const getRelevantMemberInfo = (member) => ({
		ref: member.ref,
		name: member.name,
		division: member.division,
		role: member.role,
		priority: member.priority,
	});

	it('should filter and sort team members', () => {
		const {teamRef, participants, alias} = testFixture;
		const normalized = normalizeTeamMembers(teamRef, participants, alias);
		const actual = normalized.map(getRelevantMemberInfo);
		expect(actual).toEqual([
			{ref: 'asdf123', name: 'Joanna', division: 'a2xm72', role: 'leader', priority: 1},
			{
				ref: 'etgqlk',
				name: 'Jordyn guide Wisozk',
				division: 'a2xm72',
				role: 'guide',
				priority: 2,
			},
			{
				ref: 'ykdk4g',
				name: 'Reed leader Little',
				division: 'a2xm72',
				role: 'member',
				priority: 3,
			},
			{
				ref: 's34nf3',
				name: 'Dawn member Kreiger',
				division: 'a2xm72',
				role: 'member',
				priority: 3,
			},
			{ref: 'q7f5pk', name: 'Test', division: 'a2xm72', role: 'member', priority: 3},
			{ref: 'g5zzam', name: 'Alberte', division: 'a2xm72', role: 'member', priority: 3},
			{ref: 'bkdrbp', name: 'Albert', division: 'a2xm72', role: 'member', priority: 3},
		]);
	});

	it('should include former team members', () => {
		const {teamRef, participants, alias} = testFixture;
		const {teamStats} = getFormerTeamMembersFixtures;
		const normalized = normalizeTeamMembers(teamRef, participants, alias, teamStats);
		const actual = normalized.map(getRelevantMemberInfo);
		expect(actual).toEqual([
			{ref: 'asdf123', name: 'Joanna', division: 'a2xm72', role: 'leader', priority: 1},
			{
				ref: 'etgqlk',
				name: 'Jordyn guide Wisozk',
				division: 'a2xm72',
				role: 'guide',
				priority: 2,
			},
			{
				ref: 'ykdk4g',
				name: 'Reed leader Little',
				division: 'a2xm72',
				role: 'member',
				priority: 3,
			},
			{
				ref: 's34nf3',
				name: 'Dawn member Kreiger',
				division: 'a2xm72',
				role: 'member',
				priority: 3,
			},
			{ref: 'q7f5pk', name: 'Test', division: 'a2xm72', role: 'member', priority: 3},
			{ref: 'g5zzam', name: 'Alberte', division: 'a2xm72', role: 'member', priority: 3},
			{ref: 'bkdrbp', name: 'Albert', division: 'a2xm72', role: 'member', priority: 3},
			{
				ref: 'x83lek',
				name: 'Hailey Leader Corwin',
				division: 'a2xm72',
				role: 'member',
				priority: 3,
			},
			{
				ref: 'rcet3z',
				name: 'Kaylah Guide Lowe',
				division: 'a2xm72',
				role: 'member',
				priority: 3,
			},
		]);
	});

	it('should not duplicate team members', () => {
		const {teamRef, participants, alias, teamStats} = duplicateTestFixture;
		const normalized = normalizeTeamMembers(teamRef, participants, alias, teamStats);
		const actual = normalized.map(getRelevantMemberInfo);
		expect(actual).toEqual([
			{
				ref: 'krlbs2',
				name: 'Tad Leader Breitenberg',
				division: 'qnzqd4',
				role: 'leader',
				priority: 1,
			},
			{
				ref: 'f2rccg',
				name: 'Raphaelle Member Ortiz',
				division: 'qnzqd4',
				role: 'member',
				priority: 3,
			},
			{
				ref: 'c42k5p',
				name: 'Andre Guide Emard',
				division: 'qnzqd4',
				role: 'member',
				priority: 3,
			},
		]);
	});
});
