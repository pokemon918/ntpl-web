import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

import bugsnagClient from 'config/bugsnag';
import {isProductionSite} from 'commons/commons';

const isTranslatorMode = localStorage.getItem('translator_mode') === 'on';
const showL18nKey = isTranslatorMode || !isProductionSite();

interface Props {
	id: string;
	defaultMessage?: string;
	values?: Record<string, string | number>;
	children?: any;
}

export const useL18nText = (id?: string) => {
	const {formatMessage} = useIntl();

	if (!id) {
		return '';
	}

	return formatMessage({id, defaultMessage: ''});
};

const L18nText = ({id, ...otherProps}: Props) => {
	const notifyOptions: any = {id, ...otherProps};
	if (!id) {
		bugsnagClient.notify(new Error('Missing i18n data!'), notifyOptions);
		return <>❗❗</>;
	}

	// this was not desired, but it happens and refactoring the sources will take a lot of time
	// we will come back at it later
	if (typeof id !== 'string' && React.isValidElement(id)) {
		return id;
	}

	if (typeof id !== 'string') {
		bugsnagClient.notify(new Error('Invalid i18n data, id must be a string!'), notifyOptions);
		return <>❗${id}❗</>;
	}

	const missingTranslation = `❗${id}❗`;
	const translated = (
		<FormattedMessage id={id} defaultMessage={missingTranslation} {...otherProps} />
	);

	if (showL18nKey) {
		return <span title={id}>{translated}</span>;
	}

	return translated;
};

L18nText.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default L18nText;
