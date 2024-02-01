import get from 'lodash/get';

export function getFormerTeamMembers(stats, currentMembers) {
	const currentMemberRefs = currentMembers.map((member) => member.ref);
	const formerCreators = get(stats, 'data.subjects', [])
		.flatMap((subject) => subject.impressions.map((impression) => impression.creator))
		.filter((creator) => !currentMemberRefs.includes(creator.ref))
		.map((formerMember) => ({
			...formerMember,
			role: 'member',
		}));
	return formerCreators;
}
