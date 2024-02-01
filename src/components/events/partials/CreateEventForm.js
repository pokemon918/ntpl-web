import React, {Component} from 'react';
import DatePicker from 'react-date-picker';
import Select from 'react-select';

import './CreateEventForm.scss';

import {IntlProvider, InputText} from 'components/shared';
import Checkbox from 'components/shared/ui/Checkbox';
import L18nText from 'components/shared/L18nText';

const visibilityOptions = [
	{value: 'open', label: <L18nText id="event_visibility_open" defaultMessage="Open" />},
	{value: 'unlisted', label: <L18nText id="event_visibility_hidden" defaultMessage="Hidden" />},
	{value: 'private', label: <L18nText id="event_visibility_private" defaultMessage="Private" />},
];

const tastingTypeOptions = [
	{value: 'quick', label: <L18nText id="tasting_type_quick_name" />},
	{value: 'swa20', label: <L18nText id="tasting_type_swa20_name" />},
];

export default class CreateEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			visibility: 'open',
			start_date: new Date(),
			end_date: new Date(),
			wine_refs: [],
			metadata: {
				medal_page: false,
				swa_round_2: false,
				tastingType: 'quick',
			},
			imagePreviewUrl: '',
			avatar: '',
		};
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
		this.handleWinesChange = this.handleWinesChange.bind(this);
		this.handleMedalPageChange = this.handleMedalPageChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.clearFields = this.clearFields.bind(this);
		this.uploadInput = React.createRef();
	}

	getSelectedVisibility() {
		return visibilityOptions.find((i) => i.value === this.state.visibility);
	}

	getSelectedTastingType = () => {
		return tastingTypeOptions.find((i) => i.value === this.state.metadata.tastingType);
	};

	handleSubmit(event) {
		let obj = {...this.state};
		obj.metadata = JSON.stringify(obj.metadata);
		delete obj.imagePreviewUrl;
		this.props.saveCallback(obj, this.clearFields);
	}

	clearFields() {
		this.setState({
			name: '',
			description: '',
			visibility: 'open',
			start_date: new Date(),
			end_date: new Date(),
			wine_refs: [],
			metadata: {
				medal_page: false,
				swa_round_2: false,
				tastingType: 'quick',
			},
			imagePreviewUrl: '',
			avatar: '',
		});
	}

	handleDateChange(field, value) {
		this.setState({
			[field]: value,
		});
	}

	handleChange(event) {
		const target = event.target;
		let value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	handleVisibilityChange(visibility) {
		const {value} = visibility;
		this.setState({visibility: value});
	}

	handleTastingTypeChange = (selectedTastingType) => {
		const {value} = selectedTastingType;

		this.setState({
			metadata: {
				...this.state.metadata,
				swa_round_2: false,
				tastingType: value,
			},
		});
	};

	handleWinesChange(eventWines) {
		this.setState({
			wine_refs: eventWines.map((wine) => {
				return wine.value;
			}),
		});
	}

	handleSWARound2Change = (isSWARound2) => {
		this.setState(
			{
				metadata: {
					...this.state.metadata,
					swa_round_2: isSWARound2,
				},
			},
			() => {
				this.handleMedalPageChange(isSWARound2);
			}
		);
	};

	handleMedalPageChange(medal_page) {
		this.setState({
			metadata: {
				...this.state.metadata,
				medal_page,
			},
		});
	}

	openFileBrowser = () => {
		this.uploadInput.current.click();
	};

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

	render() {
		const options = this.props.eventWines;
		const {metadata} = this.state;
		const isTastingTypeSWA = metadata.tastingType === 'swa20';

		let textAreaStyle = {
			padding: '7px',
			minHeight: '150px',
			minWidth: '100%',
		};

		return (
			<IntlProvider>
				<div className="create-event-form">
					<form onSubmit={this.handleSubmit} className="create-event-form" method="POST">
						<InputText
							label="event_popup_label"
							labelGridSize="3"
							id="event-name"
							name="name"
							value={this.state.name}
							placeholder="event_popup_placeholder"
							handleChange={this.handleChange}
						/>

						<div className="row form-group mb-3">
							<div className="col-3">
								<label className="col-form-label" htmlFor="event-start-date">
									<L18nText id="event_new_start_date" defaultMessage="Start date" />:
								</label>
							</div>
							<div className="col-9">
								<DatePicker
									label="Start Date:"
									id="event-start-date"
									name="start_date"
									value={this.state.start_date}
									onChange={(value) => this.handleDateChange('start_date', value)}
								/>
							</div>
						</div>

						<div className="row form-group mb-3">
							<div className="col-3">
								<label className="col-form-label" htmlFor="event-end-date">
									<L18nText id="event_new_end_date" defaultMessage="End date" />:
								</label>
							</div>
							<div className="col-9">
								<DatePicker
									label="End Date:"
									id="event-end-date"
									name="end_date"
									value={this.state.end_date}
									onChange={(value) => this.handleDateChange('end_date', value)}
								/>
							</div>
						</div>

						<div className="row form-group mb-3">
							<div className="col-3">
								<label className="col-form-label" htmlFor="">
									<L18nText id="event_visibility" defaultMessage="Visibility" />:
								</label>
							</div>
							<div className="col-9">
								<Select
									value={this.getSelectedVisibility()}
									onChange={this.handleVisibilityChange}
									options={visibilityOptions}
								/>
							</div>
						</div>

						<div className="row form-group mb-3">
							<div className="col-3">
								<label className="col-form-label" htmlFor="">
									<L18nText id="event_tasting_type" />:
								</label>
							</div>
							<div className="col-9">
								<Select
									value={this.getSelectedTastingType()}
									onChange={this.handleTastingTypeChange}
									options={tastingTypeOptions}
								/>
							</div>
						</div>

						<div className="row mb-3">
							<div className="col-12">
								<L18nText id="event_description" defaultMessage="Event description">
									{(placeholder) => (
										<textarea
											id="event-description"
											name="description"
											value={this.state.description}
											placeholder={placeholder}
											onChange={this.handleChange}
											style={textAreaStyle}
										/>
									)}
								</L18nText>
							</div>
						</div>

						<div className="row mb-3">
							<div className="col-12">
								<h6>
									<L18nText id="event_add_wines" defaultMessage="Add wines" />:{' '}
								</h6>
								<Select
									value={this.state.eventWines}
									onChange={this.handleWinesChange}
									options={options}
									isMulti
								/>
							</div>
						</div>

						{isTastingTypeSWA && (
							<div className="row mb-3">
								<div className="col-12">
									<h6>
										<L18nText id="event_options" defaultMessage="Options" />:{' '}
									</h6>
									<div>
										<Checkbox
											label={<L18nText id="event_swa_round_2" defaultMessage="SWA Round 2" />}
											value={metadata.swa_round_2}
											onChange={this.handleSWARound2Change}
										/>
									</div>
									<div>
										<Checkbox
											label={
												<L18nText
													id="event_medal_page_visible"
													defaultMessage="Medal page visible"
												/>
											}
											disabled={isTastingTypeSWA}
											value={metadata.medal_page}
											onChange={this.handleMedalPageChange}
										/>
									</div>
								</div>
							</div>
						)}

						<div className="row mb-3">
							<div className="col-12">
								<h6>
									<L18nText id="event_image" defaultMessage="Event Image" />:{' '}
								</h6>
								<input
									type="file"
									ref={this.uploadInput}
									id="multi"
									hidden
									accept="image/*"
									onChange={this.onChangePic}
								/>
								<div onClick={this.openFileBrowser}>
									<div className="Create_Event_Image_Wrapper">
										{this.state.imagePreviewUrl && (
											<img src={this.state.imagePreviewUrl} alt="avatar" />
										)}
										<div className="Create_Event_Image_Wrapper_Default">
											<L18nText
												id={this.state.imagePreviewUrl ? 'app_change' : 'event_add_image'}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</IntlProvider>
		);
	}
}
