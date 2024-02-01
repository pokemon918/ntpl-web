if (!Intl.PluralRules) {
	require('@formatjs/intl-pluralrules/polyfill');
	require('@formatjs/intl-pluralrules/dist/locale-data/en');
	require('@formatjs/intl-pluralrules/dist/locale-data/zh');
}

if (!Intl.RelativeTimeFormat) {
	require('@formatjs/intl-relativetimeformat/polyfill');
	require('@formatjs/intl-relativetimeformat/dist/locale-data/en');
	require('@formatjs/intl-relativetimeformat/dist/locale-data/zh');
}

export default {};
