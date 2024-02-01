import {addDecorator} from '@storybook/react';
import {setIntlConfig, withIntl} from 'storybook-addon-intl';
import 'commons/intl-polyfill';
import {Languages} from 'const/languages';

const getMessages = (locale) => Languages[locale];

setIntlConfig({
	locales: ['en', 'symbols'],
	defaultLocale: 'en',
	getMessages,
});

addDecorator(withIntl);
