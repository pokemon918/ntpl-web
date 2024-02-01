import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
	FaExclamationTriangle,
	FaTrophy,
	FaHourglassHalf,
	FaStar,
	FaSync,
	FaExternalLinkAlt,
	FaMedal,
} from 'react-icons/fa';
import {Link} from 'react-router-dom';

import get from 'lodash/get';
import InlineSVG from 'svg-inline-react';

import Button from 'components/shared/ui/Button';
import Checkbox from 'components/shared/ui/Checkbox';
import DropoverLink from 'components/shared/ui/DropoverLink';
import Spinner from 'components/shared/ui/Spinner';
import {getLinkWithArguments} from 'commons/commons';
import DialogBox from 'components/shared/ui/DialogBox';

import {
	fetchContest,
	fetchContestTeamStats,
	updateTeamStatement,
	setActiveTheme,
	updateContestStatement,
} from 'actions/contestActions';
import {
	makeContestInfoSelector,
	makeSelectedThemeSelector,
	contestThemesLoadingSelector,
	contestThemesSelector,
} from 'reducers/contestsReducer/contestInfoReducer';
import {contestConstants, routeConstants} from 'const';
import NotFound from './common/NotFound';
import PageUnavailable from './common/PageUnavailable';
import {getCurrentUserRole, sortByName} from './common';
import {getCurrency} from 'commons/commons';
import Tooltip from 'components/shared/ui/Tooltip';
import {normalizeStatement, normalizeTeamMembers, canonicalText} from './helpers';
import './contest.scss';
import './AssessmentFinal.scss';
import {makeContestFinalAsessmentSelector} from 'reducers/contestsReducer/contestFinalAssessment';

const AssessmentContext = React.createContext();

class AssessmentFinal extends Component {
	state = {
		selectedTheme: '',
		showTrophyModal: false,
		showConclusionModal: false,
	};

	componentDidMount() {
		this.loadContest();

		if (this.props.selectedTheme) {
			this.onChangeTheme({name: this.props.selectedTheme});
		}
	}

	get contestRef() {
		return this.props.match.params.ref;
	}

	onUpdate = async (field, params) => {
		const {ref} = this.props.match.params;
		const payload = {
			collection: params.collectionRef,
			teamRef: params.teamRef,
			ref,
			field,
			wineRef: params.wineRef,
			role: 'admin',
		};

		await this.props.updateContestStatement(payload);
	};

	updateMarkStatement = (id, data, params) => {
		data.team_statement = data.team_statement || {};
		data.team_statement.metadata = data.team_statement.metadata || {};

		let marked_statements = new Set(data.team_marked_statements || []);

		if (data.team_marked_statements.includes(id)) {
			marked_statements.delete(id);
		} else {
			marked_statements.add(id);
		}
		marked_statements = [...marked_statements];

		this.onUpdate({metadata: {marked_statements}}, params);
	};

	get collections() {
		const {
			contest: {collections = []},
		} = this.props;
		const {selectedTheme} = this.state;
		const themeCollections = collections.filter((i) => i.theme === selectedTheme);
		return themeCollections;
	}

	onChangeTheme = (theme) => {
		this.setState({selectedTheme: theme.name}, () => {
			this.props.setActiveTheme(this.contestRef, this.state.selectedTheme);
			this.loadStats();
		});
	};

	loadContest = () => {
		const {ref: contestRef} = this.props.match.params;
		this.props.fetchContest(contestRef);
	};

	loadStats = () => {
		const {
			contest: {teams},
		} = this.props;
		const {ref: contestRef} = this.props.match.params;

		this.collections.forEach((collection) => {
			teams
				.filter((team) => team.collections.includes(collection.ref))
				.forEach((team) => {
					this.props.fetchContestTeamStats(contestRef, collection.ref, team.ref);
				});
			this.props.fetchContestTeamStats(contestRef, collection.ref, contestRef);
		});
	};

	updateAdminStatement = (collectionRef, impressionRef, field, value) => {
		const {ref: contestRef} = this.props.match.params;
		const payload = {[field]: value};
		this.props.updateTeamStatement(contestRef, collectionRef, contestRef, impressionRef, payload);
	};

	getLabel = (selected) => {
		if (selected) {
			return selected;
		}

		if (this.props.selectedTheme) {
			return this.props.selectedTheme;
		}

		return `Please start by selecting one`;
	};

