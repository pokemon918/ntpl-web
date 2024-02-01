export function addPrefix(prefix) {
	return {
		to: function (translations) {
			return Object.keys(translations).reduce((prefixed, key) => {
				return {
					...prefixed,
					[`${prefix}_${key}`]: translations[key],
				};
			}, {});
		},
	};
}
