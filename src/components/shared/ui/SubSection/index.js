import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import L18nText from 'components/shared/L18nText';

import Grid from 'components/shared/ui/Grid';

import './SubSection.scss';

const subHeader = {
	scholar2: {
		notes_yeast_: 'scholar_yeast_subHeader',
	},
	scholar3: {
		notes_yeast_: 'scholar3_yeast_subHeader',
	},
	scholar4: {
		notes_yeast_: 'scholar_yeast_subHeader',
	},
};

const SubSectionItem = ({name, activeOption, selected, onSelectItem}) => (
	<div
		className={classNames('SubSection__Item', {active: selected})}
		data-test={`SubSection Item_${name}`}
		onClick={onSelectItem}
	>
		<div className="SubSection__Name">
			<L18nText id={name} defaultMessage={name} />
		</div>
		<div className="SubSection__Count">
			<L18nText id={activeOption || 'app_no_data'} defaultMessage={activeOption} />
		</div>
	</div>
);

const SubSectionMultipleItem = ({name, count, selected, onSelectItem, subHeader}) => (
	<div
		className={classNames('SubSection__Item', {active: selected})}
		data-test={`SubSectionItem_${name}`}
		onClick={onSelectItem}
	>
		<div className="SubSection__Name">
			<L18nText id={name} defaultMessage={name} />
		</div>
		{subHeader && (
			<div className="SubSection__SubHeader">
				<L18nText id={subHeader} defaultMessage={subHeader} />
			</div>
		)}
		<div className="SubSection__Count">
			{count.value || 0}/{count.total}
		</div>
	</div>
);

class SubSection extends React.Component {
	state = {
		selectedId: null,
	};

	render() {
		const {items, multiple, handleOptionSelect, type} = this.props;

		return (
			<Grid columns={12}>
				<div className="SubSection__Container">
					{items
						.filter((item) => items.length === 1 || !item.hideSelection)
						.map((item) => {
							const options = item.options ? item.options.length : 0;
							const hiddenOptions = item.hiddenOptions ? item.hiddenOptions.length : 0;
							const visibleOptions = options - hiddenOptions;
							const activeOptions = item.activeOption ? item.activeOption.length : 0;

							return multiple ? (
								<SubSectionMultipleItem
									name={item.key}
									count={{
										total: visibleOptions,
										value: activeOptions,
									}}
									subHeader={subHeader[type] && subHeader[type][item.key]}
									selected={item.isActive}
									onSelectItem={() => handleOptionSelect(item.key)}
								/>
							) : (
								<SubSectionItem
									name={item.key}
									activeOption={item.activeOption}
									selected={item.isActive}
									onSelectItem={() => handleOptionSelect(item.key)}
								/>
							);
						})}
				</div>
			</Grid>
		);
	}
}

SubSection.propTypes = {
	multiple: PropTypes.bool,
	items: PropTypes.array,
	handleOptionSelect: PropTypes.func,
};

export default SubSection;