	onBack = () => {
		this.props.setActiveTheme(this.contestRef, '');
		this.props.history.goBack();
	};

	redirectToMedalPage = () => {
		const {ref: contestRef} = this.props.match.params;
		const url = getLinkWithArguments(routeConstants.CONTEST_RESULT, {
			contestRef,
		});
		this.props.history.push(url);
	};

	render() {
		const {themes, loadingState, contest, allStats} = this.props;
		const {teams, participants, alias} = contest || {};
		const {ref: contestRef} = this.props.match.params;
		const {selectedTheme} = this.state;

		const themeAlias = alias && alias.theme ? alias.theme : 'theme';

		if (!contest) {
			return <NotFound />;
		}

		const userRole = getCurrentUserRole(contest && contest.user_relations);

		if (userRole !== contestConstants.relation.OWNER) {
			return <PageUnavailable />;
		}

		return (
			<div className="contest Contest__AssessmentFinal ">
				<div className="Contest_Back">
					<div className="link-mouse" onClick={this.onBack}>
						&lt; Back
					</div>
				</div>
				<Button
					className="corner-button"
					variant="outlined"
					size="small"
					onHandleClick={() => this.loadStats()}
				>
					Refresh <FaSync />
				</Button>
				<h1>Final Assessment</h1>
				{themeAlias}:{' '}
				<DropoverLink
					label={'Select ' + themeAlias}
					loadingState={loadingState}
					options={themes}
					value={selectedTheme}
					displayValue={(selected) => this.getLabel(selected)}
					onSelect={this.onChangeTheme}
				/>
				<hr className="extra-spacing" />
				<div className="flex shrink">
					<Button variant={'outlined'} size="small">
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_RESULT, {
								ref: contestRef,
							})}
						>
							See medals <FaMedal />{' '}
						</Link>
					</Button>

					<Button variant={'outlined'} size="small">
						<Link
							to={getLinkWithArguments(routeConstants.CONTEST_TROPHY, {
								ref: contestRef,
							})}
						>
							See trophies <FaTrophy />{' '}
						</Link>
					</Button>
				</div>
				<hr className="extra-spacing" style={{'margin-top': '50px'}} />
				<AssessmentContext.Provider
					value={{
						contestRef,
						teams,
						participants,
						alias,
						allStats,
						updateMarkStatement: this.updateMarkStatement,
						updateAdminStatement: this.updateAdminStatement,
					}}
				>
					{this.collections.sort(sortByName).map((collection) => (
						<AssessmentCollection key={collection.ref} collection={collection} />
					))}
				</AssessmentContext.Provider>
			</div>
		);
	}
}

function getSvgHeadliner(str) {
	const svgSource = `<svg height="90" width="15"  transform="rotate(180)">
<text x="-15" y="10" fill="currentColor" transform="rotate(90 0,15)" style="font-style:normal">${str}</text>
</svg>`;
	return <InlineSVG src={svgSource} />;
}

function AssessmentCollection({collection}) {
	const {teams} = React.useContext(AssessmentContext);
	const swaRound2 = get(collection, 'metadata.swa_round_2', false);
	return (
		<>
			<a
				href={'/event/' + collection.ref}
				target="_blank"
				className="small-text ext-link"
				rel="noopener noreferrer"
				style={{float: 'right'}}
			>
				<Tooltip text={`Open an external window to see the flight as a judge`} show place="left">
					<FaExternalLinkAlt />
				</Tooltip>
			</a>
			<h5>{collection.name}</h5>
			{teams
				.filter((team) => team.collections.includes(collection.ref))
				.map((team) => (
					<AssessmentTeam
						key={team.ref}
						collectionRef={collection.ref}
						swaRound2={swaRound2}
						team={team}
					/>
				))}
		</>
	);
}

