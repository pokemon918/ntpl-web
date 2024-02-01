import React, {Component} from 'react';
import {connect} from 'react-redux';

import './SearchTeamBar.scss';
import L18nText from 'components/shared/L18nText';

class SearchTeamBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchKeyword: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const {
			teams: {data = []},
			connectionStats: {online},
		} = this.props;

		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});

		if (this.props.onChangeCallback) {
			this.props.onChangeCallback(value, data, online);
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		const {teams, online} = this.props;
		if (this.props.submitCallback) {
			this.props.submitCallback(this.state.searchKeyword, teams, online);
		}
	}

	render() {
		return (
			<div className="container search-team-bar">
				<div className="row">
					<div className="col-12">
						<form onSubmit={this.handleSubmit} className="search-team-form" method="POST" action="">
							<L18nText id="team_search_placeholder" defaultMessage="Search Teams">
								{(placeholder) => (
									<input
										type="text"
										id="search-input"
										name="searchKeyword"
										value={this.state.searchKeyword}
										className="form-control"
										placeholder={placeholder}
										onChange={this.handleChange}
									/>
								)}
							</L18nText>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		teams: state.teams,
		connectionStats: state.offline,
	};
}

export default connect(mapStateToProps)(SearchTeamBar);
