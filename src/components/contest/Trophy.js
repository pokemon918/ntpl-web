import React, {Component} from 'react';
import {connect} from 'react-redux';
import XLSX from 'xlsx';
//import DropoverLink from 'components/shared/ui/DropoverLink';
//import {isEmpty} from 'lodash';
import {FaSync, FaCalendarAlt, FaDownload, FaFilter, FaGlasses} from 'react-icons/fa';
// mport ReactTooltip from 'react-tooltip';

import {fetchContest, fetchContestStatementSummary} from 'actions/contestActions';
import {contestResultsLoadingSelector} from 'reducers/contestReducer';
import {
	makeContestInfoSelector,
	contestThemesLoadingSelector,
	contestThemesSelector,
} from 'reducers/contestsReducer/contestInfoReducer';
import {makeContestMedalSelector} from 'reducers/contestsReducer/contestMedalReducer';
import {contestConstants} from 'const';
import NotFound from './common/NotFound';
import PageUnavailable from './common/PageUnavailable';
import {getCurrentUserRole, sortByName} from './common';
//import {normalizeStatement} from './helpers';
import {getCurrency} from 'commons/commons';

import Button from 'components/shared/ui/Button';

import './contest.scss';
import './Results.scss';
import './AssessmentFinal';
import Spinner from 'components/shared/ui/Spinner';
import sortBy from 'sort-by';

/*
const Tooltip = ({id, children}) => (
	<ReactTooltip id={'' + id} place="bottom" effect="solid" className="hoverTooltip" delayHide="0">
		{children}
	</ReactTooltip>
);*/

class ContestMedal extends Component {
	state = {
		selectedTheme: '',
		showToday: true,
		showPerTheme: false,
		showDetails: false,
	};

	componentDidMount() {
		this.loadContest();

		if (this.props.selectedTheme) {
			this.onChangeTheme({name: this.props.selectedTheme});
		}
	}

	getTargetTeam() {
		const userRole = getCurrentUserRole(this.props.contest?.user_relations);

		if (userRole === contestConstants.relation.OWNER) {
			return this.props.contest?.ref;
		}

		return this.props.contest?.teams[0]?.ref || '';
	}

	get statementSummary() {
		const {
			statements: {data = []},
		} = this.props;
		const {selectedTheme} = this.state;
		const themeStatement = data.filter((i) => i.theme === selectedTheme);

		return themeStatement;
	}

	onChangeTheme = (theme) => {
		this.setState({selectedTheme: theme.name});
	};

	onToggleLocalState = (el) => {
		let x = {};
		x[el] = !this.state[el] || false;
		this.setState(x);
	};

	loadContest = () => {
		const {ref: contestRef} = this.props.match.params;
		if (!this.props.contest) this.props.fetchContest(contestRef);
		this.props.fetchContestStatementSummary(contestRef, this.getTargetTeam());
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
		this.props.history.goBack();
	};

	onDownload = () => {
		let filename = `${this.props.contest.name} trophies ${new Date().toISOString()}`;
		let data = this.props.statements?.data.map((el) => {
			let row = {
				name: el.name,
				country: el.country,
				region: el.region,
				vintage: el.vintage,
				price: parseFloat(el.price),
				currency: el.currency,
				date: el.start_date,
				by_the_glass: el.extra_a || '',
				food_match: el.extra_b || '',
				critics_choise: el.extra_c || '',
				pub_bar: el.extra_d || '',
				wine_of_the_year: el.extra_e || '',
			};

			row[`${this.props.contest.alias.theme}`] = el.theme;
			return row;
		});

		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Noteable');

		XLSX.writeFile(wb, `${filename}.xlsx`);
	};