function AssessmentTeam({collectionRef, swaRound2, team}) {
	const {participants, alias} = React.useContext(AssessmentContext);
	const {contestRef, allStats, updateAdminStatement} = React.useContext(AssessmentContext);
	const teamStats = get(allStats, [collectionRef, team.ref], {});
	const teamMembers = normalizeTeamMembers(team.ref, participants, alias, teamStats);
	const subjects = get(teamStats, 'data.subjects', []).map((i) => i.data);
	const isLoading = teamStats.status === 'pending';

	const onChangeStatement = (field, value, wine) => {
		updateAdminStatement(collectionRef, wine.ref, field, value);
	};

	const showKeepAll = () => {
		return subjects.filter((wine) => {
			const wineStatsByTeam = get(teamStats, ['subjects', wine.ref], {});

			const adminStats = get(allStats, [collectionRef, contestRef], {});
			const wineStatsByAdmin = get(adminStats, ['subjects', wine.ref], {});

			return !wineStatsByAdmin.admin_conclusion && wineStatsByTeam.team_conclusion;
		});
	};

	const onKeepAll = () => {
		subjects.forEach((wine) => {
			const wineStatsByTeam = get(teamStats, ['subjects', wine.ref], {});

			const adminStats = get(allStats, [collectionRef, contestRef], {});
			const wineStatsByAdmin = get(adminStats, ['subjects', wine.ref], {});

			if (!wineStatsByAdmin.admin_conclusion && wineStatsByTeam.team_conclusion) {
				onChangeStatement('statement', wineStatsByTeam.team_conclusion, wine);
			}
		});
	};

	const showAllBtn = showKeepAll();

	return (
		<div className="flight">
			<table>
				<thead className="middle">
					<tr>
						<th className="min-w-m">{team.name}</th>
						<th></th>
						{teamMembers.map((member) => (
							<th key={member.ref} className="NoWrap">
								<Tooltip text={`${member.roleDescription}: ${member.name}`} show>
									{member.alias} {member.displayCount && <>#{member.ordinalCount}</>}
								</Tooltip>
							</th>
						))}
						{swaRound2 && (
							<th>
								<Tooltip text={`Trophy suggestion from team`} show>
									<FaTrophy />
								</Tooltip>
							</th>
						)}
						<th>
							Team
							<br />
							Conclusion
						</th>
						<th>
							{alias?.admin}
							<br />
							conclusion
							{!!showAllBtn.length && (
								<>
									<br />
									<span className="small-text link" onClick={() => onKeepAll()}>
										Keep all
									</span>
								</>
							)}
						</th>
						{swaRound2 && (
							<>
								<th>{getSvgHeadliner('By the glass')}</th>
								<th>{getSvgHeadliner('Food match')}</th>
								<th>{getSvgHeadliner('Critics choice')}</th>
								<th>{getSvgHeadliner('Pub & Bar')}</th>
								<th>
									Wines of <br />
									the Year
								</th>
							</>
						)}
					</tr>
				</thead>
				<tbody>
					{isLoading && (
						<tr>
							<td colspan="100" className="Contest__AssessmentFinal__TeamLoading">
								<Spinner small />
							</td>
						</tr>
					)}
					{!isLoading &&
						subjects
							.sort(sortByName)
							.map((wine) => (
								<AssessmentWine
									key={wine.ref}
									collectionRef={collectionRef}
									swaRound2={swaRound2}
									teamRef={team.ref}
									teamMembers={teamMembers}
									wine={wine}
								/>
							))}
				</tbody>
			</table>
		</div>
	);
}

function AssessmentWine({collectionRef, swaRound2, teamRef, teamMembers, wine}) {
	const {contestRef, allStats, updateAdminStatement, updateMarkStatement} = React.useContext(
		AssessmentContext
	);
	const [showUpdateStatementDialog, setStatementDialog] = React.useState({show: false, id: null});

	const teamStats = get(allStats, [collectionRef, teamRef], {});
	const wineStatsByTeam = get(teamStats, ['subjects', wine.ref], {});

	const adminStats = get(allStats, [collectionRef, contestRef], {});
	const wineStatsByAdmin = get(adminStats, ['subjects', wine.ref], {});

	const onChangeStatement = (field, value) => {
		updateAdminStatement(collectionRef, wine.ref, field, value);
	};

	return (
		<tr>
			<td>
				{wine.name}, {wine.vintage}
			</td>
			<td style={{'text-align': 'left'}}>{getCurrency(wine.price, wine.currency)}</td>
			{teamMembers.map((member) => {
				const impression = get(wineStatsByTeam, ['impressions', member.ref], {});
				let marked_impressions = new Set(get(wineStatsByTeam, 'team_marked_statements'));
				return (
					<td key={member.ref} className="no-select">
						{teamStats.status === 'success' &&
							(impression.medal || impression.recommendation ? (
								<>
									{showUpdateStatementDialog.show && (
										<DialogBox
											title={'Hmmm...'}
											description={`You are about to overrule what the team has suggested. Are you sure you would like to continue?`}
											noCallback={() => setStatementDialog(false)}
											yesCallback={async () => {
												await updateMarkStatement(showUpdateStatementDialog.id, wineStatsByTeam, {
													collectionRef,
													teamRef,
													wineRef: wine.ref,
												});
												setStatementDialog({show: false, id: null});
											}}
										/>
									)}
									<Tooltip
										text={
											<MiniTastingSummary
												medal={impression.medal}
												recommendation={impression.recommendation}
												tastingNote={impression.tasting_note}
												foodPairing={impression.food_pairing}
												swaRound2={swaRound2}
												star={marked_impressions.has(impression.ref)}
											/>
										}
									>
										<span
											onClick={() => setStatementDialog({show: true, id: impression.ref})}
											className={`link-mouse ring ${
												marked_impressions.has(impression.ref) && 'strong'
											}`}
											data-content={canonicalText(impression.medal || impression.recommendation)}
										>
											{normalizeStatement(impression.medal || impression.recommendation)}
										</span>
									</Tooltip>
								</>
							) : (
								'-'
							))}
					</td>
				);
			})}
			{swaRound2 && (
				<td className="no-select">
					{teamStats.status === 'success' &&
						(get(wineStatsByTeam, 'team_suggestion') ? (
							<>
								<Tooltip text={<>{get(wineStatsByTeam, 'team_suggestion')}</>}>
									<span
										className="ring"
										data-content={canonicalText(get(wineStatsByTeam, 'team_suggestion'))}
									>
										{normalizeStatement(get(wineStatsByTeam, 'team_suggestion'))}
									</span>
								</Tooltip>
							</>
						) : (
							'-'
						))}
				</td>
			)}
			<td className="no-select">
				{teamStats.status === 'pending' && <Spinner small />}
				{teamStats.status === 'error' && <FaExclamationTriangle />}
				{teamStats.status === 'success' &&
					(get(wineStatsByTeam, 'team_conclusion') ? (
						<>
							<Tooltip text={get(wineStatsByTeam, 'team_conclusion')}>
								<span
									className="ring strong"
									data-content={canonicalText(get(wineStatsByTeam, 'team_conclusion'))}
								>
									{normalizeStatement(get(wineStatsByTeam, 'team_conclusion'))}
								</span>
							</Tooltip>
						</>
					) : (
						'-'
					))}
			</td>
			<td>
				<AdminConclusion
					wineRef={wine.ref}
					teamStats={teamStats}
					adminStats={adminStats}
					wineStatsByTeam={wineStatsByTeam}
					wineStatsByAdmin={wineStatsByAdmin}
					swaRound2={swaRound2}
					onChangeStatement={onChangeStatement}
				/>
			</td>
			{swaRound2 && (
				<>
					<td>
						{adminStats.status === 'success' && (
							<Checkbox
								value={wineStatsByAdmin.by_the_glass}
								onChange={(value) => onChangeStatement('extra_a', value ? 'By the Glass' : '')}
							/>
						)}
					</td>
					<td>
						{adminStats.status === 'success' && (
							<Checkbox
								value={wineStatsByAdmin.food_match}
								onChange={(value) => onChangeStatement('extra_b', value ? 'Food match' : '')}
							/>
						)}
					</td>
					<td>
						{adminStats.status === 'success' && (
							<Checkbox
								value={wineStatsByAdmin.critics_choice}
								onChange={(value) => onChangeStatement('extra_c', value ? 'Critics Choice' : '')}
							/>
						)}
					</td>
					<td>
						{adminStats.status === 'success' && (
							<Checkbox
								value={wineStatsByAdmin.pub_and_bar}
								onChange={(value) => onChangeStatement('extra_d', value ? 'Pub & Bar' : '')}
							/>
						)}
					</td>
					<td>
						{adminStats.status === 'pending' && <Spinner small />}
						{adminStats.status === 'error' && <FaExclamationTriangle />}
						{adminStats.status === 'success' && (
							<>
								{/*<DropoverInput
								label="Trophy"
								hideTextLabel
								options={contestConstants.wineOfTheYearTrophies}
								value={wineStatsByAdmin.wines_of_the_year}
								onSelect={(value) => onChangeStatement('extra_e', value.name)}
							/>*/}
								<DropoverLink
									label="Trophy"
									options={contestConstants.wineOfTheYearTrophies}
									value={wineStatsByAdmin.wines_of_the_year}
									displayValue={(selected) =>
										selected || wineStatsByAdmin.wines_of_the_year || `Trophy?`
									}
									onSelect={(value) => onChangeStatement('extra_e', value.name)}
								/>
							</>
						)}
					</td>
				</>
			)}
		</tr>
	);
}

function MiniTastingSummary({medal, recommendation, tastingNote, foodPairing, swaRound2, star}) {
	return (
		<div className="Contest__AssessmentFinal__MiniTastingSummary">
			{medal && <>Medal: {medal}</>}
			{recommendation && <>Recommendation: {recommendation}</>}
			<br />
			&nbsp;
			<br />
			Tasting note: {tastingNote || '-'}
			{swaRound2 && (
				<>
					<br />
					&nbsp;
					<br />
					Food pairing: {foodPairing || '-'}
				</>
			)}
			{star && (
				<>
					<br />
					&nbsp;
					<br />
					Marked by the team with a <FaStar />
				</>
			)}
		</div>
	);
}

function AdminConclusion({
	wineRef,
	teamStats,
	adminStats,
	wineStatsByTeam,
	wineStatsByAdmin,
	swaRound2,
	onChangeStatement,
}) {
	const [changeSuggestion] = React.useState(false);

	const bothStatus = [teamStats.status, adminStats.status];

	if (bothStatus.includes('pending')) {
		return <Spinner small />;
	}

	if (bothStatus.includes('error')) {
		return <FaExclamationTriangle />;
	}

	// admin is not allowed to make a conclusion before the team submits theirs
	if (!wineStatsByTeam.team_conclusion) {
		return (
			<>
				<Tooltip text={'Waiting for the team to submit a conclusion'}>
					<span className="no-select">
						<FaHourglassHalf />
					</span>
				</Tooltip>
			</>
		);
	}

	if (!wineStatsByAdmin.admin_conclusion && !changeSuggestion) {
		return (
			<>
				<b>{wineStatsByTeam.team_conclusion}</b>
				<div className="no-wrap small-text">
					<span
						className={`link`}
						onClick={() => onChangeStatement('statement', wineStatsByTeam.team_conclusion)}
					>
						Keep
					</span>{' '}
					or{' '}
					<DropoverLink
						label="Final Conclusion"
						options={
							swaRound2 ? contestConstants.roundTwoConclusion : contestConstants.roundOneConclusion
						}
						value={wineStatsByAdmin.admin_conclusion}
						onSelect={(value) => onChangeStatement('statement', value.name)}
						displayValue={() => `Change`}
					/>
				</div>
			</>
		);
	}

	return (
		<>
			{/*<DropoverInput
			hideTextLabel
			label="Conclusion"
			options={
				swaRound2 ? contestConstants.roundTwoConclusion : contestConstants.roundOneConclusion
			}
			value={wineStatsByAdmin.admin_conclusion}
			onSelect={(value) => onChangeStatement('statement', value.name)}
		/>*/}
			<DropoverLink
				label="Final Conclusion"
				options={
					swaRound2 ? contestConstants.roundTwoConclusion : contestConstants.roundOneConclusion
				}
				value={wineStatsByAdmin.admin_conclusion}
				onSelect={(value) => onChangeStatement('statement', value.name)}
				displayValue={(selected) =>
					selected || wineStatsByAdmin.admin_conclusion || `Please select`
				}
			/>
		</>
	);
}

const mapStateToProps = (state, props) => {
	const getContestInfo = makeContestInfoSelector();
	const getFinalAsessment = makeContestFinalAsessmentSelector();
	const getSelectedTheme = makeSelectedThemeSelector();
	const contestRef = props.match.params.ref;

	return {
		contest: getContestInfo(state, {contestRef}),
		themes: contestThemesSelector(state, {contestRef}),
		selectedTheme: getSelectedTheme(state, {contestRef}),
		loadingState: contestThemesLoadingSelector(state, {contestRef}),
		allStats: getFinalAsessment(state, {contestRef}),
	};
};

const mapDispatchToProps = {
	fetchContest,
	setActiveTheme,
	updateContestStatement,
	fetchContestTeamStats,
	updateTeamStatement,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentFinal);
