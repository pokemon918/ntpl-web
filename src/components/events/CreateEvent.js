import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './EventDetails.scss';

import L18nText from 'components/shared/L18nText';
import Grid from 'components/shared/ui/Grid';
import Radio from 'components/shared/ui/Radio';
import TextInput from 'components/shared/ui/TextInput';
import TextArea from 'components/shared/ui/TextArea';
import WineList from 'components/wineList/WineList';
import './CreateEvent.scss';
import Button from 'components/shared/ui/Button';
import Checkbox from 'components/shared/ui/Checkbox';
import {FaCalendarAlt} from 'react-icons/fa';
import dateFnsFormat from 'date-fns/format';
import {setHours} from 'date-fns';
import blindVisibility from './blindVisiblility.json';
import availableTastingToolsList from './availableTastingTools.json';

import Dropover from 'components/shared/ui/Dropover';

const currencies = [
	{id: 1, description: 'European Dollar', key: 'EUR'},
	{id: 2, description: 'US Dollar', key: 'USD'},
	{id: 3, description: 'GBP', key: 'GBP'},
	{id: 4, description: 'Japan', key: 'YEN'},
	{id: 5, description: 'Danish', key: 'DKK'},
];

const formatDate = (date) => {
	return dateFnsFormat(date, 'YYYY-MM-DD hh:mm');
};

class CreateEvent extends Component {
	state = {
		name: '',
		description: '',
		startDate: '',
		endDate: '',
		location: '',
		organizedBy: '',
		host: '',
		price: '',
		seats: '',
		priceValue: '',
		selectSeats: '',
		currency: 'EUR',
		visibility: '',
		noOfSeats: '',
		availableTastingTools: [],
		tastingType: '',
		showCurrency: false,
		blindTastingVisibility: ['alias'],
	};

	onHideCurrencyModal = () => {
		this.setState({showCurrency: false});
	};

	onHideCurrencyModal = () => {
		this.setState({showCurrency: true});
	};

	onSubmit = () => {
		const {
			name,
			description,
			startDate,
			endDate,
			location,
			organizedBy,
			host,
			price,
			priceValue,
			seats,
			currency,
			visibility,
			blindTastingVisibility,
			tastingType,
			selectSeats,
			availableTastingTools,
		} = this.state;

		const payload = {
			name: name,
			description: description,
			startDate: formatDate(startDate),
			endDate: formatDate(endDate),
			location,
			organizedBy,
			host,
			price: {
				type: price,
				price: priceValue,
				currencies: price !== 'free' ? currency : '',
			},
			seats: {
				type: selectSeats,
				availableSetas: selectSeats === 'limited' ? seats : '',
			},
			visibility,
			blindTastingVisibility: tastingType === 'blind' ? blindTastingVisibility : '',
			availableTastingTools,
			tastingType,
		};

		return payload;
	};

	onTextFieldChange = (value, data) => {
		this.setState({[data]: value});
	};

	onTextAreaChange = (e) => {
		this.setState({description: e});
	};

	checkBoxCallback(value, id) {
		if (
			this.state[id].includes(value) ||
			this.state.availableTastingTools.length === availableTastingToolsList.length
		) {
			if (value === 'all') {
				return this.setState({[id]: []});
			}

			return this.setState({
				[id]: this.state[id].filter((item) => item !== value).filter((item) => item !== 'all'),
			});
		} else {
			let result = this.state[id];

			if (value === 'all') {
				result = [];
				result.push(...availableTastingToolsList.map((tool) => tool.name));
			} else {
				result.push(value);
			}

			return this.setState({[id]: result});
		}
	}

	handleStartChange = (date) => {
		this.setState({
			startDate: date,
		});
	};

	handleEndChange = (date) => {
		this.setState({
			endDate: date,
		});
	};

	handleChangeOption = (value, id) => {
		if (id === 'price') {
			this.setState({priceValue: '', currency: '', showCurrency: false});
		}

		if (id === 'visibility') {
			this.setState({blindTastingVisibility: []});
		}

		this.setState({[id]: value});
	};

	isAllToolsSelected = (value) => {
		const {availableTastingTools} = this.state;

		if (availableTastingTools.includes('all')) {
			return true;
		}

		if (availableTastingTools.length === availableTastingToolsList.length) {
			return true;
		}

		if (availableTastingTools.includes(value)) {
			return true;
		}

		return false;
	};

