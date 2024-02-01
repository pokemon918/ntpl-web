import React, {FC, useState} from 'react';
import classNames from 'classnames';
import {NumberFormatValues} from 'react-number-format';

import {appConstants} from 'const';
import Dropdown from '../Dropdown';
import NumberInput from '../NumberInput';
import Radio from '../Radio';

import './EventPrice.scss';

const currencyOptions = [
	{currency: 'EUR'},
	{currency: 'USD'},
	{currency: 'GBP'},
	{currency: 'YEN'},
	{currency: 'DKK'},
];

type PriceType = 'free' | 'priced';

export interface EventPriceValue {
	type?: PriceType;
	price?: number;
	currency?: string;
}

interface Props {
	name: string;
	onChange?: (priceInfo: EventPriceValue) => void;
}

const EventPrice: FC<Props> = ({name, onChange}) => {
	const [value, setValue] = useState<EventPriceValue>({});
	const isFree = value.type === 'free';
	const isPriced = value.type === 'priced';

	const changeValue = (changes: Partial<EventPriceValue>) => {
		const newValue = {...value, ...changes};
		setValue(newValue);
		onChange?.(newValue);
	};

	const handleTypeChange = (type: PriceType) => {
		changeValue({type});
	};

	const handlePriceChange = (price: number) => {
		changeValue({price});
	};

	const handleCurrencyChange = ({currency}: {currency: string}) => {
		changeValue({currency});
	};

	const validatePriceInput = (values: NumberFormatValues) => {
		const {formattedValue, floatValue} = values;
		return formattedValue === '' || parseFloat('' + floatValue) <= appConstants.MAX_PRICE_RANGE;
	};

	return (
		<div>
			<Radio
				name={name}
				id="free"
				label="event_field_price_free"
				isChecked={isFree}
				onChange={() => handleTypeChange('free')}
				small
			/>
			<div className="EventPrice__CombinedInputs">
				<Radio
					name={name}
					id="priced"
					label="event_field_price_priced"
					isChecked={isPriced}
					onChange={() => handleTypeChange('priced')}
					small
				/>
				<span
					className={classNames('EventPrice__PriceContainer', {
						EventPrice__PriceDisabled: !isPriced,
					})}
				>
					<NumberInput
						label="app_price"
						className="EventPrice__PriceInput"
						defaultValue={value.price}
						disabled={!isPriced}
						isAllowed={validatePriceInput}
						onValueChange={(value) => handlePriceChange(value.floatValue || 0)}
					/>
					<Dropdown
						items={currencyOptions}
						label="app_currency"
						customClass="EventPrice__Dropdown"
						valueKey="currency"
						displayKey="currency"
						onSelectItem={handleCurrencyChange}
					/>
				</span>
			</div>
		</div>
	);
};

export default EventPrice;
