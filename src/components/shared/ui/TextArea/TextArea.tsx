import React, {FC, ChangeEvent, Ref, forwardRef} from 'react';

import {useL18nText} from 'components/shared/L18nText';
import './TextArea.scss';

interface Props {
	name?: string;
	value?: string | number;
	infoKey?: string;
	placeholder?: string;
	ref?: Ref<HTMLTextAreaElement>;
	onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: FC<Props> = forwardRef((props, ref) => {
	const {name, onChange, value, infoKey, placeholder} = props;
	const label = useL18nText(placeholder);

	return (
		<div className="TextArea__Wrapper">
			<textarea
				ref={ref}
				name={name}
				rows={8}
				placeholder={label || 'Enter your tasting notes'}
				onChange={onChange}
				value={value}
				data-test={infoKey}
			/>
		</div>
	);
});

export default TextArea;
