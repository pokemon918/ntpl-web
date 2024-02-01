import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

import CreateTeamForm from './CreateTeamForm';
import L18nText from 'components/shared/L18nText';
import Spinner from 'components/shared/ui/Spinner';
import {IntlProvider} from 'components/shared';

export default class CreateTeamModal extends Component {
	createTeamRef = React.createRef();

	handleSave = () => {
		this.createTeamRef.current.handleSubmit();
	};

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<IntlProvider>
					<ModalHeader toggle={this.props.toggle}>
						<L18nText id="team_create_title" defaultMessage="Add a new team" />
					</ModalHeader>
					<ModalBody>
						<CreateTeamForm ref={this.createTeamRef} saveCallback={this.props.saveCallback} />
						{this.props.isSaving && <Spinner />}
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={this.props.toggle}>
							<L18nText id="team_create_close_button" defaultMessage="Close" />
						</Button>{' '}
						<Button color="primary" onClick={this.handleSave}>
							<L18nText id="team_create_save_button" defaultMessage="Save changes" />
						</Button>
					</ModalFooter>
				</IntlProvider>
			</Modal>
		);
	}
}
