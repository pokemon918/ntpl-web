import React, {Component} from 'react';
import classNames from 'classnames';
import {withRouter} from 'react-router-dom';
import startCase from 'lodash/startCase';

import Checkbox from 'components/shared/ui/Checkbox';
import DropoverInput from 'components/shared/ui/DropoverInput';
import {FaStar, FaRegStar, FaExclamationTriangle, FaSync} from 'react-icons/fa';
import {contestConstants} from 'const';
import Tooltip from 'components/shared/ui/Tooltip';
import {normalizeStatement, canonicalText} from '../helpers';
import InlineSVG from 'svg-inline-react';
import Spinner from 'components/shared/ui/Spinner';
import {getCurrency} from 'commons/commons';
import {sortByName} from '../common';

function getSvgHeadliner(str) {
	const svgSource = `<svg height="90" width="15"  transform="rotate(180)">
<text x="-15" y="15" fill="currentColor" transform="rotate(90 0,15)" style="font-style:normal">${str}</text>
</svg>`;
	return <InlineSVG src={svgSource} />;
}

const ratings = [
	getSvgHeadliner('BALANCE'),
	getSvgHeadliner('FINISH'),
	getSvgHeadliner('INTENSITY'),
	getSvgHeadliner('COMPLEXITY'),
	getSvgHeadliner('TYPICITY'),
	getSvgHeadliner('MATURITY'),
	getSvgHeadliner('DRIKABILITY'),
	getSvgHeadliner('VALUE/$€£'),
];

const notes = ['TASTING NOTE', 'FOOD PAIRING NOTE'];

class LeaderRound2 extends Component {
	updatePayload = (data) => {
		const {fraction2level, longText} = this.props.parent;

		const {
			balance,
			finish,
			intensity,
			complexity,
			typicity,
			maturity,
			drinkability,
			value_for_money,
			medal,
		} = data.info;

		const foodPairing = data.food_pairing && longText(data.food_pairing);

		const tastingNote = longText(
			[data.summary_wine, data.summary_personal].filter(Boolean).join(' ')
		);

		let displayMedal = null;
		if (medal) {
			const hintText = `Medal: ${startCase(medal.replace('_', ' '))}`;

			displayMedal = (
				<Tooltip text={hintText}>
					<span className="ring strong" data-content={canonicalText(medal)}>
						{normalizeStatement(medal)}
					</span>
				</Tooltip>
			);
		}

		return {
			balance: fraction2level(balance, 'balance'),
			finish: fraction2level(finish, 'finish'),
			intensity: fraction2level(intensity, 'intensity'),
			complexity: fraction2level(complexity, 'complexity'),
			typicity: fraction2level(typicity, 'typicity'),
			maturity: fraction2level(maturity, 'maturity'),
			drinkability: fraction2level(drinkability, 'drinkabillity'),
			value_for_money: fraction2level(value_for_money, 'value for money'),
			tastingNote,
			foodPairing,
			medal: displayMedal || '-',
		};
	};

