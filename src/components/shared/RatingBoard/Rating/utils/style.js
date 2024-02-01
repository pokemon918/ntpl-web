/* eslint-disable */
'use strict';

import merge from './merge';

var style = {
	display: 'inline-block',
	borderRadius: '50%',
	border: '5px double white',
	width: 30,
	height: 30,
};

export const empty = merge(style, {
	backgroundColor: '#ccc',
});

export const full = merge(style, {
	backgroundColor: 'black',
});

export const placeholder = merge(style, {
	backgroundColor: 'red',
});
