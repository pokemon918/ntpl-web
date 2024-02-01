import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

import CreateEventForm from './CreateEventForm';
import L18nText from 'components/shared/L18nText';
import Spinner from 'components/shared/ui/Spinner';

export default class CreateEventModal extends Component {
	createEventRef = React.createRef();

	handleSave = () => {
		this.createEventRef.current.handleSubmit();
	};

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>
					<L18nText id="event_popup_title" defaultMessage="Add a new event" />
				</ModalHeader>
				<ModalBody>
					<CreateEventForm
						ref={this.createEventRef}
						saveCallback={this.props.saveCallback}
						eventWines={this.props.eventWines}
					/>
					{this.props.isSaving && <Spinner />}
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.toggle}>
						<L18nText id="event_create_close_button" defaultMessage="Close" />
					</Button>{' '}
					<Button color="primary" onClick={this.handleSave}>
						<L18nText id="event_create_save_button" defaultMessage="Save changes" />
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