	render() {
		const {
			subject,
			nonParticipants,
			loadingStatement,
			loadingTeamLeader,
			onFetchContestTeam,
		} = this.props;
		const {getUserInfo, onUpdate, key, onStarClick} = this.props.parent;
		const price = getCurrency(subject?.data?.price, subject?.data?.currency);

		return (
			<>
				<tbody>
					<tr>
						<td colspan={4 + ratings.length + notes.length} style={{'padding-top': '75px'}}>
							<h5>
								{[
									subject.data.name,
									subject.data.vintage,
									subject.data.region,
									subject.data.country,
									price,
								]
									.filter(Boolean)
									.join(', ')}
							</h5>
							{
								/*!!subject.impressions.length &&*/ <div className="Contest_Team_Wrapper">
									<Checkbox
										customClass={'glow'}
										disabled={loadingStatement === 'loading'}
										label={<span>Flag for attention</span>}
										value={subject.team_statement && !!subject.team_statement.flag}
										onChange={(value) => onUpdate({flag: value}, subject)}
										infoKey="attention"
									/>
									<Checkbox
										customClass={'glow'}
										label={<span>2nd Bottle requested</span>}
										disabled={loadingStatement === 'loading'}
										value={subject.team_statement && !!subject.team_statement.requested}
										onChange={(value) => onUpdate({requested: value}, subject)}
										infoKey="bottle"
									/>

									<DropoverInput
										label="Trophy?"
										warning={!this.props.addedFavorite}
										description="You have not selected a favorite tasting by clicking on a star. Are you sure you would like to continue?"
										disabled={loadingStatement === 'loading'}
										options={contestConstants.trophies}
										onSelect={(id) => onUpdate({extra_a: id.name}, subject)}
										value={
											(subject.team_statement && subject.team_statement.extra_a) || 'Select Trophy'
										}
									/>

									<DropoverInput
										label="Final score"
										warning={!this.props.addedFavorite}
										description="You have not selected a favorite tasting by clicking on a star. Are you sure you would like to continue?"
										disabled={loadingStatement === 'loading'}
										options={contestConstants.roundTwoConclusion}
										onSelect={(id) => onUpdate({statement: id.name}, subject)}
										value={
											(subject.team_statement && subject.team_statement.statement) ||
											'Select Conclusion'
										}
									/>
								</div>
							}
						</td>
					</tr>
				</tbody>

				<thead>
					<tr>
						<th className="flex min-w-m">
							<span
								onClick={onFetchContestTeam}
								className={`link-mouse fade ${0 && loadingStatement === 'loading' ? '' : 'show'}`}
								style={{color: '#f5f4ef4a', padding: '5px 10px'}}
							>
								{loadingTeamLeader === 'loading' ? <Spinner small light /> : <FaSync />}
							</span>
						</th>
						{ratings.map((column) => (
							<th>{column}</th>
						))}
						{notes.map((column) => (
							<th style={{'text-align': 'left'}}>
								<div className="long_text_wrapper">{column}</div>
							</th>
						))}
						<th>{getSvgHeadliner('MEDAL')}</th>
						<th>{getSvgHeadliner('BEST NOTE')}</th>
					</tr>
				</thead>
				<tbody key={key}>
					{subject.impressions
						.map((imp) => {
							imp.name = getUserInfo(imp.creator);
							return imp;
						})
						.sort(sortByName) // todo: check why not working
						.map((impression) => {
							const payload = this.updatePayload(impression.data);
							const cursorClass = classNames({
								pointer: !this.props.isLoading,
								'no-mouse': this.props.isLoading,
							});
							return (
								<tr key={impression.data.ref}>
									<td>{impression.name}</td>
									{Object.entries(payload).map((el) => (
										<>
											{'medal' === el[0] ? (
												<td className="text-center">{el[1] || '-'}</td>
											) : (
												<td>{el[1] || '-'}</td>
											)}
										</>
									))}

									{loadingStatement && loadingStatement !== 'success' ? (
										<td className="text-center">
											{loadingStatement === 'loading' && (
												<div className="Dropover__Status">
													<Spinner small inline />
												</div>
											)}
											{loadingStatement === 'error' && (
												<div className="Dropover__Status">
													<FaExclamationTriangle />
												</div>
											)}
										</td>
									) : (
										<td>
											{subject.team_statement &&
											subject.team_statement.metadata &&
											subject.team_statement.metadata.marked_statements &&
											subject.team_statement.metadata.marked_statements.includes(
												impression.data.ref
											) ? (
												<span
													className={cursorClass}
													onClick={() => onStarClick(impression.data.ref, subject, false)}
												>
													<FaStar />
												</span>
											) : (
												<span
													className={cursorClass}
													onClick={() => onStarClick(impression.data.ref, subject, true)}
												>
													<FaRegStar />
												</span>
											)}
										</td>
									)}
								</tr>
							);
						})}
					{nonParticipants.sort(sortByName).map((participant, i, list) => (
						<tr>
							<td>{participant.name}</td>
							<td colSpan={ratings.length}>
								<span className="soft-text">Has not responded yet</span>
							</td>
							<td colSpan="6">&nbsp;</td>
						</tr>
					))}
				</tbody>

				{/*nonParticipants && (
					<p>
						No results from{' '}
						{nonParticipants.sort(sortByName).map((participant, i, list) => (
							<>
								{!i ? '' : list.length - 1 === i ? ' nor ' : ', '}
								<strong>{participant.name}</strong>
							</>
						))}
					</p>
						)*/}
			</>
		);
	}
}

export default withRouter(LeaderRound2);
