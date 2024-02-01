import React from 'react';
import {
	FaUtensils,
	FaTrophy,
	FaWineGlass,
	FaCocktail,
	FaMedal,
	FaTimes,
	FaThumbsUp,
} from 'react-icons/fa';

export function normalizeStatement(str) {
	str = str.replace(/ of the year/i, '');
	switch (str.toLowerCase()) {
		case 'extra trophies':
			return <FaTrophy />;
		case 'food match':
			return <FaUtensils />;
		case 'by the glass':
			return <FaWineGlass />;
		case 'pub & bar':
			return <FaCocktail />;
		case 'medal':
			return <FaMedal />;
		case 'medal/in':
			return <FaMedal />;
		case 'commend':
		case 'commended':
			if (1) return <span className="text-error">C</span>;
			return <FaThumbsUp />;
		case 'out':
			if (1) return <span className="text-error">X</span>;
			return <FaTimes />;
		case 'no show':
			if (1) return <span className="text-error">N</span>;
			return <FaTimes />;

		case 'faulty':
			return <span className="text-error">F</span>;
		default:
	}

	if (!str) {
		return '-';
	}

	return str
		.trim()
		.replace(/_+/g, ' ')
		.replace(/ +/g, ' ')
		.split(' ')
		.map((w) => w.substr(0, 1))
		.join('')
		.toUpperCase();
}
