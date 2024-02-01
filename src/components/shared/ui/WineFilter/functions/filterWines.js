function filterWines(wines, search = '') {
	const matches = (str) => {
		if (search) {
			return typeof str === 'string' && str.toLowerCase().indexOf(search.toLowerCase()) !== -1;
		}

		return wines;
	};

	return wines.filter(
		(wine) =>
			matches(wine.name) ||
			matches(wine.producer) ||
			matches(wine.region) ||
			matches(wine.country) ||
			matches(wine.vintage)
	);
}

export default filterWines;
