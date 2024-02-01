import React from 'react';
import {connect as connectFormik} from 'formik';
import * as Yup from 'yup';
import {get} from 'lodash';

import Tooltip from './ui/Tooltip';
import L18nText from './L18nText';

Yup.setLocale({
	mixed: {
		required: 'shared_field_required',
	},
	string: {
		email: 'shared_field_email_invalid',
		min: ({min}) => ({key: 'shared_field_text_too_short', values: {min}}),
		max: ({max}) => ({key: 'shared_field_text_too_long', values: {max}}),
	},
	number: {
		min: ({min}) => ({key: 'shared_field_number_too_small', values: {min}}),
		max: ({max}) => ({key: 'shared_field_number_too_big', values: {max}}),
	},
});

const FieldErrorTooltip = ({name, children, formik}) => {
	const touched = !!get(formik.touched, name);
	const error = get(formik.errors, name);
	const hasError = touched && !!error;

	const errorString = typeof error === 'object' ? error.key : error;
	const errorValues = typeof error === 'object' ? error.values : undefined;

	const translatedError = errorString && (
		<L18nText id={errorString} defaultMessage={errorString} values={errorValues} />
	);

	return (
		<Tooltip show={hasError} text={translatedError}>
			{children}
		</Tooltip>
	);
};

export default connectFormik(FieldErrorTooltip);
