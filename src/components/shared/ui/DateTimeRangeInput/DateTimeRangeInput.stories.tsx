import React from 'react';
import {action} from '@storybook/addon-actions';

import {DateTimeRangeInput} from 'components/shared/ui';

export default {
	title: 'UI Kit / Inputs / Date Time Range Input',
	component: DateTimeRangeInput,
};

export const normal = () => <DateTimeRangeInput onChange={action('Changed')} />;
