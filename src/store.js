import {applyMiddleware, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {createOffline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import {composeWithDevTools} from 'redux-devtools-extension';

import {storeErrorLogs} from './middleware';
import {rootReducer, persistConfig} from './reducers';

const {
	middleware: offlineMiddleware,
	enhanceReducer: offlineEnhanceReducer,
	enhanceStore: offlineEnhanceStore,
} = createOffline({
	...offlineConfig,
	persist: false,
});

const persistedReducer = persistReducer(persistConfig, offlineEnhanceReducer(rootReducer));

const middleware = applyMiddleware(promise(), thunk, logger, offlineMiddleware, storeErrorLogs);

export const store = createStore(
	persistedReducer,
	composeWithDevTools(offlineEnhanceStore, middleware)
);

export const persistor = persistStore(store);
