import {store} from 'store';
import {appConstants, routeConstants} from 'const';

export const port = 8000; //note: this is currently unused || todo: add port as part of app advance options;
export let basePath = store.getState().app.advancedOptions.serverUrl;

store.subscribe((listener) => {
	// udpate basePath everytime there's a change
	basePath = store.getState().app.advancedOptions.serverUrl;
});

export const onRedirectToEvent = () => {
	if (window.location.hostname === appConstants.PRODUCTION_URL) {
		return `${routeConstants.EVENTS}?q=swa2020`;
	}

	return routeConstants.EVENTS;
};
