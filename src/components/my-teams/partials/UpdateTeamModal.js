import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

import L18nText from 'components/shared/L18nText';
import Spinner from 'components/shared/ui/Spinner';
import UpdateTeamForm from './UpdateTeamForm';

export default class UpdateTeamModal extends Component {
	updateTeamRef = React.createRef();

	handleSave = () => {
		this.updateTeamRef.current.handleSubmit();
	};

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>
					<L18nText id="team_update_title" defaultMessage="Editing team" />
					<L18nText id="team_create_title" defaultMessage="Add a new team" />
				</ModalHeader>
				<ModalBody>
					<UpdateTeamForm
						ref={this.updateTeamRef}
						data={this.props.data}
						serverUrl={this.props.serverUrl}
						saveCallback={this.props.saveCallback}
					/>
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
			</Modal>
		);
	}
}
