import {combineReducers} from 'redux';

import contestInfo, {ContestInfoState} from './contestInfoReducer';
import contestFinalAssessment, {ContestFinalAssessmentState} from './contestFinalAssessment';
import contestJoinRequest, {ContestJoinRequestState} from './contestJoinRequest';
import contestMedal, {ContestMedalState} from './contestMedalReducer';
import contestProgress, {ContestProgressState} from './contestProgressReducer';
import contestTeamLead, {ContestTeamLeadState} from './contestTeamLeadReducer';

export interface ContestsState {
	contestInfo: ContestInfoState;
	contestFinalAssessment: ContestFinalAssessmentState;
	contestJoinRequest: ContestJoinRequestState;
	contestMedal: ContestMedalState;
	contestProgress: ContestProgressState;
	contestTeamLead: ContestTeamLeadState;
}

export default combineReducers<ContestsState>({
	contestInfo,
	contestFinalAssessment,
	contestJoinRequest,
	contestMedal,
	contestProgress,
	contestTeamLead,
});
