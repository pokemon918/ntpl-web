import React from 'react';

import Dropover from '../Dropover';
import TextInput from '../TextInput';
import DialogBox from 'components/shared/ui/DialogBox';

const DropoverInput = ({
	label,
	value,
	description,
	disabled,
	loadingState,
	options,
	warning,
	isSaving,
	infoKey,
	onSelect,
	hideTextLabel,
}) => {
	const [showWarning, setWarningBox] = React.useState(false);
	const [showDropover, setShowDropover] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(value);

	// synchronise value changes with internal state
	React.useEffect(() => {
		setSelectedValue(value);
	}, [value]);

	const handleSelect = (newValue) => {
		onSelect(newValue);
		setShowDropover(false);
		setSelectedValue(newValue.name);
	};

	const showModal = () => {
		if (warning) {
			return setWarningBox(true);
		}

		return setShowDropover(true);
	};

	const showDropoverModal = () => {
		setWarningBox(false);
		return setShowDropover(true);
	};

	if (showWarning) {
		return (
			<DialogBox
				title={'Hmmm...'}
				description={description}
				noCallback={() => setWarningBox(false)}
				yesCallback={() => showDropoverModal()}
			/>
		);
	}

	return (
		<div>
			<TextInput
				type="text"
				hideTextLabel={hideTextLabel}
				label={label}
				value={selectedValue}
				onFocus={showModal}
				disabled={isSaving || disabled}
				infoKey={infoKey}
				readOnly
			/>
			{showDropover && (
				<Dropover
					title={label}
					selected={selectedValue}
					loadingState={loadingState}
					options={options}
					onSelect={handleSelect}
					onClose={() => setShowDropover(false)}
				/>
			)}
		</div>
	);
};

export default DropoverInput;
