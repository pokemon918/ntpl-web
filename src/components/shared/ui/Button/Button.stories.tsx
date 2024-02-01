import React from 'react';
import {action} from '@storybook/addon-actions';

import Button from './index';

export default {
	title: 'UI Kit / General / Button',
	component: Button,
};

export const normal = () => <Button onHandleClick={action('clicked')}>Hello Button</Button>;

export const outlined = () => (
	<Button variant="outlined" onHandleClick={action('clicked')}>
		Hello Button
	</Button>
);

export const inverse = () => (
	<Button variant="inverse" onHandleClick={action('clicked')}>
		Hello Button
	</Button>
);

export const secondary = () => (
	<Button variant="secondary" onHandleClick={action('clicked')}>
		Hello Button
	</Button>
);

export const transparent = () => (
	<Button variant="transparent" onHandleClick={action('clicked')}>
		Hello Button
	</Button>
);

export const disabledNormal = () => (
	<Button onHandleClick={action('clicked')} disabled={true}>
		Hello Button
	</Button>
);

export const disabledOutlined = () => (
	<Button variant="outlined" onHandleClick={action('clicked')} disabled={true}>
		Hello Button
	</Button>
);
