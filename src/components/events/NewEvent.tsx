import React, {FC} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {useForm, FormContext} from 'react-hook-form';
import {DevTool} from 'react-hook-form-devtools';

import {
	Button,
	FooterBar,
	FormSection,
	FormInput,
	FormTextArea,
	FormDateTimeRangeInput,
	FormEventPrice,
	FormEventSeating,
	FormEventVisibility,
	FormCheckboxGroup,
	FormEventWineList,
	FormRadioGroup,
	SubPageHeader,
} from 'components/shared/ui';
import {routeConstants} from 'const';
import {getLinkWithArguments} from 'commons/commons';
import {addEvent} from 'actions/eventActions';
import {RootState} from 'reducers';
import {selectedTeamNameSelector} from 'reducers/selectedTeamReducer';

interface NewEventFormData {
	name: string;
	description: string;
	datetime: [string, string];
	location: string;
	organiser: string;
	host: string;
	price: {
		key: 'free' | 'priced';
		price: number;
		currency: string;
	};
	seats: number;
	visibility: string;
	tasting_tools: string[];
	tasting_type: string;
	wine_list: string[];
}

interface CreateEventModel {
	name: string;
	description: string;
	visibility: string;
	start_date: string;
	end_date: string;
	host: string;
	sub_type?: 'blind';
	wine_refs?: string[];
	metadata?: {
		blindtasting?: boolean;
		location?: string;
		organiser?: string;
		price?: {
			key: 'free' | 'priced';
			price: number;
			currency: string;
		};
		seats: number;
		tasting_tools: string[];
	};
}

const tastingConfigurationOptions = [
	['quick_tasting', 'event_field_tasting_quick'],
	['profound_tasting', 'event_field_tasting_profound'],
	['wset_level_2', 'event_field_tasting_wset2'],
	['wset_level_3', 'event_field_tasting_wset3'],
	['wset_level_4', 'event_field_tasting_wset4'],
];

const tastingTypeOptions = [
	['regular', 'event_field_tasting_regular'],
	['blind', 'event_field_tasting_blind'],
];

const blindTastingVisibilityOptions = [
	['wine_name', 'event_field_blind_alias_for_wine_name'],
	['vintage', 'event_field_blind_vintage'],
	['producer', 'event_field_blind_producer'],
	['country', 'event_field_blind_country'],
	['region', 'event_field_blind_region'],
	['appellation', 'event_field_blind_appellation'],
];

interface Props {
	teamName: string;
	addEvent: (eventData: CreateEventModel) => void;
	match: {
		params: {
			teamRef: string;
		};
	};
	history: {
		push: (path: string) => void;
	};
}

const NewEvent: FC<Props> = ({teamName, addEvent, match, history}) => {
	const formInstance = useForm<NewEventFormData>();
	const {control, handleSubmit} = formInstance;

	const onSubmit = async (values: NewEventFormData) => {
		const [startDate, endDate] = values.datetime || [];
		const isBlindTasting = values.tasting_type === 'blind';
		const subType = isBlindTasting ? 'blind' : undefined;

		await addEvent({
			name: values.name,
			description: values.description,
			visibility: values.visibility,
			start_date: startDate,
			end_date: endDate,
			host: values.host,
			sub_type: subType,
			wine_refs: [],
			metadata: {
				blindtasting: isBlindTasting,
				location: values.location,
				organiser: values.organiser,
				price: values.price,
				seats: values.seats,
				tasting_tools: values.tasting_tools,
			},
		});

		const {teamRef} = match.params;
		history.push(getLinkWithArguments(routeConstants.TEAM_HANDLE, {teamRef}));
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<SubPageHeader title="team_new_event_for_team" values={{teamName: teamName}} />
			<FormContext {...formInstance}>
				<FormSection title="event_info">
					<FormInput name="name" label="event_field_name" placeholder="event_field_name_enter" />
					<FormTextArea
						name="description"
						label="event_field_description"
						placeholder="event_field_description_enter"
					/>
					<FormDateTimeRangeInput name="datetime" label="event_field_date_and_time" />
					<FormInput
						name="location"
						label="event_field_location"
						placeholder="event_field_location"
					/>
					<FormInput
						name="organiser"
						label="event_field_organised_by"
						placeholder="event_field_organised_by"
					/>
					<FormInput name="host" label="event_field_host" defaultValue={teamName} readonly />
					<FormEventPrice name="price" />
					<FormEventSeating name="seats" />
					<FormEventVisibility name="visibility" />
				</FormSection>
				<FormSection title="event_tasting_configuration">
					<FormCheckboxGroup
						name="tasting_tools"
						label="event_field_tasting_tools"
						options={tastingConfigurationOptions}
						enableAllOption
					/>
					<FormRadioGroup
						name="tasting_type"
						label="event_field_tasting_type"
						options={tastingTypeOptions}
						disabled
					/>
					<FormCheckboxGroup
						name="blind_tasting_visibility"
						label="event_field_blind_tasting_visibility"
						defaultValue={['wine_name']}
						options={blindTastingVisibilityOptions}
						disabled
					/>
					<FormEventWineList name="wine_list" />
				</FormSection>
				<DevTool control={control} />
			</FormContext>
			<FooterBar>
				<Button type="submit">Publish Event</Button>
			</FooterBar>
		</form>
	);
};

const mapStateToProps = (state: RootState) => ({
	teamName: selectedTeamNameSelector(state),
});

const mapDispatchToProps = {
	addEvent,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewEvent));
