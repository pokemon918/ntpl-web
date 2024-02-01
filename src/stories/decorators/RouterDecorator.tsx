import React from 'react';
import {MemoryRouter} from 'react-router';
import {StoryFn} from '@storybook/addons';

const RouterDecorator = (storyFn: StoryFn) => (
	<MemoryRouter>
		<>{storyFn()}</>
	</MemoryRouter>
);

export default RouterDecorator;
