import {getLinkWithArguments, trimValidUserName} from './commons';

describe('getLinkWithArguments', () => {
	it('does not crash', () => {
		expect(getLinkWithArguments()).toBe('/');
	});

	it('should leave routes without arguments unchanged', () => {
		const route = '/home';
		const args = {foo: 'bar'};
		expect(getLinkWithArguments(route, args)).toBe('/home');
	});

	it('should leave missing arguments unchanged', () => {
		const route = '/tasting/:wineRef';
		const args = {asdf: 'missing'};
		expect(getLinkWithArguments(route, args)).toBe('/tasting/:wineRef');
	});

	it('should replace a parameter at the end of a route', () => {
		const route = '/tasting/:wineRef';
		const args = {wineRef: 'zx18mm65'};
		expect(getLinkWithArguments(route, args)).toBe('/tasting/zx18mm65');
	});

	it('should replace a parameter at the middle of a route', () => {
		const route = '/tasting/:wineRef/share';
		const args = {wineRef: 'qwe12rty34'};
		expect(getLinkWithArguments(route, args)).toBe('/tasting/qwe12rty34/share');
	});

	it('should replace multiple arguments in a route', () => {
		const route = '/tasting/:wineRef/:foozzz';
		const args = {wineRef: 'as55df99', foozzz: 'bazinga'};
		expect(getLinkWithArguments(route, args)).toBe('/tasting/as55df99/bazinga');
	});

	it('should replace only supplied arguments', () => {
		const route = '/tasting/:wineRef/:foo/:bar';
		const args = {wineRef: 'az19za91', foo: null, bar: 'shipit'};
		expect(getLinkWithArguments(route, args)).toBe('/tasting/az19za91/:foo/shipit');
	});
});

describe('trimValidUserName', () => {
	it('should trim invalid characters from usernames', () => {
		const username = 'some <Foo/> & Bar !@#$%ˆ&*() no';
		const trimmed = trimValidUserName(username);
		expect(trimmed).toBe('some Foo Bar no');
	});
});
