import en from './en';

const SYMBOL_PLACEHOLDER = '⬒ ⬓ ⬔ ⬕';

const symbols = Object.keys(en).reduce(
	(symbols, key) => ({
		...symbols,
		[key]: SYMBOL_PLACEHOLDER,
	}),
	null
);

export default symbols;
