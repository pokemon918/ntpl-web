import React, {Component} from 'react';
import {InputText} from 'components/shared';
import L18nText from 'components/shared/L18nText';
import Dropdown from '../../shared/ui/Dropdown';

const cityList = [
	{
		city: 'Madrid',
		country: 'ES',
	},
	{
		city: 'Barcelona',
		country: 'ES',
	},
	{
		city: 'London',
		country: 'GB',
	},
];

export default class CreateTeamForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			handle: '',
			description: '',
			visibility: 'public',
			access: 'open',
			avatar: '',
			imagePreviewUrl: '',
			city: '',
			country: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.clearFields = this.clearFields.bind(this);
		this.uploadInput = React.createRef();
	}

	handleSubmit(event) {
		let teamData = {
			name: this.state.name,
			handle: this.state.handle,
			description: this.state.description,
			visibility: this.state.visibility,
			access: this.state.access,
			avatar: this.state.avatar,
			city: this.state.city,
			country: this.state.country,
		};
		this.props.saveCallback(teamData, this.clearFields);
	}

	clearFields() {
		this.setState({
			name: '',
			handle: '',
			description: '',
			visibility: 'public',
			access: 'open',
			city: '',
			country: '',
		});
	}

	onChangePic = () => {
		const target = this.uploadInput.current;

		let reader = new FileReader();
		let file = target.files[0];

		if (file) {
			reader.onloadend = () => {
				this.setState({
					avatar: file,
					imagePreviewUrl: reader.result,
				});
			};

			reader.readAsDataURL(file);
		}
	};

	openFileBrowser = () => {
		this.uploadInput.current.click();
	};

	handleChange(event) {
		const target = event.target;
		let value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	handleLocationChange = (location) => {
		this.setState({
			city: location.city,
			country: location.country,
		});
	};

	render() {
		let radioStyle = {
			marginTop: '-3px',
		};

		let textAreaStyle = {
			padding: '7px',
			width: '100%',
			minHeight: '150px',
		};

		return (
			<div className="create-team-form">
				<form onSubmit={this.handleSubmit} className="create-team-form" method="POST">
					<InputText
						label="team_create_input_name_label"
						id="team-name"
						name="name"
						value={this.state.name}
						placeholder="team_create_input_name_placeholder"
						handleChange={this.handleChange}
					/>

					<InputText
						label="team_create_input_handle_label"
						id="team-handle"
						name="handle"
						value={this.state.handle}
						placeholder="team_create_input_handle_placeholder"
						handleChange={this.handleChange}
					/>

					<label>
						<L18nText id="team_location" defaultMessage="Location" />:
					</label>
					<Dropdown items={cityList} displayKey="city" onSelectItem={this.handleLocationChange} />

					<div className="form-group row">
						<label htmlFor="server-url" className="col-sm-2 col-form-label">
							<L18nText id="team_visibility" defaultMessage="Visibility" />:
						</label>

						<div className="col-sm-10 info-field-wrapper" style={{paddingTop: '6px'}}>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="visibility"
									id="publicRadio1"
									value={'public'}
									checked={this.state.visibility === 'public'}
									onChange={this.handleChange}
									style={radioStyle}
								/>

								<label className="form-check-label" htmlFor="publicRadio1">
									<L18nText id="team_create_checkbox_public" defaultMessage="Public" />
								</label>
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="visibility"
									id="publicRadio2"
									value={'hidden'}
									checked={this.state.visibility === 'hidden'}
									onChange={this.handleChange}
									style={radioStyle}
								/>
								<label className="form-check-label" htmlFor="publicRadio2">
									<L18nText id="team_create_checkbox_hidden" defaultMessage="Hidden" />
								</label>
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="visibility"
									id="publicRadio3"
									value={'private'}
									checked={this.state.visibility === 'private'}
									onChange={this.handleChange}
									style={radioStyle}
								/>
								<label className="form-check-label" htmlFor="publicRadio3">
									<L18nText id="team_create_checkbox_private" defaultMessage="Private" />
								</label>
							</div>
						</div>
					</div>

					<div className="form-group row">
						<label htmlFor="server-url" className="col-sm-2 col-form-label">
							<L18nText id="team_access" defaultMessage="Access" />:
						</label>

						<div className="col-sm-10 info-field-wrapper" style={{paddingTop: '6px'}}>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="access"
									id="accessRadio1"
									value="open"
									checked={this.state.access === 'open'}
									onChange={this.handleChange}
									style={radioStyle}
								/>

								<label className="form-check-label" htmlFor="accessRadio1">
									<L18nText id="team_access_open_option" defaultMessage="Open" />
								</label>
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="access"
									id="accessRadio2"
									value="apply"
									checked={this.state.access === 'apply'}
									onChange={this.handleChange}
									style={radioStyle}
								/>
								<label className="form-check-label" htmlFor="accessRadio2">
									<L18nText id="team_access_apply_option" defaultMessage="Apply" />
								</label>
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="access"
									id="accessRadio3"
									value="exclusive"
									checked={this.state.access === 'exclusive'}
									onChange={this.handleChange}
									style={radioStyle}
								/>
								<label className="form-check-label" htmlFor="accessRadio3">
									<L18nText id="team_access_exclusive_option" defaultMessage="Exclusive" />
								</label>
							</div>
						</div>
					</div>

					<L18nText id="team_create_textarea" defaultMessage="Team description">
						{(placeholder) => (
							<textarea
								id="team-description"
								name="description"
								value={this.state.description}
								placeholder={placeholder}
								onChange={this.handleChange}
								style={textAreaStyle}
							/>
						)}
					</L18nText>
					<div className="row mb-3">
						<div className="col-12">
							<h6>
								<L18nText id="team_image" defaultMessage="Team image" />:{' '}
							</h6>
							<input
								type="file"
								ref={this.uploadInput}
								id="multi"
								hidden
								accept="image/*"
								onChange={this.onChangePic}
							/>
							<div className="Create_Team_Image_Wrapper" onClick={this.openFileBrowser}>
								{this.state.imagePreviewUrl && (
									<img src={this.state.imagePreviewUrl} alt="avatar" />
								)}
								<div className="Create_Team_Image_Wrapper_Default">
									<L18nText id={this.state.imagePreviewUrl ? 'app_change' : 'team_add_image'} />
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}
