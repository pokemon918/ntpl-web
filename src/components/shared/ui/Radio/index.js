import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import L18nText from 'components/shared/L18nText';

import './Radio.scss';
const Radio = ({
	id,
	name,
	label,
	onChange,
	small = false,
	value = false,
	disabled = false,
	isChecked = false,
	type = undefined,
	subLabel = undefined,
}) => {
	return (
		<div
			className={classNames('Radio__Container', {small, disabled})}
			onClick={(event) => !disabled && onChange(id, event)}
		>
			<input
				id={id}
				type="radio"
				name={name}
				value={value || id}
				disabled={disabled}
				checked={isChecked}
				onChange={() => onChange(value || id)}
			/>
			<div className="Radio__Wrapper">
				<label htmlFor={id} className="Radio__Label">
					{label && <L18nText id={label} defaultMessage={label} values={{type: [type]}} />} &nbsp;
					{subLabel && (
						<span className="Radio__SubLabel">
							<L18nText id={subLabel} defaultMessage="(Select)" />
						</span>
					)}
				</label>
			</div>
		</div>
	);
};

Radio.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	isChecked: PropTypes.bool,
};

export default Radio;
