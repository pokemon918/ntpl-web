import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import debounce from 'lodash.debounce';
import {MDBListGroup as ListTeam, MDBListGroupItem as ListTeamItem} from 'mdbreact';

import {searchTeams} from 'actions/teamActions';
import {routeConstants} from 'const';
import {SearchTeamBar} from './partials';

import './MyTeams.scss';
import L18nText from 'components/shared/L18nText';

class FindTeams extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
		};
		this.onChangeCallback = this.onChangeCallback.bind(this);
		this.searchTeams = debounce(props.searchTeams, 350);
	}

	onChangeCallback(searchValue, teams, online) {
		if (searchValue) {
			this.searchTeams(searchValue, teams, online, this.props.history);
		}
	}

	get searchedTeams() {
		const {searchedTeams} = this.props;
		let content = null;
		let teamsToDisplay = searchedTeams;

		// if (searchedTeams.data && searchedTeams.data.length <= 0) {
		// 	teamsToDisplay = teams;
		// }

		if (teamsToDisplay.data && teamsToDisplay.data.length <= 0) {
			content = (
				<div>
					<L18nText
						id="team_search_message"
						defaultMessage="Type in a team's name or handle in the form above."
					/>
				</div>
			);
		}

		if (teamsToDisplay.data.length > 0) {
			let max = 140;
			content = (
				<ListTeam>
					{teamsToDisplay.data.map((team, i) => {
						return (
							<Link key={i} to={`${routeConstants.CLUB}/${team.handle}`}>
								<ListTeamItem>
									<p>
										{team.name} | @{team.handle}
									</p>
									<p>
										{team.description.length > max
											? `${team.description.substring(0, max).trim()}...`
											: team.description}
									</p>
								</ListTeamItem>
							</Link>
						);
					})}
				</ListTeam>
			);
		}

		return content;
	}

	render() {
		return (
			<div className="container my-teams-page">
				<h1 className="title clearfix">
					<L18nText id="team_search_button" defaultMessage="Find Teams" />
				</h1>

				<SearchTeamBar onChangeCallback={this.onChangeCallback} />

				{this.searchedTeams}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
		searchedTeams: state.searchedTeams,
	};
}

export default connect(mapStateToProps, {searchTeams})(FindTeams);
