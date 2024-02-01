import React, {Component} from 'react';
import TextInput from 'components/shared/ui/TextInput';

export default class InfoField extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
	}

	handleChange(value) {
		this.props.infoCallBack({[this.props.infoKey]: value});
	}

	handleFocus() {
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}

	handleBlur(value) {
		if (this.props.autoSuggestCallBack) {
			this.props.autoSuggestCallBack({[this.props.infoKey]: value});
		}
	}

	render() {
		let label = this.props.placeholder ? this.props.placeholder : '';

		if (['tasting_name', 'tasting_vintage'].includes(this.props.infoKey)) {
			label = `${this.props.placeholder}*`;
		}

		return (
			<TextInput
				label={label}
				type="text"
				onChange={this.handleChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				value={this.props.value.toString()}
				infoKey={this.props.infoKey}
				disabled={this.props.disabled}
			/>
		);
	}
}

InfoField.defaultProps = {
	required: false,
	disabled: false,
	value: '',
};
