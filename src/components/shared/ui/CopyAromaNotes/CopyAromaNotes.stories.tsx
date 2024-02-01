import React from 'react';
import {action} from '@storybook/addon-actions';

import {normal as multiSelectorStory} from '../MultiSelector/MultiSelector.stories';
import CopyAromaNotes from './index';

export default {
	title: 'UI Kit / General / Copy Aroma Notes',
	component: CopyAromaNotes,
};

export const overlay = () => (
	<CopyAromaNotes onClickCopy={action('Copied')} onClickSkip={action('Closing')} />
);

export const screenSample = () => (
	<div style={{overflow: 'hidden', height: '100vh'}}>
		{multiSelectorStory()}
		<CopyAromaNotes onClickCopy={action('Copied')} onClickSkip={action('Closing')} />
	</div>
);
