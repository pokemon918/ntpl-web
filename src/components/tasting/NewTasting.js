import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {parse} from 'query-string';

import DialogBox from 'components/shared/ui/DialogBox';
import {
	resetForm,
	navigateAway,
	restartSession,
	restoreSession,
	setTastingType,
} from 'actions/multiStepFormActions';
import {routeConstants} from 'const';

import {getTastingComponent} from './types';

let unlisten = null;

class NewTasting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			prompt: false,
		};

		const {
			match: {params},
			multiStepForm: {tastingType},
		} = props;

		const changedTastingType = tastingType !== null && tastingType !== params.type;

		if (this.props.multiStepForm.mode === 'showcase' || changedTastingType) {
			this.props.resetForm();
		}

		props.setTastingType(params.type);
	}

	togglePrompt = () => {
		this.setState({
			prompt: !this.state.prompt,
		});
	};

	handleNo = () => {
		this.props.restartSession();
		this.togglePrompt();
	};

	handleYes = () => {
		const {
			match: {params},
		} = this.props;
		this.props.restoreSession(params.type);
		this.togglePrompt();
	};

	componentDidMount() {
		const {
			multiStepForm,
			match: {params},
		} = this.props;

		const hasPrevSession = multiStepForm.lastSessionData[params.type];
		// Show prompt when there is no navigation and has prev session and any error.
		if (multiStepForm.navigatedAway && hasPrevSession && !multiStepForm.error) {
			this.togglePrompt();
		}

		// Just restore the value if there is error while creating.
		if (multiStepForm.error) {
			const {
				match: {params},
			} = this.props;
			this.props.restoreSession(params.type);
		}

		unlisten = this.props.history.listen((nextLocation, action) => {
			let currentLocation = this.props.location;
			if (currentLocation.pathname !== nextLocation.pathname) {
				this.props.navigateAway(params.type);
			}
		});
	}

	componentWillUnmount() {
		unlisten();
	}

	render() {
		const {
			match: {params},
			location: {search},
		} = this.props;

		const {event} = parse(search);

		const ActiveTasting = getTastingComponent(params.type);

		if (!ActiveTasting) {
			return <Redirect to={routeConstants.NOT_FOUND} />;
		}

		return (
			<div className="new-tasting">
				<ActiveTasting history={this.props.history} event={event} />;
				{this.state.prompt && (
					<DialogBox
						title={'New ' + params.type + ' tasting'}
						description="shared_prompt_modal_default_question"
						noCallback={this.handleNo}
						yesCallback={this.handleYes}
					/>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		multiStepForm: state.multiStepForm,
	};
}

export default connect(mapStateToProps, {
	resetForm,
	navigateAway,
	restartSession,
	restoreSession,
	setTastingType,
})(NewTasting);
