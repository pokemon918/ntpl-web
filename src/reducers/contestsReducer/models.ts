export interface ContestInfo {
	ref: string;
	handle: string;
	name: string;
	description: string;
	type: string;
	avatar: string;
	user_relations: string[];
	alias: {
		admin: string;
		leader: string;
		guide: string;
		member: string;
		collection: string;
		theme: string;
	};
	participants: ContestParticipant[];
	teams: ContestTeam[];
	collections: ContestCollection[];
	admins: ContestAdmin[];
	themes: string[];
	statements: ContestStatement[];
}

export interface ContestParticipant {
	ref: string;
	name: string;
	division: string;
	role: string;
	metadata?: {
		confirmed_arrival?: string;
	};
}

export interface ContestTeam {
	ref: string;
	name: string;
	handle: string;
	description: string;
	members: number;
	collections: string[];
}

export interface ContestCollection {
	ref: string;
	name: string;
	description: string;
	start_date: string;
	end_date: string;
	owner_ref: string;
	metadata: {
		medal_page: boolean;
		swa_round_2: boolean;
		tastingType: string; // create enum for valid tasting types
	};
	avatar: string;
	created_at: string;
	updated_at: string;
	theme: string;
}

export interface ContestAdmin {
	ref: string;
	name: string;
	metadata: {
		// how do we load data here? is this data used in the frontend?
	};
}

export interface ContestStatement {
	//
}

export interface ContestProgress {
	[theme: string]: ContestThemeProgress;
}

export interface ContestThemeProgress {
	total: number;
	todo: number;
	done: number;
}

export interface ContestMedalStats {
	theme: string;
	statement: string;
	extra_a: string;
	extra_b: string;
	extra_c: string;
	extra_d: null;
	extra_e: null;
	name: string;
	producer: string;
	country: string;
	region: string;
	vintage: string;
	grape: string;
	price: string;
	currency: string;
	clean_key: string;
	producer_key: string;
	region_key: string;
	start_date: string;
	end_date: string;
}

export interface ContestTeamStats {
	collection: ContestCollection;
	team: ContestTeam;
	subjects: ContestTeamSubject[];
}

export interface ContestTeamSubject {
	data: ContestImpression;
	team_statement: ContestTeamStatement;
	impressions: ContestTeamImpression[];
}

export interface ContestImpression {
	ref: string;
	name: string;
	producer: string;
	country: string;
	region: string;
	vintage: string;
	grape: string;
	location: string;
	summary_wine: string;
	summary_personal: string;
	food_pairing: string;
	rating: {
		final_points: number;
		balance: number;
		length: number;
		intensity: number;
		terroir: number;
		complexity: number;
	};
	notes: {
		'@': string[];
	};
	images: string[];
	created_at: string;
	price: number;
	currency: string;
	clean_key: string;
	producer_key: string;
	region_key: string;
	source: string;
	info: {
		medal: string;
		recommendation: string;
	};
	metadata: {
		// how do we load data here? is this data used in the frontend?
	};
	mold: string;
	team: string;
	collection: string;
}

export interface ContestTeamStatement {
	marked_impression: string;
	flag: false;
	requested: false;
	statement: string;
	extra_a: string;
	extra_b: string;
	extra_c: string;
	extra_d: string;
	extra_e: string;
	metadata: {
		marked_statements: string[];
	};
}

export interface ContestTeamImpression {
	creator: ContestParticipant;
	data: ContestImpression;
	name: string;
}

export interface ContestTeamAssessment {
	status: string;
	data: ContestTeamStats;
	error: Error;
	subjects: {
		[subjectRef: string]: ContestTeamLeadAssessment | ContestTeamAdminAssessment;
	};
}

export interface ContestTeamLeadAssessment {
	team_suggestion: string;
	team_conclusion: string;
	team_marked_statements: string[];
	impressions: {
		[creatorRef: string]: ContestTeamMemberAssessment;
	};
}

export interface ContestTeamMemberAssessment {
	ref: string;
	medal: string;
	recommendation: string;
	tasting_note: string;
	food_pairing: string;
}

export interface ContestTeamAdminAssessment {
	admin_conclusion: string;
	by_the_glass: boolean;
	food_match: boolean;
	critics_choice: boolean;
	pub_and_bar: boolean;
	wines_of_the_year: string;
}
