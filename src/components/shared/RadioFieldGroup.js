import React from 'react';

import FieldErrorTooltip from './FieldErrorTooltip';

const RadioFieldGroup = ({children, form}) => {
	if (React.Children.count(children) === 0) {
		return <div>children: {React.Children.count(children)}</div>;
	}

	const [firstRadio] = React.Children.toArray(children);
	const {name} = firstRadio.props;

	return (
		<fieldset>
			<FieldErrorTooltip name={name}>{children}</FieldErrorTooltip>
		</fieldset>
	);
};

export default RadioFieldGroup;
