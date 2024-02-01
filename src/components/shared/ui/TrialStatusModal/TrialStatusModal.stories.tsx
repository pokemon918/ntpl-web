import React from 'react';
import {action} from '@storybook/addon-actions';

import TrialStatusModal from './index';

export default {
	title: 'UI Kit / General / Trial Status Modal',
	component: TrialStatusModal,
};

export const normal = () => (
	<TrialStatusModal daysLeft={16} onContinue={action('onContinue')} onClose={action('onClose')} />
);
