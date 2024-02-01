import React from 'react';
import {StoryFn} from '@storybook/addons';
import {FormContext, useForm} from 'react-hook-form';
import {DevTool} from 'react-hook-form-devtools';

const FormDecorator = (storyFn: StoryFn) => {
	const formInstance = useForm();
	const {control} = formInstance;

	return (
		<FormContext {...formInstance}>
			<>{storyFn()}</>
			<DevTool control={control} />
		</FormContext>
	);
};

export default FormDecorator;
