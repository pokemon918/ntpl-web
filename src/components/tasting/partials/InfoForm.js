import React, {Component} from 'react';
import {connect} from 'react-redux';
import info from 'assets/json/tasting/info.json';
import dev from 'assets/json/dev.json';
import {updateSelectedItem} from 'actions/multiStepFormActions';
import YearPicker from 'components/shared/ui/YearPicker';
import Grid from 'components/shared/ui/Grid';
import InfoField from './InfoField';
import appConfig from 'config/app';
import {autoSuggestConstants} from 'const';
import L18nText from 'components/shared/L18nText';
import Modal from 'components/shared/ui/Modal';
import Button from 'components/shared/ui/Button';
import AutoSuggestInput from 'components/shared/ui/AutoSuggestInput';

class InfoForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			openDatePick: false,
		};

		this.updateSelectedInfo = this.updateSelectedInfo.bind(this);
		this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
		this.autofillForm = this.autofillForm.bind(this);

		if (
			(props.multiStepForm.selectedItems.info === undefined ||
				props.multiStepForm.selectedItems.info === null) &&
			props.multiStepForm.mode === 'form'
		) {
			this.resetForm();
		}
	}

	onChangeDatePicker = () => {
		this.setState((props) => {
			return {openDatePick: !props.openDatePick};
		});
	};

	resetForm() {
		let tastingSrc = this.props.multiStepForm.tastingSrc || {};

		let infoKey = info && info.keys[0];

		tastingSrc[infoKey] &&
			tastingSrc[infoKey].forEach((infoName, index) => {
				this.updateSelectedInfo({[infoName]: ''});
			});
	}

	async updateSelectedInfo(value) {
		this.props.updateSelectedItem('info', value);

		if (value.tasting_vintage === null || value.tasting_vintage) {
			this.props.updateSelectedItem('info', {
				tasting_vintage: value.tasting_vintage || 'Non vintage',
			});
			this.onChangeDatePicker();
		}
	}

	getAutoSuggestItems = (fieldName) => {
		const {items, filter} = autoSuggestConstants[fieldName];

		if (typeof filter === 'function') {
			const infoData = this.props.multiStepForm.selectedItems.info;
			return filter(items, infoData);
		}

		return items;
	};

	updateAutoSuggestValue = (fieldName, infoData, item, cleanup) => {
		const {valueKey, displayKey, enableFreeText, afterChange} = autoSuggestConstants[fieldName];

		const idKey = `${fieldName}_key`;
		const idValue = item ? item[valueKey] : '';
		this.updateSelectedInfo({[idKey]: idValue});

		if (enableFreeText) {
			const nameKey = fieldName;
			const nameValue = item ? item[displayKey] : '';
			this.updateSelectedInfo({[nameKey]: nameValue.trimStart()});
		}

		if (typeof afterChange === 'function') {
			const callbacks = {updateSelectedInfo: this.updateSelectedInfo, cleanup};
			afterChange(item, infoData, callbacks);
		}
	};

	handleAutoSuggest(value) {
		// temporarily disabled
		// this.props.getAutoSuggest(value);
	}

	autofillForm(event) {
		event.preventDefault();
		let tastingSrc = this.props.multiStepForm.tastingSrc;
		let infoKey = info.keys[0];
		let infoAutoFill = dev.autofill[infoKey];

		tastingSrc[infoKey].forEach((infoName, index) => {
			this.updateSelectedInfo({[infoName]: infoAutoFill[infoName]});
		});
	}

	getAutoFillButton() {
		let autoFillBtn = null;

		if (appConfig.DEV_MODE) {
			autoFillBtn = (
				<div className="auto-fill-wrapper" style={{textAlign: 'center'}}>
					<button onClick={this.autofillForm}>
						<L18nText id="tasting_auto_fill" defaultMessage="AutoFill" />
					</button>
				</div>
			);
		}

		return autoFillBtn;
	}

	getInfoFields() {
		const {initState} = this.props;
		let mode = this.props.multiStepForm.mode;
		let tastingSrc = this.props.multiStepForm.tastingSrc;
		let infoKey = info.keys[0];
		let infoData = this.props.multiStepForm.selectedItems.info;
		let infoFields = [];

		if (infoData) {
			infoFields = tastingSrc[infoKey].map((infoName, index) => {
				let disableInput;
				if (initState && initState.hasOwnProperty(infoName)) {
					disableInput = true;
				}
				if (infoName === 'tasting_vintage') {
					return (
						<L18nText key={index} id={infoName + '_placeholder'}>
							{(placeholder) => {
								return this.state.openDatePick ? (
									<Modal
										onClose={this.onChangeDatePicker}
										title="app_select_vintage"
										body={
											<Grid columns={4}>
												<div className="center-abs">
													<YearPicker
														selectedYear={infoData[infoName]}
														onSelect={this.updateSelectedInfo}
														infoKey={infoName}
														isStatic={true}
													/>
												</div>
											</Grid>
										}
										footer={
											<div className="pd-10 Modal__Container__Footer_Background">
												<Button variant="outlined" onHandleClick={this.onChangeDatePicker}>
													<L18nText id="app_close" defaultMessage="Close" />
												</Button>
											</div>
										}
									/>
								) : (
									<InfoField
										key={index}
										infoKey={infoName}
										placeholder={placeholder}
										onFocus={this.onChangeDatePicker}
										required={info.required.includes(infoName)}
										value={infoData && infoData[infoName] ? infoData[infoName] : ''}
										disabled={disableInput || mode === 'showcase'}
									/>
								);
							}}
						</L18nText>
					);
				} else if (infoName in autoSuggestConstants) {
					const {valueKey, displayKey, enableFreeText, type} = autoSuggestConstants[infoName];
					const items = this.getAutoSuggestItems(infoName);
					const currentValue = infoData[`${infoName}_key`];
					const activeItem = items.find((item) => item && item[valueKey] === currentValue);
					const currentFreeText = enableFreeText ? {[displayKey]: infoData[infoName]} : null;

					return (
						<L18nText key={index} id={infoName + '_placeholder'}>
							{(placeholder) => (
								<AutoSuggestInput
									infoName={infoName}
									label={placeholder}
									items={items}
									type={type}
									valueKey={valueKey}
									displayKey={displayKey}
									value={activeItem || currentFreeText}
									onSelectItem={(item, cleanup) =>
										this.updateAutoSuggestValue(infoName, infoData, item, cleanup)
									}
									enableFreeText={enableFreeText}
								/>
							)}
						</L18nText>
					);
				} else {
					return (
						<L18nText key={index} id={infoName + '_placeholder'}>
							{(placeholder) => (
								<InfoField
									key={index}
									infoKey={infoName}
									placeholder={placeholder}
									infoCallBack={this.updateSelectedInfo}
									autoSuggestCallBack={this.handleAutoSuggest}
									required={info.required.includes(infoName)}
									value={infoData && infoData[infoName] ? infoData[infoName] : ''}
									disabled={disableInput || mode === 'showcase'}
								/>
							)}
						</L18nText>
					);
				}
			});
		}

		return infoFields;
	}

	render() {
		return (
			<Grid columns={6}>
				<form action="" className="info-form">
					{this.getInfoFields()}
					{this.getAutoFillButton()}
				</form>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		multiStepForm: state.multiStepForm,
		info: state.info,
	};
}

export default connect(mapStateToProps, {
	updateSelectedItem,
})(InfoForm);
