import React from 'react';
import {cleanup, render, fireEvent, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import SiteMenu from './index';

const createProps = ({
	isOpen,
	isAuthenticated,
	offCanvas,
	closeSideNav,
	handleNavOffSet,
	setOffCanvas,
}) => ({
	isOpen,
	isAuthenticated,
	offCanvas,
	closeSideNav,
	handleNavOffSet,
	setOffCanvas,
});

describe('SiteMenu', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});
		const {container} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should have a class of nav-open if isOpen prop is true', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {container} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		expect(container.querySelector('.nav-open')).toBeTruthy();
	});

	it('Should render sub menu', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			setTastingId: () => {},
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const closeSideNav = jest.fn();
		const setTastingId = jest.fn();
		const {getByText, getAllByText} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		const navElement = getByText('Tastings');
		fireEvent.click(navElement.firstChild);

		const subNavElement = getAllByText('My Tastings');

		expect(subNavElement).toBeTruthy();
	});

	it('Should have a class of nav-close if isOpen prop is false', () => {
		const props = createProps({
			isOpen: false,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {container} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		expect(container.querySelector('.nav-close')).toBeTruthy();
	});

	it('Should make the overlay visible when isOpen prop is true', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {container} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		expect(container.querySelector('.nav-open')).toBeTruthy();
	});

	it('Should make the overlay not visible when isOpen prop is false', () => {
		const props = createProps({
			isOpen: false,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {container} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		expect(container.querySelector('.nav-open')).toBeFalsy();
	});

	it('Should render BottomLinks if isAuthenticated prop is true', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {getByTestId} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		const sitemenu = getByTestId('sitemenu');
		const bottomLinks = within(sitemenu).getByTestId('bottom-nav-links');
		expect(bottomLinks).toBeTruthy();
	});

	it('Should render SignedOutLinks if isAuthenticated prop is false', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: false,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {getByTestId} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		const sitemenu = getByTestId('sitemenu');
		const signedOutLinks = within(sitemenu).getByTestId('signed-out-nav-links');
		expect(signedOutLinks).toBeTruthy();
	});

	it('Should render SignedInLinks if isAuthenticated prop is true', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {getByTestId} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		const sitemenu = getByTestId('sitemenu');
		const signedInLinks = within(sitemenu).getByTestId('signed-in-nav-links');
		expect(signedInLinks).toBeTruthy();
	});

	it('Should render OtherLinks if isAuthenticated prop is true', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {getByTestId} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		const sitemenu = getByTestId('sitemenu');
		const otherLinks = within(sitemenu).getByTestId('other-nav-links');
		expect(otherLinks).toBeTruthy();
	});

	it('Should render BottomLinks if isAuthenticated prop is true', () => {
		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: () => {},
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {getByTestId} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		const sitemenu = getByTestId('sitemenu');
		const bottomLinks = within(sitemenu).getByTestId('bottom-nav-links');
		expect(bottomLinks).toBeTruthy();
	});

	it('Should trigger callback for clicking the x button', () => {
		const closeSideNavCallback = jest.fn();

		const props = createProps({
			isOpen: true,
			isAuthenticated: true,
			offCanvas: false,
			closeSideNav: closeSideNavCallback,
			handleNavOffSet: () => {},
			setOffCanvas: () => {},
		});

		const {getByTestId} = render(
			<MemoryRouter>
				<SiteMenu {...props} />
			</MemoryRouter>
		);

		const close = getByTestId('closeIcon');
		fireEvent.click(close);

		expect(closeSideNavCallback).toHaveBeenCalledTimes(1);
	});
});
