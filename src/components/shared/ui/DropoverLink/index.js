import React from 'react';

import Dropover from '../Dropover';
import {FaChevronDown} from 'react-icons/fa';

import './DropoverLink.scss';

const DropoverLink = ({label, value, displayValue, loadingState, options, onSelect}) => {
	const [showDropover, setShowDropover] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(value);

	const handleSelect = (newValue) => {
		onSelect(newValue);
		setShowDropover(false);
		setSelectedValue(newValue.name);
	};

	let firstPart = displayValue ? displayValue(selectedValue) : selectedValue || '';
	firstPart = firstPart.split(' ');
	let lastWord = firstPart.pop();
	firstPart = firstPart.join(' ');

	return (
		<>
			<span className="link" onClick={() => setShowDropover(true)}>
				{firstPart}{' '}
				<span className="no-wrap">
					{lastWord}&nbsp;
					<FaChevronDown />
				</span>
			</span>
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
		</>
	);
};

export default DropoverLink;
