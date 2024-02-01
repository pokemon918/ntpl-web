import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import LeaderRound1 from './LeaderRound1';
import LeaderRound2 from './LeaderRound2';
import DialogBox from 'components/shared/ui/DialogBox';
import Tooltip from 'components/shared/ui/Tooltip';

class ContestTeamWrapper extends Component {
	state = {
		error: false,
	};

	onUpdate = async (field, value) => {
		const {collection, teamRef, ref} = this.props.match.params;
		const payload = {collection, teamRef, ref, field, wineRef: value?.data?.ref};

		await this.props.updateContestStatement(payload);
		// await this.props.onFetchContestTeam(); // as the page refreshes alll the content it jjumps up to top top - so we are removing this one
	};

	getUserInfo = (ref) => {
		const {participants} = this.props;

		const info = participants && participants.find((participant) => participant.ref === ref);

		if (!info) return '-';

		return info.name;
	};

	fraction2level = (item, context = '') => {
		if (typeof item !== 'number') {
			return '-';
		}

		const circle = (size) => {
			return <span className={'rating-circle -' + size}>{size}</span>;
		};

		if (item < 0.3) {
			return this.tooltip(circle('L'), 'Low ' + context);
		} else if (item > 0.7) {
			return this.tooltip(circle('H'), 'High ' + context);
		}

		return this.tooltip(circle('M'), 'Medium ' + context);
	};

	tooltip = (content, tip) => {
		if (!content) {
			return '';
		}

		if (!tip) {
			return content;
		}

		tip = tip.replace('_', ' ').trim();

		tip = tip.charAt(0).toUpperCase() + tip.slice(1);

		return <Tooltip text={tip}>{content}</Tooltip>;
	};

	longText = (strOri) => {
		let str = strOri.replace('\r', '').replace(/\n{3,}/g, '\n\n');

		str = str.split('\n\n').map((item, key) => {
			return (
				<>
					{!!key && (
						<>
							<br />
							<br />
						</>
					)}
					{item}
				</>
			);
		});

		return <div className="long_text_wrapper">{str}</div>;
	};

	onStarClick = (id, data, add) => {
		data.team_statement = data.team_statement || {};
		data.team_statement.metadata = data.team_statement.metadata || {};

		let marked_statements = new Set(data.team_statement.metadata.marked_statements || []).add(id);

		if (!add) {
			marked_statements.delete(id);
		}

		marked_statements = [...marked_statements];

		this.onUpdate({metadata: {...data.team_statement.metadata, marked_statements}}, data);
	};

	getSubject = (id, subject, add) => {
		const {isLoading} = this.props;

		let teamStatement = {...subject.team_statement};
		const markedStatements = teamStatement.metadata && teamStatement.metadata.marked_statements;

		if (isLoading) {
			return false;
		}

		if (add) {
			if (markedStatements) {
				teamStatement.metadata.marked_statements = [...markedStatements, id];
				subject.team_statement = teamStatement;

				return subject;
			}
			teamStatement.metadata = {};
			teamStatement.metadata.marked_statements = [id];
			subject.team_statement = teamStatement;

			return subject;
		}

		teamStatement.metadata.marked_statements = markedStatements.filter(
			(markedStatement) => markedStatement !== id
		);
		subject.team_statement = teamStatement;

		return subject;
	};

	render() {
		const {showError} = this.state;
		const {
			subjects,
			participants,
			onFetchContestTeam,
			isRound2,
			loadingStatement,
			loadingTeamLeader,
		} = this.props;

		return (
			<div class="ContestProgress__Wrapper">
				{showError && (
					<DialogBox
						title={'Hmmm...'}
						errorBox={true}
						description={'Error while updating...'}
						noCallback={() => this.setState({showError: false})}
						yesCallback={() => this.setState({showError: false})}
					/>
				)}

				<div className="Contest_Table_Scroll extra-spacing">
					<table>
						<thead></thead>
						{subjects &&
							subjects
								.sort((a, b) => (a.data?.name < b.data?.name ? -1 : 1))
								.map((subject, index) => {
									const creators = subject.impressions.map((impression) => impression.creator);
									const nonParticipants = participants.filter(
										(participant) => !creators.includes(participant.ref)
									);

									subject.team_statement = subject.team_statement || {};

									const addedFavorite = !!subject?.team_statement?.metadata?.marked_statements
										?.length;

									return (
										<>
											{isRound2 ? (
												<LeaderRound2
													loadingStatement={loadingStatement}
													loadingTeamLeader={loadingTeamLeader}
													subject={subject}
													participants={participants}
													nonParticipants={nonParticipants}
													onFetchContestTeam={onFetchContestTeam}
													parent={this}
													addedFavorite={addedFavorite}
													key={index}
												/>
											) : (
												<LeaderRound1
													loadingStatement={loadingStatement}
													loadingTeamLeader={loadingTeamLeader}
													subject={subject}
													nonParticipants={nonParticipants}
													participants={participants}
													onFetchContestTeam={onFetchContestTeam}
													parent={this}
													addedFavorite={addedFavorite}
													key={index}
												/>
											)}
										</>
									);
								})}
					</table>
				</div>
				<ReactTooltip place="bottom" effect="solid" className="hoverTooltip" />
			</div>
		);
	}
}

export default withRouter(ContestTeamWrapper);
