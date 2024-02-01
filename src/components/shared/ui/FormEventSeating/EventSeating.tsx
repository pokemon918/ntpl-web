import React, {FC, useState} from 'react';
import classNames from 'classnames';

import NumberInput from '../NumberInput';
import Radio from '../Radio';

type SeatingType = 'unlimited' | 'limited';

export interface EventSeatingValue {
	type?: SeatingType;
	seats?: number;
}

interface Props {
	name: string;
	onChange?: (seatingInfo: EventSeatingValue) => void;
}

const EventSeating: FC<Props> = ({name, onChange}) => {
	const [value, setValue] = useState<EventSeatingValue>({});
	const isUnlimited = value.type === 'unlimited';
	const isLimited = value.type === 'limited';

	const changeValue = (changes: Partial<EventSeatingValue>) => {
		const newValue = {...value, ...changes};
		setValue(newValue);
		onChange?.(newValue);
	};

	const handleTypeChange = (type: SeatingType) => {
		changeValue({type});
	};

	const handleSeatsChange = (seats: number) => {
		changeValue({seats});
	};

	return (
		<div>
			<Radio
				name={name}
				id="unlimited"
				label="event_field_seating_unlimited"
				isChecked={isUnlimited}
				onChange={() => handleTypeChange('unlimited')}
				small
			/>
			<div className="EventPrice__CombinedInputs">
				<Radio
					name={name}
					id="priced"
					label="event_field_seating_limited"
					isChecked={isLimited}
					onChange={() => handleTypeChange('limited')}
					small
				/>
				<span
					className={classNames('EventPrice__PriceContainer', {
						EventPrice__PriceDisabled: !isLimited,
					})}
				>
					<NumberInput
						label="event_field_seating_enter_no_of_seats"
						className="EventPrice__SeatsInput"
						defaultValue={value.seats}
						disabled={!isLimited}
						onValueChange={(value) => handleSeatsChange(value.floatValue || 0)}
					/>
				</span>
			</div>
		</div>
	);
};

export default EventSeating;
