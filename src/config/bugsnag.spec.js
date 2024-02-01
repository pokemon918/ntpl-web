import {getReleaseStage} from './bugsnag';

describe('getReleaseStage', () => {
	const {location} = window;

	beforeAll(() => {
		delete window.location;
		window.location = {};
	});

	beforeEach(() => {
		window.location.host = '';
	});

	afterAll(() => {
		window.location = location;
	});

	it('should return OTHER by default', () => {
		expect(getReleaseStage()).toBe('OTHER');
	});

	test.each([
		['PROD', 'noteable.co'],
		['TEST', 'test.ntbl.link'],
		['CI', 'pipeline_2117.ci-test.ntbl.link'],
		['DEV', 'bug-2075.ntbl.link'],
		['LOCAL', 'localhost:3000'],
		['OTHER', 'foo.bar'],
	])('should return %s for %s', (stage, host) => {
		expect(getReleaseStage(host)).toBe(stage);
	});
});
