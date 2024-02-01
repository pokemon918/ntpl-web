import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';
import L18nText from 'components/shared/L18nText';
import './TastingTypeSelectModal.scss';

export default class TastingTypeSelectModal extends Component {
	handleSelect = (type) => {
		if (this.props.selectCallback) {
			this.props.selectCallback(type);
		}
		this.props.toggle();
	};

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader>
					<L18nText id="tasting_choose_type_title" defaultMessage="Choose what type of tasting" />
				</ModalHeader>
				<ModalBody style={{textAlign: 'center'}}>
					<Button
						color="secondary"
						className={
							this.props.enableTasting === 'profound' || this.props.enableTasting === 'all'
								? ''
								: 'disable'
						}
						onClick={() => this.handleSelect('profound')}
					>
						<L18nText id="tasting_type_profound" defaultMessage="Profound" />
					</Button>
					<Button
						color="secondary"
						className={
							this.props.enableTasting === 'quick' || this.props.enableTasting === 'all'
								? ''
								: 'disable'
						}
						onClick={() => this.handleSelect('quick')}
					>
						<L18nText id="tasting_type_quick" defaultMessage="Light" />
					</Button>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.toggle}>
						<L18nText id="tasting_close_button" defaultMessage="Close" />
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
