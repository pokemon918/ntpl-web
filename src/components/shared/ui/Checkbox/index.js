import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {ReactComponent as CheckBox} from './Icon_CheckDefault.svg';
import {ReactComponent as CheckBoxSelected} from './Icon_CheckSelected.svg';

import './Checkbox.scss';
import L18nText from 'components/shared/L18nText';

class Checkbox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isChecked: this.props.value || false,
		};
	}

	get isChecked() {
		if (typeof this.props.value !== 'undefined') {
			return this.props.value;
		}

		return this.state.isChecked;
	}

	onHandleClick = () => {
		const {id, onChange, disabled} = this.props;

		if (!disabled) {
			const newChecked = !this.isChecked;

			this.setState({
				isChecked: newChecked,
			});

			if (id) {
				onChange(newChecked, id);
			} else {
				onChange(newChecked);
			}
		}
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			const {value} = nextProps;

			this.setState({isChecked: value});
		}
	}

	render() {
		const {label, infoKey, small, disabled, isValid} = this.props;
		const checkBoxContext = classnames('Checkbox__Context', {
			active: this.state.isChecked,
		});

		const checkBoxClass = classnames('disabled', {
			glow: isValid,
		});

		return (
			<div className={classnames('Checkbox__Container', {small, disabled})}>
				<div className="Checkbox__Wrapper" onClick={this.onHandleClick} data-test={infoKey}>
					<div className={checkBoxContext} data-testid="checkbox-input">
						{this.isChecked ? (
							<CheckBoxSelected className="disabled" />
						) : (
							<CheckBox className={checkBoxClass} />
						)}
					</div>
					<span className="Checkbox_Label">
						<L18nText id={label} defaultMessage={label} />
					</span>
				</div>
			</div>
		);
	}
}

Checkbox.propTypes = {
	value: PropTypes.bool,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	onChange: PropTypes.func.isRequired,
};

Checkbox.defaultProps = {
	onChange: () => {},
};

export default Checkbox;
