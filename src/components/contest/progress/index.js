import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FaClipboardList, FaCheck, FaPercent} from 'react-icons/fa';
import {FaSync} from 'react-icons/fa';

import CategoryList from './CategoryList';
import Button from 'components/shared/ui/Button';
import {getLinkWithArguments, isProductionSite} from 'commons/commons';

import L18nText from 'components/shared/L18nText';
import {fetchContest, fetchTeamProgress, setActiveTheme} from 'actions/contestActions';
import {makeContestInfoSelector} from 'reducers/contestsReducer/contestInfoReducer';
import {getContestProgressSelector} from 'reducers/contestsReducer/contestProgressReducer';
import {contestConstants, routeConstants} from 'const';
import NotFound from '../common/NotFound';
import PageUnavailable from '../common/PageUnavailable';
import {getCurrentUserRole} from '../common';
import '../contest.scss';
import './ContestProgress.scss';

class Progress extends Component {
	componentDidMount() {
		this.onFetchData();
	}

	get contestRef() {
		return this.props.match.params.ref;
	}

	onFetchData = async () => {
		const {ref} = this.props.match.params;
		const {contest = {}} = this.props;

		if (!contest) {
			await this.props.fetchContest(ref);
		}

		window.requestAnimationFrame(() => this.fetchProgress());
	};

	navigateToTheme = (theme) => {
		this.props.setActiveTheme(this.contestRef, theme);
		const {ref} = this.props.match.params;
		const url = getLinkWithArguments(routeConstants.CONTEST_ASSESSMENT, {
			ref,
		});
		this.props.history.push(url);
	};

	fetchProgress = async () => {
		const {ref: contestRef} = this.props.match.params;
		const {contest = {}} = this.props;
		// Fetch data for SUP
		contest.teams &&
			this.props.fetchTeamProgress(contestRef, contestRef, this.getAnimation({ref: contestRef}));

		contest.teams.map(async (team) => {
			this.props.fetchTeamProgress(contestRef, team.ref, this.getAnimation(team));
		});
	};

	getAnimation = (team) => {
		let title = document.getElementById(`title-${team.ref}`);
		let spinner = document.getElementById(`spinner-${team.ref}`);

		if (!(title && spinner)) {
			return {};
		}

		return {
			cb1: () => {
				title.classList.remove('show');
				spinner.classList.add('show');
			},
			cb2: () => {
				title.classList.add('show');
				spinner.classList.remove('show');
			},
		};
	};

	onInputChange = (ev) => {
		let find = ev?.target?.value?.toLowerCase() || '';
		let rows = document.getElementsByClassName('filter-me');
		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];
			if (rows[i].dataset.find?.includes(find)) row.classList.remove('hide');
			else row.classList.add('hide');
		}
		//document.querySelectorAll("filter-me:not(.hide)")
		document.getElementById('number-of-rows').innerText = document.querySelectorAll(
			'.filter-me:not(.hide)'
		).length;

		//onChange?.(ev);
	};

	nameMustContain = (str) => {
		if (1 || !isProductionSite()) return true;
		// prettier-ignore
		const filtering = ['HW-R','OFS-L','OFS-MAD'];

		for (let i = 0; i < filtering.length; i++) {
			if (str.includes(`[${filtering[i]}]`)) return true;
		}

		return false;
	};

	onBack = () => {
		this.props.setActiveTheme(this.contestRef, '');
		this.props.history.goBack();
	};

	render() {
		const {contest, progressDetails = {}} = this.props;

		if (!contest) {
			return <NotFound />;
		}

		const userRole = getCurrentUserRole(contest && contest.user_relations);

		if (userRole !== contestConstants.relation.OWNER) {
			return <PageUnavailable />;
		}

		return (
			<div class="contest -progress">
				<div className="Contest_Back">
					<div className="link-mouse" onClick={this.onBack}>
						&lt; Back
					</div>
				</div>
				<Button
					className="corner-button"
					variant="outlined"
					size="small"
					onHandleClick={this.onFetchData}
				>
					Refresh <FaSync />
				</Button>{' '}
				<h1>Event progress for {contest.name} </h1>
				<hr className="extra-spacing" />
				<div className="flex shrink">
					<span className="SearchBar__Wrapper">
						<input
							autoComplete="off"
							className="SearchBar__Default"
							onChange={this.onInputChange}
							onClick={this.onInputChange}
							id="searchInput"
							placeholder="Filter"
							style={{'max-width': '375px', margin: '0 auto 50px'}}
						/>
					</span>
				</div>
				<CategoryList
					name={contest.name}
					teams={contest.teams}
					navigateToTheme={this.navigateToTheme}
					themes={contest.themes.filter(this.nameMustContain)}
					contest={contest}
					progressDetails={progressDetails}
					fetchProgress={this.fetchProgress}
				/>
				<div className="mx-10 flex" style={{'justify-content': 'space-evenly'}}>
					<span className="no-wrap">
						<FaClipboardList /> <L18nText id="contest_category_notStarted" message="Not started" />
					</span>
					<span className="no-wrap">
						<FaPercent /> How much completed
					</span>
					<span className="no-wrap">
						<FaCheck /> <L18nText id="contest_category_done" message="Done" />
					</span>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const contestRef = props.match.params.ref;
	const getContestInfo = makeContestInfoSelector();

	return {
		contest: getContestInfo(state, {contestRef}),
		progressDetails: getContestProgressSelector(state),
	};
}

export default connect(mapStateToProps, {
	fetchContest,
	setActiveTheme,
	fetchTeamProgress: fetchTeamProgress,
})(Progress);
