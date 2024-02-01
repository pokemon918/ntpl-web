import React from 'react';
import {MemoryRouter as Router} from 'react-router-dom';
import {cleanup, render, fireEvent} from '@testing-library/react';

import {UnconnectedMyEvents as MyEvents} from './MyEvents';

jest.mock('./partials/CreateEventModal', () =>
	jest.fn(({isOpen, saveCallback, toggle, eventWines = [], isSaving}) => (
		<div className="CreateEventModalMock">
			<p>CreateEventModal {isOpen ? 'Open' : 'Closed'}</p>
			<p>{isSaving ? 'Saving...' : ''}</p>
			<ul>
				{eventWines.map((wine) => (
					<li key={wine.value}>
						{wine.value} - {wine.label}
					</li>
				))}
			</ul>
			<button onClick={saveCallback}>Save event</button>
			<button onClick={toggle}>Close modal</button>
		</div>
	))
);

const renderMyEvents = (props) =>
	render(
		<Router>
			<MyEvents {...props} />
		</Router>
	);

describe('MyEvents', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = renderMyEvents();
		expect(container.firstChild).toBeTruthy();
	});

	it('Should have no events', () => {
		const {getByText, queryByText} = renderMyEvents({
			events: {data: [], myEvents: [], error: null},
		});
		expect(getByText('No events')).toBeTruthy();
	});

	it('Should display error message', () => {
		const {getByText, queryByText} = renderMyEvents({
			events: {data: [], errorMyEvents: 'foo'},
		});
		expect(getByText('Failed to load your events!')).toBeTruthy();
		expect(queryByText('No events')).toBeNull();
	});

	it('Should display events list', () => {
		const {getByText, queryByText} = renderMyEvents({
			events: {
				myEvents: [
					{ref: '123', name: 'First event'},
					{ref: '456', name: 'Second event'},
					{ref: '789', name: 'Third event'},
				],
				error: null,
			},
		});
		expect(getByText('First event')).toBeTruthy();
		expect(getByText('Second event')).toBeTruthy();
		expect(getByText('Third event')).toBeTruthy();
		expect(queryByText('No events')).toBeNull();
		expect(queryByText('Unable to fetch data from the server')).toBeNull();
	});

	it('Should not display create event modal', () => {
		const {getByText} = renderMyEvents();
		expect(getByText('CreateEventModal Closed')).toBeTruthy();
	});

	it('Should open create event modal', () => {
		const {container, getByText} = renderMyEvents();
		const createEventBtn = container.querySelector('.create-event-btn');
		fireEvent.click(createEventBtn);

		expect(getByText('CreateEventModal Closed')).toBeTruthy();
	});

	it('Should pass list of wines to the create event modal', () => {
		const {getByText} = renderMyEvents({
			wines: {
				data: [
					{ref: '111', name: 'First wine'},
					{ref: '222', name: 'Second wine'},
				],
			},
		});

		expect(getByText('111 - First wine')).toBeTruthy();
		expect(getByText('222 - Second wine')).toBeTruthy();
	});
});
