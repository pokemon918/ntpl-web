import React from 'react';
import {action} from '@storybook/addon-actions';

import LoremIpsum from 'stories/components/LoremIpsum';
import {RouterDecorator} from 'stories/decorators';
import Button from '../Button';
import Modal from '.';

export default {
	title: 'UI Kit / General / Modal',
	component: Modal,
	decorators: [RouterDecorator],
};

export const normal = () => (
	<Modal
		onClose={action('onClose')}
		title="event_selected_wine"
		body={
			<div style={{textAlign: 'center'}}>
				<Modal.Breadcrumb path="nav_myTasting / tasting_summary" />
				<p>You can display anything inside the modal here! :)</p>
				<p>Lots of dummy text below to demonstrate paddings and how the scrolling behaves.</p>
				<LoremIpsum count={10} />
			</div>
		}
	/>
);

export const footer = () => (
	<Modal
		onClose={action('onClose')}
		title="Title Goes Here"
		body={
			<div style={{textAlign: 'center'}}>
				<Modal.Breadcrumb path="nav_myTasting / tasting_summary" />
				<p>You can display anything inside the modal here! :)</p>
				<p>Lots of dummy text below to demonstrate paddings and how the scrolling behaves.</p>
				<LoremIpsum count={10} />
			</div>
		}
		footer={
			<div className="mx-10" style={{textAlign: 'center'}}>
				You can display anything in the footer too! :)
			</div>
		}
	/>
);

export const footerButtons = () => (
	<Modal
		onClose={action('onClose')}
		title="Title Goes Here"
		body={
			<div style={{textAlign: 'center'}}>
				<Modal.Breadcrumb path="nav_myTasting / tasting_summary" />
				<p>You can display anything inside the modal here! :)</p>
				<p>Lots of dummy text below to demonstrate paddings and how the scrolling behaves.</p>
				<LoremIpsum count={10} />
			</div>
		}
		footer={
			<div className="mx-10">
				<div className="prev-btn" style={{float: 'left'}}>
					<Button variant="outlined" onHandleClick={action('onHandleClick:Back')}>
						Back
					</Button>
				</div>
				<div className="next-btn" style={{float: 'right'}}>
					<Button onHandleClick={action('onHandleClick:Next')}>Next</Button>
				</div>
			</div>
		}
	/>
);
