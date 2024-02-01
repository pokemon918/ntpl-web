import describeEventDate from './describeEventDate';

describe('describeEventDate', () => {
	it('Split year event', () => {
		const event = {
			feature_start: '2019-12-31',
			feature_end: '2020-01-05',
		};
		const description = describeEventDate(event);
		expect(description).toBe('31 December 2019 - 5 January 2020');
	});

	it('Split month event', () => {
		const event = {
			feature_start: '2019-11-20',
			feature_end: '2019-12-10',
		};
		const description = describeEventDate(event);
		expect(description).toBe('20 November - 10 December 2019');
	});

	it('Split day event', () => {
		const event = {
			feature_start: '2019-07-01',
			feature_end: '2019-07-02',
		};
		const description = describeEventDate(event);
		expect(description).toBe('1-2 July 2019');
	});

	it('One day event', () => {
		const event = {
			feature_start: '2019-06-30',
			feature_end: '2019-06-30',
		};
		const description = describeEventDate(event);
		expect(description).toBe('30 June 2019');
	});
});
