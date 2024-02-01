import sortWines from './sortWines';

describe('sortWines', () => {
	it('Should sort by: Most recent', () => {
		const sampleWines = [
			{
				ref: 'aaa111',
				created_at: '2019-09-18T07:08:46.000000Z',
			},
			{
				ref: 'bbb222',
				created_at: '2019-09-18T07:09:13.000000Z',
			},
			{
				ref: 'ccc333',
				created_at: '2019-09-18T07:09:33.000000Z',
			},
		];
		const sortParameter = {
			id: 'date',
			label: 'Most recent',
			field: 'created_at',
			order: 'desc',
			transform: 'date',
		};
		const sortedWines = sortWines(sampleWines, sortParameter);
		expect(sortedWines).toEqual([
			{
				ref: 'ccc333',
				created_at: '2019-09-18T07:09:33.000000Z',
			},
			{
				ref: 'bbb222',
				created_at: '2019-09-18T07:09:13.000000Z',
			},
			{
				ref: 'aaa111',
				created_at: '2019-09-18T07:08:46.000000Z',
			},
		]);
	});

	it('Should sort by: Wine name: A-Z', () => {
		const sampleWines = [
			{
				ref: 'aaa111',
				name: 'Red',
			},
			{
				ref: 'bbb222',
				name: 'White',
			},
			{
				ref: 'ccc333',
				name: 'Rosé',
			},
		];
		const sortParameter = {id: 'name', label: 'Wine name: A-Z', field: 'name', order: 'asc'};
		const sortedWines = sortWines(sampleWines, sortParameter);
		expect(sortedWines).toEqual([
			{
				ref: 'aaa111',
				name: 'Red',
			},
			{
				ref: 'ccc333',
				name: 'Rosé',
			},
			{
				ref: 'bbb222',
				name: 'White',
			},
		]);
	});

	it('Should sort by: Price: Low to high', () => {
		const sampleWines = [
			{
				ref: 'aaa111',
				price: 155,
			},
			{
				ref: 'bbb222',
				price: 122,
			},
			{
				ref: 'ccc333',
				price: 188,
			},
		];
		const sortParameter = {
			id: 'price_low',
			label: 'Price: Low to high',
			field: 'price',
			order: 'asc',
		};
		const sortedWines = sortWines(sampleWines, sortParameter);
		expect(sortedWines).toEqual([
			{
				ref: 'bbb222',
				price: 122,
			},
			{
				ref: 'aaa111',
				price: 155,
			},
			{
				ref: 'ccc333',
				price: 188,
			},
		]);
	});

	it('Should sort by: Price: High to low', () => {
		const sampleWines = [
			{
				ref: 'aaa111',
				price: 155,
			},
			{
				ref: 'bbb222',
				price: 122,
			},
			{
				ref: 'ccc333',
				price: 188,
			},
		];
		const sortParameter = {
			id: 'price_high',
			label: 'Price: High to low',
			field: 'price',
			order: 'desc',
		};
		const sortedWines = sortWines(sampleWines, sortParameter);
		expect(sortedWines).toEqual([
			{
				ref: 'ccc333',
				price: 188,
			},
			{
				ref: 'aaa111',
				price: 155,
			},
			{
				ref: 'bbb222',
				price: 122,
			},
		]);
	});

	it('Should sort by: Rating: Low to high', () => {
		const sampleWines = [
			{
				ref: 'aaa111',
				rating: {
					final_points: 98,
				},
			},
			{
				ref: 'bbb222',
				rating: {
					final_points: 100,
				},
			},
			{
				ref: 'ccc333',
				rating: {
					final_points: 79,
				},
			},
		];
		const sortParameter = {
			id: 'rating_low',
			label: 'Rating: Low to high',
			field: 'rating.final_points',
			order: 'asc',
		};
		const sortedWines = sortWines(sampleWines, sortParameter);
		expect(sortedWines).toEqual([
			{
				ref: 'ccc333',
				rating: {
					final_points: 79,
				},
			},
			{
				ref: 'aaa111',
				rating: {
					final_points: 98,
				},
			},
			{
				ref: 'bbb222',
				rating: {
					final_points: 100,
				},
			},
		]);
	});

	it('Should sort by: Rating: High to low', () => {
		const sampleWines = [
			{
				ref: 'aaa111',
				rating: {
					final_points: 98,
				},
			},
			{
				ref: 'bbb222',
				rating: {
					final_points: 100,
				},
			},
			{
				ref: 'ccc333',
				rating: {
					final_points: 99,
				},
			},
		];
		const sortParameter = {
			id: 'rating_high',
			label: 'Rating: High to low',
			field: 'rating.final_points',
			order: 'desc',
		};
		const sortedWines = sortWines(sampleWines, sortParameter);
		expect(sortedWines).toEqual([
			{
				ref: 'bbb222',
				rating: {
					final_points: 100,
				},
			},
			{
				ref: 'ccc333',
				rating: {
					final_points: 99,
				},
			},
			{
				ref: 'aaa111',
				rating: {
					final_points: 98,
				},
			},
		]);
	});
});
