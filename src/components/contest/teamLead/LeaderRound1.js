import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import startCase from 'lodash/startCase';

import Checkbox from 'components/shared/ui/Checkbox';
import DropoverInput from 'components/shared/ui/DropoverInput';
import {FaStar, FaRegStar, FaExclamationTriangle, FaSync} from 'react-icons/fa';
import {contestConstants} from 'const';
import {normalizeStatement, canonicalText} from '../helpers';
import InlineSVG from 'svg-inline-react';
import Spinner from 'components/shared/ui/Spinner';
import Tooltip from 'components/shared/ui/Tooltip';
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

class LeaderRound1 extends Component {
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
			medal,
			recommendation,
			value_for_money,
		} = data.info || {};

		const tastingNote = longText(
			[data.summary_wine, data.summary_personal].filter(Boolean).join(' ')
		);

		let displayMedal = null;
		if (medal) {
			displayMedal = (
				<Tooltip text={`Medal: ${startCase(medal.replace('_', ' '))}`}>
					<span className="ring strong" data-content={canonicalText(medal)}>
						{normalizeStatement(medal)}
					</span>
				</Tooltip>
			);
		}

		let displayRecommendation = null;
		if (recommendation) {
			const hintText = `${startCase(recommendation.replace('_', ' '))}`;

			displayRecommendation = (
				<Tooltip text={hintText}>
					<span className="ring strong" data-content={recommendation.replace('_', ' ')}>
						{normalizeStatement(recommendation)}{' '}
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
			medal: displayMedal || displayRecommendation || '-',
		};
	};

	render() {
		const {
			subject,
			nonParticipants,
			loadingStatement,
			loadingTeamLeader,
			onFetchContestTeam,
			key,
		} = this.props;
		const {getUserInfo, onUpdate, onStarClick} = this.props.parent;
		const price = getCurrency(subject?.data?.price, subject?.data?.currency);

		return (
			<>
				<tbody>
					<tr>
						<td colspan={4 + ratings.length} style={{'padding-top': '75px'}}>
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
								/*!!subject.impressions.length&&*/ <div className="Contest_Team_Wrapper">
									<Checkbox
										disabled={loadingStatement === 'loading'}
										customClass={'glow'}
										label={<span>Flag for attention</span>}
										value={subject.team_statement && !!subject.team_statement.flag}
										onChange={(value) => onUpdate({flag: value}, subject)}
										infoKey="attention"
									/>
									<Checkbox
										className={loadingStatement === 'loading' ? 'fade' : 'fade show'}
										disabled={loadingStatement === 'loading'}
										customClass={'glow'}
										label={<span>2nd Bottle requested</span>}
										value={subject.team_statement && !!subject.team_statement.requested}
										onChange={(value) => onUpdate({requested: value}, subject)}
										infoKey="bottle"
									/>
									<DropoverInput
										className={loadingStatement === 'loading' ? 'fade' : 'fade show'}
										disabled={loadingStatement === 'loading'}
										label="Final score"
										warning={!this.props.addedFavorite}
										description="You have not selected a favorite tasting by clicking on a star. Are you sure you would like to continue?"
										options={contestConstants.roundOneConclusion}
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
						<th>TASTING NOTE</th>
						<th>{getSvgHeadliner('RATING')}</th>
						<th>{getSvgHeadliner('BEST NOTE')}</th>
						))}
					</tr>
				</thead>
				<tbody key={key}>
					{subject.impressions
						.map((imp) => {
							imp.name = getUserInfo(imp.creator);
							return imp;
						})
						.sort(sortByName)
						.map((impression) => {
							const payload = this.updatePayload(impression.data);

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
										<td className="text-center">
											{subject.team_statement &&
											subject.team_statement.metadata &&
											subject.team_statement.metadata.marked_statements &&
											subject.team_statement.metadata.marked_statements.includes(
												impression.data.ref
											) ? (
												<span
													className="pointer"
													onClick={() => onStarClick(impression.data.ref, subject, false)}
												>
													<FaStar />
												</span>
											) : (
												<span
													className="pointer"
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
							<td colSpan="5">&nbsp;</td>
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

export default withRouter(LeaderRound1);
