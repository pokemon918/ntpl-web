import React from 'react';
import TextInput from 'components/shared/ui/TextInput';

const WineInfo = ({wine, onUpdateFields, type}) => (
	<div className="WineInfo__Wrapper">
		<div className="WineInfo__Producer">
			<TextInput
				label={'Producer'}
				type="text"
				value={wine.producer}
				disabled={true}
				infoKey={'producer'}
			/>
		</div>
		<div className="WineInfo__Region">
			<TextInput
				label={'Region'}
				type="text"
				onChange={onUpdateFields}
				value={wine.region}
				disabled={type === 'edit' ? false : true}
				infoKey={'region'}
			/>
		</div>
		<div className="WineInfo__Country">
			<TextInput
				label={'Country'}
				type="text"
				onChange={onUpdateFields}
				value={wine.country}
				disabled={type === 'edit' ? false : true}
				infoKey={'country'}
			/>
		</div>
		<div className="WineInfo__Name">
			<TextInput
				label={'Name'}
				type="text"
				infoKey={'name'}
				onChange={onUpdateFields}
				value={wine.name}
			/>
		</div>
		<div className="WineInfo__Vintage">
			<TextInput
				label={'Vintage'}
				type="text"
				infoKey={'vintage'}
				onChange={onUpdateFields}
				value={wine.vintage}
			/>
		</div>
		<div className="WineInfo__Grape">
			<TextInput
				label={'Grape/grape blend'}
				type="text"
				infoKey={'grape'}
				value={wine.grape}
				onChange={onUpdateFields}
			/>
		</div>
	</div>
);

export default WineInfo;
