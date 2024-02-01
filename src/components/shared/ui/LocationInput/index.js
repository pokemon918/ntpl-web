import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'components/shared/ui/TextInput';
import Button from 'components/shared/ui/Button';
import {_retryGet} from 'commons/commons';
import {ReactComponent as CurrentLocation} from './Location_Icon.svg';

import './LocationInput.scss';
import DialogBox from '../DialogBox';
import SelectModal from '../SelectModal';
import bugsnagClient from 'config/bugsnag';

class LocationInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			positions: [],
			showSortOrderModal: false,
			showErrorModal: false,
			longitude: '',
			latitude: '',
		};
	}

	onCloseErrorModal = () => {
		this.setState({
			showErrorModal: false,
		});
	};

	onCloseModal = () => {
		this.setState({
			showSortOrderModal: false,
		});
	};

	handleTextChange = async (value) => {
		const hasText = value && value.length > 0;
		await this.setState({value, isUserText: hasText});
		this.triggerOnChangeEvent();
	};

	handleGeoLocatorClick() {
		let currentPosition = [];
		let path =
			'https://nominatim.openstreetmap.org/reverse?zoom=18&format=geojson&addressdetails=1';

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					path = `${path}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
					const data = await _retryGet(path);
					data[1].data.features.forEach((location) => {
						const obj = location.properties.address;

						if (obj.road) {
							currentPosition.push(obj.road);
						}

						if (obj.town) {
							currentPosition.push(obj.town);
						}

						if (obj.neighbourhood) {
							currentPosition.push(obj.neighbourhood);
						}

						if (obj.suburb) {
							currentPosition.push(obj.suburb);
						}

						if (obj.city) {
							currentPosition.push(obj.city);
						}
					});

					this.setState({positions: currentPosition});

					if (!this.state.showSortOrderModal) {
						this.setState({
							longitude: position.coords.longitude,
							latitude: position.coords.latitude,
							showSortOrderModal: true,
						});
					}
				},
				() => {
					this.setState({
						showErrorModal: true,
					});
					bugsnagClient.notify(new Error('Failed to locate location'), {
						metadata: {error: 'Failed to locate location'},
					});
				}
			);
		}
	}

	setSelectedItem = async (item) => {
		if (!this.state.isUserText) {
			await this.setState({
				value: item,
			});
		}

		this.triggerOnChangeEvent();

		this.setState({
			showSortOrderModal: false,
		});
	};

	triggerOnChangeEvent = () => {
		const {longitude, latitude, value} = this.state;
		const obj = {
			name: value,
			lat: latitude,
			lng: longitude,
		};
		this.props.onChange(obj);
	};

	render() {
		const {value, showSortOrderModal, showErrorModal, positions} = this.state;
		const {infoKey, label} = this.props;
		return (
			<div className="LocationInput__Container">
				{showErrorModal && (
					<DialogBox
						errorBox={true}
						title="error_title"
						noCallback={this.onCloseErrorModal}
						description="allow_geolocation"
					/>
				)}
				<SelectModal
					title="default_select_modal_title"
					isOpen={showSortOrderModal}
					options={positions}
					onClose={this.onCloseModal}
					selectedItem={this.setSelectedItem}
				/>

				<div className="LocationInput__Field">
					<div className="LocationInput__InputField">
						<TextInput
							value={value}
							label={label ? label : 'Location'}
							infoKey={infoKey ? infoKey : ''}
							onChange={this.handleTextChange}
						/>
					</div>
					<Button variant="transparent" onHandleClick={() => this.handleGeoLocatorClick()}>
						<CurrentLocation />
					</Button>
				</div>
			</div>
		);
	}
}

LocationInput.propTypes = {
	label: PropTypes.string,
	infoKey: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

LocationInput.defaultProps = {
	onChange: () => {},
};

export default LocationInput;
