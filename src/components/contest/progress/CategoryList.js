import React, {Component} from 'react';
import {FaClipboardList, FaCheck, FaSync} from 'react-icons/fa';
import Spinner from 'components/shared/ui/Spinner';

import {sortByName, text2latin} from '../common';
import Tooltip from 'components/shared/ui/Tooltip';

class CategoryList extends Component {
	state = {
		hideAllDone: false,
		themesToHide: [],
		syncClicked: false,
	};

	onSyncClick = () => {
		this.setState({syncClicked: true});
		setTimeout(() => this.setState({syncClicked: false}), 2000);
	};

	getStatus = (total = 0, done = 0) => {
		if (!total) {
			return '';
		}

		if (done < 1) {
			return (
				<span class="medium-icon">
					<FaClipboardList />
				</span>
			);
		}

		if (total <= done) {
			return (
				<span class="medium-icon">
					<FaCheck />
				</span>
			);
		}

		const progressPercent = Math.min(((100 * done) / total) | 0, 100);
		return `${progressPercent}%`;
	};

	headlineElement = (team) => {
		return (
			<th
				className={`link-mouse team-headline`}
				onClick={() => {
					let el = document.getElementById('searchInput');
					let find = `"${team.name}"`;
					if (el.value === find) {
						el.value = '';
					} else {
						el.value = find;
					}
					el.click(); // MRW: could not get dispatchEvent(new Event('change'),{ bubbles: true }); working
				}}
			>
				<div id={`spinner-${team.ref}`} className="team-spinner fade">
					{' '}
					<Spinner small inline light />
				</div>
				<div id={`title-${team.ref}`} className="fade show">
					<Tooltip text={`Click to filter on ${team.name}`} place="bottom">
						{team.name}
					</Tooltip>
				</div>
			</th>
		);
	};

	statusIcon = (name, conf = {}) => {
		let total = conf.total || 0;
		let done = conf.done || 0;
		let info = !!(total - done) ? `${name} are still missing ${total - done}` : `${name} are done`;

		let status = this.getStatus(total, done);

		if (total)
			return (
				<td>
					<Tooltip text={info}>{status}</Tooltip>
				</td>
			);

		return <td></td>;
	};

	render() {
		let {teams, themes, progressDetails = {}, contest, fetchProgress} = this.props;
		teams = teams.sort(sortByName);

		return (
			<div>
				<table className="no-select contest-progress">
					<thead>
						<tr className="sticky">
							<th style={{width: '70%', 'padding-right': '30px'}}>
								<div className="flex">
									<span>
										<span id="number-of-rows">{themes.length}</span> of {themes.length} shown
									</span>

									<u
										className="link-mouse"
										onClick={() => {
											let el = document.getElementById('searchInput');
											el.value = '';
											el.click();
										}}
										style={{opacity: 0.5}}
									>
										Reset filter
									</u>
									<u
										className="link-mouse"
										onClick={() => {
											let el = document.getElementById('searchInput');
											if ('"All teams done"' === el.value) el.value = '';
											else el.value = '"All teams done"';
											el.click();
										}}
										style={{opacity: 0.5}}
									>
										Filter teams done
									</u>
								</div>
							</th>
							{this.headlineElement({name: 'You', ref: contest.ref})}
							{teams?.map(this.headlineElement)}
							<th
								onClick={() => {
									this.onSyncClick();
									fetchProgress();
								}}
								className="link-mouse"
								style={{opacity: 0.5}}
							>
								<span className={`fade ${!this.state.syncClicked && 'show'}`}>
									<FaSync />
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{themes &&
							themes.map((theme) => (
								<tr
									className="filter-me link-mouse"
									onClick={() => this.props.navigateToTheme(theme)}
									data-find={[
										text2latin(theme, true),

										...teams?.map((team) =>
											progressDetails?.[team?.ref]?.[theme]?.total
												? text2latin(`"${team.name}"`, true)
												: ''
										),
										teams
											?.map((team) => progressDetails?.[team?.ref]?.[theme])
											.reduce((a, b) => a + (b?.done || 0), 0) ===
										teams
											?.map((team) => progressDetails?.[team?.ref]?.[theme])
											.reduce((a, b) => a + (b?.total || 0), 0)
											? `"all teams done"`
											: '',
									]
										.filter(Boolean)
										.join(String.fromCharCode(30))}
								>
									<td>{theme} </td>

									{this.statusIcon('You', progressDetails?.[this.props.contest.ref]?.[theme])}

									{teams?.map((team) =>
										this.statusIcon(team.name, progressDetails?.[team.ref]?.[theme])
									)}

									<td>
										<Tooltip text={`Overall team progress for ${theme}`}>
											{teams
												?.map((team) => progressDetails?.[team?.ref]?.[theme])
												.reduce((a, b) => a + (b?.done || 0), 0)}
											/
											{teams
												?.map((team) => progressDetails?.[team?.ref]?.[theme])
												.reduce((a, b) => a + (b?.total || 0), 0)}
										</Tooltip>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		);
	}
}

export default CategoryList;
