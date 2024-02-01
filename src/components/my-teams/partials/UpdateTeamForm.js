import React, {Component} from 'react';
import {InputText} from 'components/shared';
import L18nText from 'components/shared/L18nText';
import DropoverInput from 'components/shared/ui/DropoverInput';

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

export default class UpdateTeamForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.data.name ? props.data.name : '',
			description: props.data.description ? props.data.description : '',
			city: props.data.city ? props.data.city : '',
			country: props.data.country ? props.data.country : '',
			avatar: '',
			imagePreviewUrl: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.clearFields = this.clearFields.bind(this);
		this.uploadInput = React.createRef();
	}

	handleSubmit(event) {
		let teamData = {
			name: this.state.name,
			description: this.state.description,
			avatar: this.state.avatar,
			city: this.state.city,
			country: this.state.country,
		};
		this.props.saveCallback(teamData, this.clearFields);
	}

	onHideCityModal = () => {
		this.setState({showCityModal: false});
	};

	onShowCityModal = (subject) => {
		this.setState({showCityModal: true});
	};

	clearFields() {
		this.setState({
			name: '',
			description: '',
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

	handleLocationChange = (location) => {
		this.onHideCityModal();
		this.setState({
			city: location.city,
			country: location.country,
		});
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

	render() {
		let textAreaStyle = {
			padding: '7px',
			width: '100%',
			minHeight: '150px',
		};
		const teamImageUrl = this.props.data.avatar
			? `${this.props.serverUrl}/images/${this.props.data.avatar}`
			: '';

		return (
			<div className="create-team-form">
				<form onSubmit={this.handleSubmit} className="create-team-form" method="POST">
					<InputText
						label="team_create_input_name_label"
						id="channel-name"
						name="name"
						value={this.state.name}
						placeholder="team_create_input_name_placeholder"
						handleChange={this.handleChange}
					/>

					<L18nText id="team_create_textarea" defaultMessage="Team description">
						{(placeholder) => (
							<textarea
								id="channel-description"
								name="description"
								value={this.state.description}
								placeholder={placeholder}
								onChange={this.handleChange}
								style={textAreaStyle}
							/>
						)}
					</L18nText>

					<div className="UpdateTeamForm__Location">
						<label>
							<L18nText id="team_location" defaultMessage="Location" />:
						</label>
						<DropoverInput
							label="Please select city"
							hideTextLabel
							options={cityList}
							value={this.state.city}
							onSelect={this.handleLocationChange}
						/>
					</div>

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
								{(this.state.imagePreviewUrl || teamImageUrl) && (
									<img src={this.state.imagePreviewUrl || teamImageUrl} alt="avatar" />
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
