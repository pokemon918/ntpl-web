import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import L18nText from 'components/shared/L18nText';
import RadioSelection from 'components/shared/ui/RadioSelection';

import {ReactComponent as ChevronIconUp} from './Icon_ChevronUp.svg';
import {ReactComponent as ChevronIconDown} from './Icon_ChevronDown.svg';
import './RadioDropdown.scss';
import {useClickOutside} from 'hooks';

const RadioDropdown = ({selected, items, onChange, alignRight}) => {
	const [isExpanded, setExpanded] = useState(false);

	const handleChange = (value) => {
		setExpanded(false);
		onChange(value);
	};

	const wrapperNode = useRef();
	useClickOutside(wrapperNode, () => setExpanded(false));

	const selectedLabel = selected ? selected.label : 'shared_empty';

	return (
		<div ref={wrapperNode} className={classNames('RadioDropdown__Wrapper', {alignRight})}>
			<div className="RadioDropdown__SelectedOption" onClick={() => setExpanded(!isExpanded)}>
				<L18nText id={selectedLabel} defaultMessage={selectedLabel} />
				{isExpanded ? <ChevronIconUp /> : <ChevronIconDown />}
			</div>
			{isExpanded && (
				<div className="RadioDropdown__Container">
					<RadioSelection selected={selected} items={items} onChange={handleChange} />
				</div>
			)}
		</div>
	);
};

RadioDropdown.propTypes = {
	selected: PropTypes.shape({
		id: PropTypes.string,
		label: PropTypes.string,
		description: PropTypes.node,
	}),
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			label: PropTypes.string,
			description: PropTypes.node,
		})
	).isRequired,
	onChange: PropTypes.func.isRequired,
	alignRight: PropTypes.bool,
};

export default RadioDropdown;
