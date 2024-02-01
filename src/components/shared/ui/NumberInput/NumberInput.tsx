import React, {FC, useState} from 'react';
import NumberFormat, {NumberFormatValues} from 'react-number-format';

import {scrollToActiveLabel} from 'commons/commons';
import L18nText, {useL18nText} from 'components/shared/L18nText';

interface Props {
	className?: string;

	label?: string;

	defaultValue?: number;

	disabled?: boolean;

	isAllowed?: (values: NumberFormatValues) => boolean;

	onValueChange: (values: NumberFormatValues) => void;
}

const NumberInput: FC<Props> = ({
	className,
	label,
	defaultValue,
	disabled,
	isAllowed,
	onValueChange,
}) => {
	const [labelVisible, setLabelVisible] = useState(false);
	const [value, setValue] = useState(defaultValue);
	const placeholder = useL18nText(label);

	return (
		<div className="TextInput__Container">
			<label className={labelVisible || !!value ? 'TextInput__Label__Visible' : ''}>
				{label && <L18nText id={label} defaultMessage={label} />}
			</label>
			<span className="TextInput__Input_Field pointer">
				<NumberFormat
					className={className}
					placeholder={!labelVisible ? placeholder : ''}
					defaultValue={value}
					disabled={disabled}
					isAllowed={isAllowed}
					onValueChange={(value) => {
						setValue(value.floatValue);
						onValueChange(value);
					}}
					thousandSeparator={true}
					decimalScale={2}
					onFocus={(event) => {
						if (!disabled) {
							setLabelVisible(true);
							scrollToActiveLabel(event);
						}
					}}
					onBlur={(event) => {
						setLabelVisible(false);
					}}
				/>
			</span>
		</div>
	);
};

export default NumberInput;
