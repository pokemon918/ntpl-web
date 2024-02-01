export function canonicalText(str) {
	if (!str) {
		return '';
	}

	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.replace(/ +/g, '-');
}
