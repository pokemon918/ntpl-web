import React, {Component} from 'react';
import PropTypes from 'prop-types';

import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';
import Grid from 'components/shared/ui/Grid';
import TextArea from 'components/shared/ui/TextArea';

import './InviteMembersModal.scss';

export default class InviteMembersModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isDisableSendButton: true,
		};
	}

	handleTextChanged = (event) => {
		let text = event.target.value;
		this.changeSendButton(Boolean(text));

		this.props.onInputChange(text);
	};

	changeSendButton = (value) => {
		this.setState({
			isDisableSendButton: !value,
		});
	};

	render() {
		const {toggle, saveCallback, teamName, description} = this.props;
		return (
			<div className="InviteMembers__Wrapper">
				<>
					<Grid columns={6}>
						<div className="InviteMembers__Modal">
							<div className="InviteMembers__Container">
								<div className="InviteMembers__Container__Header">
									<div className="InviteMembers__Title">
										<L18nText id="team_invite_members_title" defaultMessage="Invite to " />{' '}
										{teamName}
									</div>
									{description && (
										<div className="InviteMembers__Description">
											<L18nText id={description} defaultMessage={description} />
										</div>
									)}
								</div>

								<div className="InviteMembers__Container__Body">
									<L18nText
										id="team_invite_members_placeholder"
										defaultMessage="Example usage:mail1@mail.com mail2@mail.com mail3@mail.com"
									>
										{(placeholder) => (
											<TextArea placeholder={placeholder} onChange={this.handleTextChanged} />
										)}
									</L18nText>
								</div>
								<div className="InviteMembers__Container__FooterWrapper">
									<Button variant={'outlined'} color="secondary" onHandleClick={toggle}>
										<L18nText id="team_invite_members_close_button" defaultMessage="Back" />
									</Button>{' '}
									<Button
										disabled={this.state.isDisableSendButton}
										color="primary"
										onHandleClick={saveCallback}
									>
										<L18nText
											id="team_invite_members_send_button"
											defaultMessage="Send invitations"
										/>
									</Button>
								</div>
							</div>
						</div>
					</Grid>
					<div className="InviteMembers__Backdrop" onClick={toggle} />
				</>
			</div>
		);
	}
}

InviteMembersModal.propTypes = {
	teamName: PropTypes.string.isRequired,
	description: PropTypes.string,
	toggle: PropTypes.func.isRequired,
	saveCallback: PropTypes.func.isRequired,
};
