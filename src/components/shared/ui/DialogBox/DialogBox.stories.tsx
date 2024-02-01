import React from 'react';
import {action} from '@storybook/addon-actions';

import DialogBox from './index';

export default {
	title: 'UI Kit / General / Dialog Box',
	component: DialogBox,
};

export const error = () => (
	<DialogBox
		onClose={action('onClose')}
		title={'error_title'}
		errorBox={true}
		noCallback={action('No clicked')}
		yesCallback={action('Yes clicked')}
		description={
			<div>
				Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Bestibulum id ligula
				porta felis euismod semper..
			</div>
		}
	/>
);

export const yesNo = () => (
	<DialogBox
		onClose={action('onClose')}
		title="Close tasting"
		noCallback={action('No clicked')}
		yesCallback={action('Yes clicked')}
		description={
			<div>
				Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Bestibulum id ligula
				porta felis euismod semper..
			</div>
		}
	/>
);

export const invertedButtons = () => (
	<DialogBox
		onClose={action('onClose')}
		title="Cancel subscription?"
		noCallback={action('No clicked')}
		yesCallback={action('Yes clicked')}
		description={
			<div>
				This will cancel your current subscription plan at the end of the current payment period.
				Are you sure you would like to continue?
			</div>
		}
		reverseButtons
		outlinedYesButton
	/>
);