	getSelectedBlindTasting = (value) => {
		const {blindTastingVisibility} = this.state;

		return blindTastingVisibility.includes(value);
	};
	render() {
		const {price, startDate, selectSeats, tastingType, showCurrency} = this.state;

		return (
			<div className="CreateEvent__Wrapper">
				<div className="CreateEvent__Info">
					<div>
						<div className="CreateEvent__Title spacing">Event for Wine Team 1994</div>
						<div className="CreateEvent__Description">
							<L18nText id={'event_info'} defaultMessage="Event Info" />
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<L18nText id={'app_name'} defaultMessage="Name" />
							</div>
							<div className="CreateEvent__Section__Value">
								<TextInput
									infoKey="name"
									label="Enter event name"
									onChange={this.onTextFieldChange}
								/>
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<L18nText id={'app_description'} defaultMessage="Description" />
							</div>
							<div className="CreateEvent__Section__Value">
								<TextArea
									placeholder={'Enter description'}
									onChange={(e) => this.onTextAreaChange(e.target.value)}
									infoKey="description"
								/>
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<L18nText id={'app_date_time'} defaultMessage="Date & time" />
							</div>
							<div className="CreateEvent__Section__Value">
								<div className="CreateEvent__Date__Column">
									<Grid>
										<L18nText id={'event_starts_on'} defaultMessage="Starts on" />
										<div className="CreateEvent__DatePicker">
											<DatePicker
												selected={this.state.startDate}
												onChange={this.handleStartChange}
												placeholderText="Select date & time"
												timeInputLabel="Time:"
												dateFormat="MM/dd/yyyy h:mm aa"
												showTimeSelect
												timeFormat="HH:mm"
												timeIntervals={30}
												minDate={new Date()}
												timeCaption="Time"
												todayButton="Today"
											/>
											<span className="CreateEvent__Icon">
												<FaCalendarAlt />
											</span>
										</div>
									</Grid>
								</div>
								<div className="CreateEvent__Date__Column">
									<Grid>
										<L18nText id={'event_ends_on'} defaultMessage="Ends on" />
										<div className="CreateEvent__DatePicker">
											<DatePicker
												selected={this.state.endDate}
												onChange={this.handleEndChange}
												placeholderText="Select date & time"
												timeInputLabel="Time:"
												dateFormat="MM/dd/yyyy h:mm aa"
												showTimeSelect
												timeIntervals={30}
												disabled={!startDate}
												startDate={startDate}
												minDate={startDate}
												timeFormat="HH:mm"
												todayButton="Today"
												minTime={startDate}
												maxTime={setHours(new Date(), 24)}
											/>
											<span className="CreateEvent__Icon">
												<FaCalendarAlt />
											</span>
										</div>
									</Grid>
								</div>
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<L18nText id={'app_location'} defaultMessage="Location" />
							</div>
							<div className="CreateEvent__Section__Value">
								<TextInput
									label={'Location'}
									infoKey="location"
									onChange={this.onTextFieldChange}
								/>
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<L18nText id={'event_organised_by'} defaultMessage="Organised by" />
							</div>
							<div className="CreateEvent__Section__Value">
								<TextInput
									infoKey="organizedBy"
									label={'Organised by'}
									onChange={this.onTextFieldChange}
								/>
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<L18nText id={'event_host'} defaultMessage="Host" />
							</div>
							<div className="CreateEvent__Section__Value">
								<TextInput infoKey="host" label={'Host'} onChange={this.onTextFieldChange} />
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<L18nText id={'event_price'} defaultMessage="Price" />
							</div>
							<div className="CreateEvent__Section__Value">
								<Radio
									onChange={() => this.handleChangeOption('free', 'price')}
									id={'free'}
									label="Free"
									name={'price'}
								/>
								<div className="CreateEvent__Section__Price">
									<div className="CreateEvent__Section__Title">
										<Radio
											onChange={() => this.handleChangeOption('priced', 'price')}
											id={'priced'}
											label="Priced"
											name={'price'}
										/>
									</div>
									<div className="CreateEvent__Section__Title">
										<TextInput
											label={'Enter price'}
											infoKey="priceValue"
											onChange={this.onTextFieldChange}
											disabled={price !== 'priced'}
										/>
										{'     '}
									</div>
									<div className="CreateEvent__Section__Title">
										{showCurrency && (
											<Dropover
												title={'Select Currency'}
												onClose={this.onHideCurrencyModal}
												options={currencies}
												disabled={price !== 'priced'}
												onSelect={(e) => this.handleChangeOption(e.key, 'currency')}
											/>
										)}
										<TextInput
											type="text"
											onFocus={() => this.onShowCurrencyModal()}
											value={'EUR'}
											infoKey={'title'}
											isDropover
											readOnly
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<L18nText id={'event_seats'} defaultMessage="Seats" />
							</div>
							<div className="CreateEvent__Section__Value">
								<Radio
									onChange={() => this.handleChangeOption('unlimited', 'selectSeats')}
									id={'unlimitedSeatings'}
									label="Unlimited seating"
									name={'selectSeats'}
								/>
								<div className="CreateEvent__Section__Price">
									<div className="CreateEvent__Section__Title">
										<Radio
											onChange={() => this.handleChangeOption('limited', 'selectSeats')}
											id={'limited'}
											label="Limited Seating"
											name={'selectSeats'}
										/>
									</div>
									<div className="CreateEvent__Section__Title">
										<TextInput
											id={'noOfSeats'}
											label={'Enter no. of seats'}
											infoKey="seats"
											disabled={selectSeats !== 'limited'}
											onChange={this.onTextFieldChange}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<div>
									<L18nText id={'app_visibility'} defaultMessage="Visibility" />
								</div>
								<div className="CreateEvent__SubSection">
									<L18nText
										id={'app_visibility_description'}
										defaultMessage="Choose who can see this event"
									/>
								</div>
							</div>
							<div className="CreateEvent__Section__Value">
								<Radio
									onChange={() => this.handleChangeOption('group', 'visibility')}
									id={'group'}
									label="Group members only"
									name={'visibility'}
								/>
								<Radio
									onChange={() => this.handleChangeOption('public', 'visibility')}
									id={'public'}
									label="Public"
									subLabel="app_visibility_all"
									name={'visibility'}
								/>
							</div>
						</div>
						<div className="CreateEvent__Description CreatEvent__Margin">
							<L18nText id="event_tasting_configuration" defaultMessage="Tasting Configuration" />
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<div>
									<L18nText id="event_available_tasting" defaultMessage="Available Tasting Tools" />
								</div>
							</div>
							<div className="CreateEvent__Section__Value">
								<Checkbox
									label={<L18nText id="app.all" defaultMessage="All" />}
									value={this.isAllToolsSelected()}
									onChange={() => this.checkBoxCallback('all', 'availableTastingTools')}
								/>
								<hr />
								{availableTastingToolsList.map((tool) => (
									<Checkbox
										value={this.isAllToolsSelected(tool.name)}
										label={<L18nText id={tool.id} defaultMessage="Others" />}
										onChange={() => this.checkBoxCallback(tool.name, 'availableTastingTools')}
									/>
								))}
							</div>
						</div>
						<div className="CreateEvent__Section">
							<div className="CreateEvent__Section__Title">
								<div>
									<L18nText id="tasting_type" defaultMessage="Tasting Type" />
								</div>
							</div>
							<div className="CreateEvent__Section__Value">
								<Radio
									onChange={() => this.handleChangeOption('regular', 'tastingType')}
									id={'regular'}
									label="Regular Tasting"
									name={'tasting'}
								/>
								<div className="CreateEvent__Section__Value">
									<Radio
										onChange={() => this.handleChangeOption('blind', 'tastingType')}
										id={'blind'}
										label="Blind Tasting"
										name={'tasting'}
									/>
								</div>
							</div>
						</div>
						{tastingType === 'blind' && (
							<div className="CreateEvent__Section">
								<div className="CreateEvent__Section__Title">
									<div>
										<L18nText
											id="event_visibility_blind"
											defaultMessage="Blind tasting visibility"
										/>
									</div>
									<div className="CreateEvent__SubSection">
										<L18nText
											id={'event_visibility_blind_description_v1'}
											defaultMessage="You can choose exactly how much information to display about the wines to users that perform the tasting."
										/>
									</div>
									<div className="CreateEvent__SubSection">
										<L18nText
											id={'event_visibility_blind_description_v2'}
											defaultMessage="Due to the nature of blind tastings, wine names are always hidden and replaced by an alias."
										/>
									</div>
								</div>
								<div className="CreateEvent__Section__Value">
									{blindVisibility.map((blind) => (
										<Checkbox
											value={blind.default || this.getSelectedBlindTasting(blind.name)}
											disabled={blind.default}
											label={<L18nText id={blind.id} defaultMessage="Others" />}
											onChange={() => this.checkBoxCallback(blind.name, 'blindTastingVisibility')}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="CreateEvent__WineList">
					<Grid size={10}>
						<div className="CreatEvent__Margin">
							<WineList />
						</div>
					</Grid>
				</div>
				<div className="CreateEvent__Footer">
					<Button onHandleClick={this.onSubmit}>
						<L18nText id={'publish_event'} defaultMessage="Publish Event" />
					</Button>
				</div>
			</div>
		);
	}
}

export default CreateEvent;
