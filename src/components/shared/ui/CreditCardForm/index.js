import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';

import './CreditCardForm.scss';

class CreditCardForm extends React.Component {
	state = {
		cardNo: null,
		cardHolderName: null,
		expiryMonth: null,
		expiryYear: null,
		cvc: null,
	};

	componentDidUpdate() {
		const {cardNo, cardHolderName, expiryMonth, expiryYear, cvc} = this.state;
		this.props.onChange({cardNo, cardHolderName, expiryMonth, expiryYear, cvc});
	}

	applyMaskAndSetInput = (field, value, ref) => {
		let matches;
		let val = '';
		if (field === 'cardNo') {
			matches = value
				.replace(/\s+/g, '')
				.replace(/[^0-9]/gi, '')
				.match(/\d{4,16}/g);

			const match = (matches && matches[0]) || '';
			const parts = [];
			for (let i = 0, len = match.length; i < len; i += 4) {
				parts.push(match.substring(i, i + 4));
			}

			if (parts.length) {
				val = parts.join(' ');
				ref.value = val;
			} else {
				val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
				ref.value = val;
			}
		} else if (field === 'cvc') {
			matches = value
				.replace(/\s+/g, '')
				.replace(/[^0-9]/gi, '')
				.match(/\d{3,4}/g);

			if (matches && matches.length > 0) {
				val = matches[0];
				ref.value = val;
			} else {
				val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
				ref.value = val;
			}
		}

		this.setState({[`${field}`]: val});
	};

	validateAndSetInput(field, value, ref) {
		let val = '';
		val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
		if (field === 'expiryMonth') {
			if (val < 1 && val.length > 1) {
				ref.value = 1;
				val = 1;
			} else if (value > 12) {
				ref.value = 12;
				val = 12;
			} else if (val.length > 2) {
				val = '';
				ref.value = val;
			} else {
				ref.value = val;
			}
		} else if (field === 'expiryYear') {
			val = val.replace(/^0/gi, '');
			if (val < 1000 && val.length > 4) {
				ref.value = 1000;
				val = 1000;
			} else if (value > 9999) {
				ref.value = 9999;
				val = 9999;
			} else if (val.length > 4) {
				val = '';
				ref.value = val;
			} else {
				ref.value = val;
			}
		}

		this.setState({[`${field}`]: val});
	}

	render() {
		return (
			<div className="CreditCardForm__Container">
				<TextInput
					label="Card no."
					value={this.state.cardNo}
					onChange={(cardNo) => this.applyMaskAndSetInput('cardNo', cardNo, this.cardNumberInput)}
					innerRef={(input) => (this.cardNumberInput = input)}
				/>
				<br />
				<TextInput
					label="Name of Card Holder"
					onChange={(cardHolderName) => this.setState({cardHolderName})}
				/>
				<br />
				<div className="CreditCardForm__Label">Expiry Date</div>
				<div className="CreditCardForm__Inline">
					<div className="CreditCardForm__PaddingRight">
						<TextInput
							label="Month"
							onChange={(expiryMonth) =>
								this.validateAndSetInput('expiryMonth', expiryMonth, this.expiryMonthInput)
							}
							innerRef={(input) => (this.expiryMonthInput = input)}
						/>
					</div>
					<div className="CreditCardForm__PaddingLeft">
						<TextInput
							label="Year"
							onChange={(expiryYear) =>
								this.validateAndSetInput('expiryYear', expiryYear, this.expiryYearInput)
							}
							innerRef={(input) => (this.expiryYearInput = input)}
						/>
					</div>
				</div>
				<br />
				<TextInput
					label="CVC number"
					type="password"
					onChange={(cvc) => this.applyMaskAndSetInput('cvc', cvc, this.cvcInput)}
					innerRef={(input) => (this.cvcInput = input)}
				/>
			</div>
		);
	}
}

CreditCardForm.propTypes = {
	onChange: PropTypes.func,
};

CreditCardForm.defaultProps = {
	onChange: () => {},
};

export default CreditCardForm;
