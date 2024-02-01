import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import Button from 'components/shared/ui/Button';
import NotFound from '../common/NotFound';
import {_rePost} from 'commons/commons';
import DialogBox from 'components/shared/ui/DialogBox';
import Checkbox from 'components/shared/ui/Checkbox';
import Modal from 'components/shared/ui/Modal';
import Grid from 'components/shared/ui/Grid';
import Spinner from 'components/shared/ui/Spinner';

class NonMember extends Component {
	state = {
		error: false,
		isLoading: false,
		acceptedTerms: false,
		showTermModal: false,
	};

	onShowTermModal = () => {
		this.setState({showTermModal: true});
	};

	onHideTermModal = () => {
		this.setState({showTermModal: false, acceptedTerms: false});
	};

	onRequest = async () => {
		this.setState({isLoading: true});
		const {ref} = this.props.match.params;
		const path = `/contest/${ref}/request/role/participant`;
		try {
			await _rePost(path);
			await this.props.onFetchContest();
			this.onHideTermModal();
			this.setState({isLoading: false});
		} catch (err) {
			this.setState({error: true});
			this.setState({isLoading: false});
		}
	};

	render() {
		const {error, acceptedTerms, showTermModal, isLoading} = this.state;
		const {contest} = this.props;
		if (!contest) {
			return <NotFound />;
		}

		return (
			<div>
				<div className="corner-button">
					<Button onHandleClick={this.onShowTermModal}>Request access</Button>
				</div>
				<p>To be part of {contest.name} you will need to request for access.</p>
				{showTermModal && (
					<Modal
						onClose={this.onHideTermModal}
						title={'Terms and conditions'}
						body={
							<div className="pd-10">
								<Grid columns={6}>
									<>
										<Checkbox
											customClass={'glow'}
											disabled={isLoading}
											label={<span>I accept that SWA have access to my information.</span>}
											isValid={acceptedTerms}
											onChange={() => this.setState({acceptedTerms: !this.state.acceptedTerms})}
											infoKey="confirm"
										/>
										<br />
										<div className="links text-justify">
											By ticking the box, I agree that my contact details may be shared with &nbsp;
											{contest.name} as well as{' '}
											<a
												href="http://www.reedexpo.com/Contact-Us"
												target="_blank"
												rel="noopener noreferrer"
											>
												other Reed Exhibitions companies
											</a>{' '}
											and that they may send me information on related products, services and other
											events via email or sms.
										</div>
									</>
								</Grid>
							</div>
						}
						footer={
							<div className="center">
								<div className="pull-left mx-10">
									<Button
										variant="outlined"
										infoKey="deleteTasting"
										disabled={isLoading}
										onHandleClick={this.onHideTermModal}
									>
										Cancel
									</Button>
								</div>
								<div className="pull-right mx-10">
									<Button
										variant="default"
										infoKey="deleteTasting"
										onHandleClick={this.onRequest}
										disabled={!acceptedTerms || isLoading}
									>
										{isLoading ? <Spinner inline light small /> : 'Confirm'}
									</Button>
								</div>
							</div>
						}
					/>
				)}
				{error && (
					<DialogBox
						title={'error_title'}
						errorBox={true}
						description={`Error while sending the request. Please try again later.`}
						noCallback={() => this.setState({error: false})}
					/>
				)}
			</div>
		);
	}
}

export default withRouter(NonMember);
