import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Formik, Field, FieldArray, Form} from 'formik';
import * as Yup from 'yup';

import {updateUserInfo} from 'actions/userActions';
import countries from 'assets/json/l18n/static/country/en.json';

import DropdownField from 'components/shared/DropdownField';
import RadioField from 'components/shared/RadioField';
import RadioFieldGroup from 'components/shared/RadioFieldGroup';
import TextInputField from 'components/shared/TextInputField';
import Button from 'components/shared/ui/Button';
import L18nText from 'components/shared/L18nText';
import DialogBox from 'components/shared/ui/DialogBox';

import {ReactComponent as IconBin} from '../icon_bin.svg';
import './WineEducation.scss';

const educationOptions = [
	{label: 'settings_wine_education_achievement_wset2'},
	{label: 'settings_wine_education_achievement_wset3'},
	{label: 'settings_wine_education_achievement_wset4'},
];

const countriesOptions = Object.keys(countries).map((code) => ({
	code,
	name: `country_${code}`,
}));

const addCountryI18nPrefix = (selectedItem) => (selectedItem ? `country_${selectedItem}` : null);

const currentYear = new Date().getFullYear();

const yupHandleEmptyValues = (value, originalValue) => (Number.isNaN(value) ? null : value);

const WineEducationSchema = Yup.object().shape({
	educations: Yup.array().of(
		Yup.object().shape({
			achievement: Yup.string().required(),
			school: Yup.string().min(2).max(50).required(),
			country_code: Yup.string().required(),
			status: Yup.string().required('settings_wine_education_completed_required'),
			// year is required only if education is completed
			year: Yup.mixed().when('status', {
				is: 'graduated',
				then: Yup.number()
					.min(1900)
					.max(currentYear)
					.transform(yupHandleEmptyValues)
					.nullable()
					.required('settings_wine_education_year_required'),
			}),
		})
	),
});

const Label = ({id, defaultMessage}) => (
	<label className="WineEducation__ItemLabel">
		<L18nText id={id} defaultMessage={defaultMessage} />
	</label>
);

const WineEducation = ({userData, history, ...props}) => {
	const [showDeleteDialog, setDeleteDialog] = useState(false);
	const [activeIndex, setActiveIndex] = useState(null);

	return (
		<div className="WineEducation__Container">
			<div className="title">
				<L18nText id="settings_wine_education_title" defaultMessage="Wine education" />
			</div>
			<Formik
				initialValues={{
					educations: userData.educations || [],
				}}
				validationSchema={WineEducationSchema}
				onSubmit={async (values, {setSubmitting}) => {
					await props.updateUserInfo(values, history);
					setSubmitting(false);
				}}
				render={({values, isSubmitting}) => (
					<Form>
						<FieldArray
							name="educations"
							render={(arrayHelpers) => (
								<>
									{values.educations.length === 0 && (
										<L18nText
											id="settings_wine_education_empty"
											defaultMessage="No education has been added."
										/>
									)}
									<div className="WineEducation__List">
										{values.educations.map((education, index) => (
											<React.Fragment key={`education_${index}`}>
												{index > 0 && <hr />}
												<div className="WineEducation__Item">
													<Label id="settings_wine_education" defaultMessage="Education" />
													<Field
														name={`educations.${index}.achievement`}
														component={DropdownField}
														items={educationOptions}
														label="settings_wine_education_select"
														valueKey="label"
														displayKey="label"
													/>
													<Label id="settings_wine_education_school" defaultMessage="School" />
													<Field name={`educations.${index}.school`} component={TextInputField} />
													<Label id="settings_wine_education_country" defaultMessage="Country" />
													<Field
														name={`educations.${index}.country_code`}
														component={DropdownField}
														items={countriesOptions}
														valueKey="code"
														displayKey="name"
														getDisplayValue={addCountryI18nPrefix}
													/>
													<Label id="settings_wine_education_status" default="Status" />
													<RadioFieldGroup>
														<Field
															name={`educations.${index}.status`}
															value="ongoing"
															label="settings_wine_education_status_ongoing"
															component={RadioField}
														/>
														<Field
															name={`educations.${index}.status`}
															value="graduated"
															label="settings_wine_education_status_graduated"
															component={RadioField}
														/>
													</RadioFieldGroup>
													{values.educations[index].status === 'graduated' && (
														<>
															<Label id="settings_wine_education_year" defaultMessage="Year" />
															<Field
																name={`educations.${index}.year`}
																component={TextInputField}
																type="number"
																small
															/>
														</>
													)}
													{showDeleteDialog && (
														<DialogBox
															title="wine_education_delete"
															description={'wine_education_delete_confirmation'}
															yesCallback={() => {
																arrayHelpers.remove(activeIndex);
																setDeleteDialog(false);
															}}
															noCallback={() => setDeleteDialog(false)}
														/>
													)}
													<div className="WineEducation__ItemActions">
														<Button
															variant="transparent"
															size="small"
															onHandleClick={() => {
																setDeleteDialog(true);
																setActiveIndex(index);
															}}
														>
															<IconBin />
														</Button>
													</div>
												</div>
											</React.Fragment>
										))}
									</div>
									<hr />
									<div className="WineEducation__Actions">
										<Button
											variant="transparent"
											size="small"
											disabled={values.educations.length >= 5}
											onHandleClick={() =>
												arrayHelpers.push({
													achievement: '',
													school: '',
													description: '',
													country_code: '',
													status: '',
													year: '',
												})
											}
										>
											<L18nText id="settings_add_education" message="Add education" />
										</Button>
										<Button type="submit" disabled={isSubmitting}>
											<L18nText id="app_save_changes" message="Save changes" />
										</Button>
									</div>
								</>
							)}
						/>
					</Form>
				)}
			/>
		</div>
	);
};

const mapStateToProps = (state) => ({
	userData: state.user.userData,
});

export default connect(mapStateToProps, {updateUserInfo})(WineEducation);
