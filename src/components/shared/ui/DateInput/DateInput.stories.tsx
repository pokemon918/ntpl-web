import React from 'react';
import {action} from '@storybook/addon-actions';

import {DateInput} from 'components/shared/ui';

export default {
	title: 'UI Kit / Inputs / Date Input',
	component: DateInput,
};

export const normal = () => <DateInput onChange={action('Changed')} />;
