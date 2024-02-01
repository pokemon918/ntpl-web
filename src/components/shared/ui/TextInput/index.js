import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {injectIntl} from 'react-intl';

import L18nText from 'components/shared/L18nText';

import './TextInput.scss';
import {scrollToActiveLabel} from 'commons/commons';

class TextInput extends React.Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
	}

	state = {
		labelVisible: false,
		value: '',
	};

	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.props.onEnterKeyPress();
		}
		if (this.props.type === 'number') {
			const {key} = event;
			if (key.search(/[0-9]/) < 0) {
				event.preventDefault();
				return;
			}
		}
		this.props.onKeyPress(event);
	};

	onInputKeyDown = (e) => {
		this.props.onKeyDown(e);
		scrollToActiveLabel(e);
	};

	render() {
		const {
			intl,
			name,
			label,
			placeholder,
			type,
			small,
			inline,
			readOnly,
			onChange,
			onFocus,
			onBlur,
			innerRef,
			infoKey,
			isDropover,
			hideTextLabel,
			disabled,
		} = this.props;
		const {labelVisible} = this.state;
		const value = this.props.value || this.state.value;
		const textInputClass = classNames('TextInput__Container', {small, inline, disabled});
		const inputClass = classNames({dropover: isDropover});
		const labelText = label && intl.formatMessage({id: label});
		const placeholderText = placeholder && intl.formatMessage({id: placeholder});
		const displayedPlaceholderText = placeholderText || (!labelVisible && labelText) || '';

		return (
			<div className={textInputClass} ref={this.myRef}>
				{!hideTextLabel && (
					<label className={labelVisible || !!value ? 'TextInput__Label__Visible' : ''}>
						{label && <L18nText id={label} defaultMessage={label} />}
					</label>
				)}
				<span className="TextInput__Input_Field pointer">
					<input
						type={type}
						name={name}
						value={value}
						className={inputClass}
						disabled={disabled}
						autoComplete="new-password"
						data-test={infoKey}
						data-event={this.props.dataEvent}
						readOnly={readOnly}
						onChange={(e) => {
							// store state only for uncontrolled inputs
							// scrollToActiveLabel(e);
							if (this.props.value === undefined) {
								this.setState({value: e.target.value});
							}
							onChange(e.target.value, infoKey);
						}}
						placeholder={displayedPlaceholderText}
						onFocus={(event) => {
							this.setState({labelVisible: true});
							scrollToActiveLabel(event);
							if (onFocus) {
								onFocus(event);
							}
						}}
						onBlur={(event) => {
							this.setState({labelVisible: false});
							onBlur(event);
						}}
						onKeyPress={this.handleKeyPress}
						onKeyDown={this.onInputKeyDown}
						ref={innerRef}
					/>
				</span>
			</div>
		);
	}
}

TextInput.propTypes = {
	label: PropTypes.string,
	type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
	small: PropTypes.bool,
	inline: PropTypes.bool,
	readOnly: PropTypes.bool,
	value: PropTypes.string,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onKeyDown: PropTypes.func,
	onKeyPress: PropTypes.func,
	onEnterKeyPress: PropTypes.func,
	infoKey: PropTypes.string,
	innerRef: PropTypes.func,
};

TextInput.defaultProps = {
	type: 'text',
	onChange: () => {},
	onFocus: () => {},
	onBlur: () => {},
	onKeyDown: () => {},
	onKeyPress: () => {},
	onEnterKeyPress: () => {},
};

export default injectIntl(TextInput);
