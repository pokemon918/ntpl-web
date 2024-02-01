import React from 'react';
import {action} from '@storybook/addon-actions';

import {DateTimeInput} from 'components/shared/ui';

export default {
	title: 'UI Kit / Inputs / Date Time Input',
	component: DateTimeInput,
};

export const normal = () => <DateTimeInput onChange={action('Changed')} />;
