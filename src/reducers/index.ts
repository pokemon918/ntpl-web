import {combineReducers} from 'redux';
import {userConstants} from 'const';
import {persistReducer, purgeStoredState} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import app from './appReducer';
import settings from './settingsReducer';
import user from './userReducer';
import wines from './winesReducer';
import tasting from './tastingReducer';
import selectedWine from './selectedWineReducer';
import wineEvent from './wineEventReducer';
import multiStepForm from './multiStepFormReducer';
import comments from './commentsReducer';
import info from './infoReducer';
import feedback from './feedbackReducer';
import teams from './teamsReducer';
import selectedTeam from './selectedTeamReducer';
import searchedTeams from './searchedTeamsReducer';
import events from './eventsReducer';
import selectedEvent from './selectedEventReducer';
import appErrorModal from './appErrorModalReducer';
import navBar from './navBarReducer';
import contest from './contestReducer';
import contests, {ContestsState} from './contestsReducer';
import requestStatus from './requestStatusReducer';

const appPersistConfig = {
	key: 'app',
	storage,
	blacklist: ['advancedOptions'],
};

export interface RootState {
	app: any;
	settings: any;
	user: any;
	wines: any;
	tasting: any;
	navBar: any;
	contest: any;
	contests: ContestsState;
	selectedWine: any;
	wineEvent: any;
	multiStepForm: any;
	comments: any;
	info: any;
	feedback: any;
	teams: any;
	selectedTeam: any;
	searchedTeams: any;
	events: any;
	selectedEvent: any;
	appErrorModal: any;
	requestStatus: any;
}

const appReducer = combineReducers<RootState>({
	app: persistReducer<any, any>(appPersistConfig, app),
	settings,
	user,
	wines,
	tasting,
	navBar,
	contest,
	contests,
	selectedWine,
	wineEvent,
	multiStepForm,
	comments,
	info,
	feedback,
	teams,
	selectedTeam,
	searchedTeams,
	events,
	selectedEvent,
	appErrorModal,
	requestStatus,
});

export const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['app', 'appErrorModal', 'requestStatus'],
};

export const rootReducer = (state: any, action: any) => {
	if (action.type === userConstants.INITIATE_LOGOUT) {
		purgeStoredState(persistConfig);
		state = undefined;
	}
	return appReducer(state, action);
};
