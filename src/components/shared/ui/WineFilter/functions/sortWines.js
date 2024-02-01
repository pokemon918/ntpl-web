import parse from 'date-fns/parse';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

const transformations = {
	date: (value) => parse(value),
};

function sortWines(wines, sortParameter) {
	const {field, order, transform} = sortParameter;
	const extractField = (item) => {
		const rawValue = get(item, field);
		const transformFn = transformations[transform];
		if (transformFn) {
			const transformedValue = transformFn(rawValue);
			return transformedValue;
		}
		return rawValue;
	};
	return orderBy(wines, [extractField], [order]);
}

export default sortWines;
