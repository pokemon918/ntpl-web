import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';

import Dropover from 'components/shared/ui/Dropover';
import NumberInput from '../NumberInput/NumberInput';
import TextInput from 'components/shared/ui/TextInput';

import './Price.scss';
import {appConstants} from 'const';

const Price = ({
	currencies,
	onHandleSelect,
	initialPrice = undefined,
	initialCurrency = undefined,
	disabledCurrency = false,
	disabledPrice = false,
	intl,
}) => {
	const [price, setPrice] = useState(initialPrice);
	const [showModal, setModalVisibility] = useState(false);
	const [currency, setCurrency] = useState(initialCurrency);

	useEffect(() => {
		onHandleSelect({price, currency});
	}, [price, currency, onHandleSelect]);

	const currentList = currencies.map((currency) => {
		return {id: currency.id, name: currency.key};
	});

	const updateModalVisibility = (e) => {
		e.target.blur();
		setModalVisibility(true);
	};
	const currencyValue = intl.formatMessage({id: initialCurrency});

	return (
		<div className="Price__Wrapper">
			{showModal && (
				<Dropover
					title={'app_currency'}
					onClose={() => setModalVisibility(false)}
					options={currentList}
					onSelect={(e) => {
						setCurrency(e.name);
						return setModalVisibility(false);
					}}
				/>
			)}
			<div>
				<NumberInput
					className={classNames('Price__Input', {disabled: disabledPrice})}
					label="app_price"
					defaultValue={price}
					disabled={disabledPrice}
					thousandSeparator={true}
					onValueChange={(value) => setPrice(value.floatValue)}
					decimalScale={2}
					isAllowed={(values) => {
						const {formattedValue, floatValue} = values;

						return formattedValue === '' || floatValue <= appConstants.MAX_PRICE_RANGE;
					}}
				/>
			</div>
			<div className="Currency__Input">
				<TextInput
					label="app_currency"
					type="text"
					disabled={disabledCurrency}
					onFocus={updateModalVisibility}
					value={currencyValue}
					infoKey={'currency'}
				/>
			</div>
		</div>
	);
};

Price.propTypes = {
	currencies: PropTypes.arrayOf(PropTypes.shape({})),
	initialPrice: PropTypes.string,
	initialCurrency: PropTypes.string,
	onHandleSelect: PropTypes.func,
};

Price.defaultProps = {
	initialPrice: '',
	initialCurrency: 'app_currency_eur',
};

export default injectIntl(Price);