	render() {
		let {loadingState, contestMedals = [], resultsState, contest} = this.props;

		const isLoading = loadingState === 'loading' || resultsState === 'loading';

		if (!contest) {
			return <NotFound />;
		}

		const userRole = getCurrentUserRole(contest?.user_relations);

		if (![contestConstants.relation.OWNER, contestConstants.relation.LEADER].includes(userRole)) {
			return <PageUnavailable />;
		}

		contestMedals.sort(sortBy('theme'));

		let statementsPerTheme = {};
		let statementsCounter = {};

		contestMedals.forEach((el) => {
			if (this.state.showToday) {
				//if(new Date().setHours(0,0,0,0) !== new Date(el.start_date).setHours(0,0,0,0)) return;
				if (el.start_date && new Date() < new Date(el.start_date)) {
					return;
				}

				if (el.end_date && new Date(el.end_date) < new Date()) {
					return;
				}
			}

			let theme = 'All combined';

			if (this.state.showPerTheme) theme = el.theme;

			statementsPerTheme[theme] = statementsPerTheme[theme] || [];

			if (el.extra_a) {
				statementsPerTheme[theme][el.extra_a] = statementsPerTheme[theme][el.extra_a] || [];
				statementsPerTheme[theme][el.extra_a].push(el);
				statementsPerTheme[theme][el.extra_a].sort(sortByName);
			}

			if (el.extra_b) {
				statementsPerTheme[theme][el.extra_b] = statementsPerTheme[theme][el.extra_b] || [];
				statementsPerTheme[theme][el.extra_b].push(el);
				statementsPerTheme[theme][el.extra_b].sort(sortByName);
			}

			if (el.extra_c) {
				statementsPerTheme[theme][el.extra_c] = statementsPerTheme[theme][el.extra_c] || [];
				statementsPerTheme[theme][el.extra_c].push(el);
				statementsPerTheme[theme][el.extra_c].sort(sortByName);
			}

			if (el.extra_d) {
				statementsPerTheme[theme][el.extra_d] = statementsPerTheme[theme][el.extra_d] || [];
				statementsPerTheme[theme][el.extra_d].push(el);
				statementsPerTheme[theme][el.extra_d].sort(sortByName);
			}

			if (el.extra_e) {
				statementsPerTheme[theme][el.extra_e] = statementsPerTheme[theme][el.extra_e] || [];
				statementsPerTheme[theme][el.extra_e].push(el);
				statementsPerTheme[theme][el.extra_e].sort(sortByName);
			}

			statementsCounter[theme] = statementsCounter[theme] || 0;
			statementsCounter[theme]++;
		});

		return (
			<div className="contest ContestContest__Medal">
				<div className="Contest_Back">
					<div className="link-mouse" onClick={this.onBack}>
						&lt; Back
					</div>
				</div>
				<Button
					className="corner-button"
					variant="outlined"
					size="small"
					onHandleClick={() => this.loadContest()}
				>
					Refresh <FaSync />
				</Button>
				{isLoading && <Spinner />}
				<h1>Trophy Overview</h1>

				<hr />

				<div className="button-nav flex">
					<Button
						variant={!this.state.showToday && 'outlined'}
						size="small"
						onHandleClick={() => this.onToggleLocalState('showToday')}
					>
						Today <FaCalendarAlt />{' '}
					</Button>

					<Button
						variant={!this.state.showPerTheme && 'outlined'}
						size="small"
						onHandleClick={() => this.onToggleLocalState('showPerTheme')}
					>
						Per {contest.alias.theme.toLowerCase()} <FaFilter />{' '}
					</Button>

					<Button
						variant={!this.state.showDetails && 'outlined'}
						size="small"
						onHandleClick={() => this.onToggleLocalState('showDetails')}
					>
						Show details <FaGlasses />{' '}
					</Button>
				</div>

				<table>
					<tbody>
						{Object.keys(statementsPerTheme)
							.sort()
							.map((theme) => {
								let themeStatements = statementsPerTheme[theme];

								return (
									<>
										<tr>
											<td colspan="5">
												{theme && <h3>{theme}</h3>}
												<p>{statementsCounter[theme]} in total</p>
											</td>
										</tr>
										{Object.keys(themeStatements)
											.sort((a, b) => {
												return a < b ? -1 : 1;
											})
											.map((statement) => {
												let statements = themeStatements[statement];

												if (!statements.length) return '';

												return (
													<>
														<tr>
															<td colspan="5">
																<h5>
																	{statements.length} {statement}
																</h5>
															</td>
														</tr>
														{this.state.showDetails &&
															statements.map((el) => {
																return (
																	<tr>
																		<td>{el.name}</td>
																		<td>{el.vintage}</td>
																		<td>{el.region}</td>
																		<td>{getCurrency(el.price, el.currency)}</td>
																	</tr>
																);
															})}
													</>
												);
											})}
									</>
								);
							})}
					</tbody>
				</table>

				{contestConstants.relation.OWNER ===
					getCurrentUserRole(this.props.contest?.user_relations) && (
					<div className="flex" style={{margin: '100px 0'}}>
						<Button variant={'outlined'} size="small" onHandleClick={this.onDownload}>
							Download all data <FaDownload />{' '}
						</Button>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const getContestInfo = makeContestInfoSelector();
	const getContestMedals = makeContestMedalSelector();
	const contestRef = props.match.params.ref;

	return {
		contest: getContestInfo(state, {contestRef}),
		themes: contestThemesSelector(state, {contestRef}),
		loadingState: contestThemesLoadingSelector(state, {contestRef}),
		resultsState: contestResultsLoadingSelector(state),
		contestMedals: getContestMedals(state, {contestRef}),
		selectedTheme: state.contest.selectedTheme,
	};
};

const mapDispatchToProps = {
	fetchContest,
	fetchContestStatementSummary,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContestMedal);
