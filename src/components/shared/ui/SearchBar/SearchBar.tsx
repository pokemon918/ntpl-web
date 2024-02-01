import * as React from 'react';
import {FC, ChangeEvent, Ref} from 'react';

import './SearchBar.scss';
import L18nText from 'components/shared/L18nText';

interface Props {
	ref?: Ref<HTMLInputElement>;
	infoKey?: string;
	placeholder?: string;
	value?: string;
	onHandleChange?: (search: string) => void;
	onChange?: (event: ChangeEvent) => void;
}

const SearchBar: FC<Props> = ({
	ref,
	infoKey,
	placeholder,
	value,
	onHandleChange,
	onChange,
	...otherProps
}) => (
	<div className="SearchBar__Wrapper">
		<L18nText id={placeholder || 'shared_search_placeholder'} defaultMessage="Search">
			{(placeholder: string) => (
				<input
					ref={ref}
					autoComplete="off"
					className="SearchBar__Default"
					onChange={(ev) => {
						onHandleChange?.(ev.target.value);
						onChange?.(ev);
					}}
					value={value}
					id="searchInput"
					placeholder={placeholder}
					data-test={infoKey}
					{...otherProps}
				/>
			)}
		</L18nText>
	</div>
);

SearchBar.defaultProps = {
	onHandleChange: () => {},
	onChange: () => {},
};

export default SearchBar;
