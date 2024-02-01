import React from 'react';
import {action} from '@storybook/addon-actions';

import {TimeInput} from 'components/shared/ui';

export default {
	title: 'UI Kit / Inputs / Time Input',
	component: TimeInput,
};

export const normal = () => <TimeInput onChange={action('Changed')} />;
