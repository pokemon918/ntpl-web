import React from 'react';
import CreditCardForm from '.';
import {action} from '@storybook/addon-actions';

export default {
	title: 'UI Kit / Inputs / Credit Card Form',
	component: CreditCardForm,
};

export const normal = () => <CreditCardForm onChange={action('onChange')} />;
