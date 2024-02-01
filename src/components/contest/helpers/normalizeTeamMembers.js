import uniqBy from 'lodash/uniqBy';

import {getFormerTeamMembers} from './index';

const roleAttributes = {
	leader: {priority: 1, alias: 'TL'},
	guide: {priority: 2, alias: 'SJ'},
	member: {priority: 3, alias: null},
};

export function normalizeTeamMembers(teamRef, participants, alias, teamStats) {
	const currentMembers = participants.filter((member) => member.division === teamRef);
	const formerMembers = getFormerTeamMembers(teamStats, currentMembers).map((member) => ({
		...member,
		division: teamRef,
	}));
	const allMembers = [...currentMembers, ...formerMembers];

	const countByRole = (role) => allMembers.filter((member) => member.role === role).length;
	const shouldDisplayCounts = (role) => (roleAttributes[role].alias ? countByRole(role) > 1 : true);
	const roleCounts = {leader: 0, guide: 0, member: 0};

	const normalizedMembers = allMembers
		.map((member) => ({
			...member,
			...roleAttributes[member.role],
			roleDescription: alias[member.role] || member.role,
		}))
		.sort((a, b) => {
			if (a.priority < b.priority) {
				return -1;
			} else if (a.priority > b.priority) {
				return 1;
			}
			return 0;
		})
		.map((member) => ({
			...member,
			displayCount: shouldDisplayCounts(member.role),
			ordinalCount: ++roleCounts[member.role],
		}));

	return uniqBy(normalizedMembers, 'ref');
}
