import {getCountryKey} from './multiStepFormActions';

describe('getCountryKey', () => {
	it('should return given country key', () => {
		const info = {tasting_country_key: 'br'};
		const countryKey = getCountryKey(info);
		expect(countryKey).toBe('br');
	});

	it('should return country key from a country name', () => {
		const info = {tasting_country: 'cyprus'};
		const countryKey = getCountryKey(info);
		expect(countryKey).toBe('cy');
	});

	it('should resolve mismatches by giving precedence to country key', () => {
		const info = {tasting_country: 'USA', tasting_country_key: 'gb'};
		const countryKey = getCountryKey(info);
		expect(countryKey).toBe('gb');
	});

	it('should return empty for invalid input', () => {
		const countryKey = getCountryKey();
		expect(countryKey).toBe('');
	});

	it('should return empty for invalid country key', () => {
		const info = {tasting_country_key: 'asdf'};
		const countryKey = getCountryKey(info);
		expect(countryKey).toBe('');
	});

	it('should return empty for invalid country name', () => {
		const info = {tasting_country: 'asdkljaslkdjaskld'};
		const countryKey = getCountryKey(info);
		expect(countryKey).toBe('');
	});
});
