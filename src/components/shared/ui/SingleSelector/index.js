import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';

import L18nText from 'components/shared/L18nText';

import SelectionItem from './SingleSelectorItem';
import './SingleSelector.scss';

class SingleSelector extends React.Component {
	state = {
		selectedItem: {},
	};

	componentDidMount() {
		this.setState({
			selectedItem: this.props.selected,
		});
	}

	componentWillReceiveProps(nextProps) {
		if (get(nextProps.selected, 'id') !== get(this.state.selectedItem, 'id')) {
			this.setState({selectedItem: nextProps.selected});
		}
	}

	onHandleClick = (item) => {
		const {onDisabledClick} = this.props;

		if (item.disabled && typeof onDisabledClick === 'function') {
			onDisabledClick();
			return;
		}

		this.setState({selectedItem: item});
		if (this.props.onSelect) {
			this.props.onSelect(item);
		}
	};

	renderGroups(items) {
		const groups = [...new Set(items.map((item) => item.group))];

		return groups.map((group) => {
			const groupLabel = group || 'other';
			const groupItems = items.filter((i) => i.group === group);

			return (
				<div className="SingleSelector__Group">
					<div className="SingleSelector__GroupHeader">
						<L18nText id={groupLabel} defaultMessage={groupLabel} />
					</div>
					{this.renderItems(groupItems)}
				</div>
			);
		});
	}

	renderItems(items) {
		const {selectedItem} = this.state;
		const {
			renderSubHeader,
			renderDescription,
			type,
			colors,
			hideArrow,
			hideDescription,
			shortSubHeaderOnMobile,
		} = this.props;

		return items.map((item, index) => {
			const isActive =
				item.id &&
				selectedItem &&
				(item.id === selectedItem.id ||
					item.name === selectedItem.name ||
					selectedItem === item.name);
			const showClass = classnames({
				isMobile:
					item.id === 'profoundMobile' ||
					item.id === 'scholar2m' ||
					item.id === 'scholar3m' ||
					item.id === 'scholar4m',
				isDesktop:
					item.id === 'profound' ||
					item.id === 'scholar2' ||
					item.id === 'scholar3' ||
					item.id === 'scholar4',
			});
			return (
				<L18nText id={item.name} defaultMessage={item.name} key={item.name}>
					{(translatedOption) => (
						<SelectionItem
							type={type}
							colors={colors}
							className={showClass}
							disabled={item.disabled}
							key={item.name}
							id={item.id}
							hideDescription={hideDescription}
							subHeader={renderSubHeader(item) || item.subHeader}
							description={renderDescription(item) || item.description}
							name={translatedOption}
							isActive={isActive}
							hideArrow={hideArrow}
							onSelect={() => this.onHandleClick(item)}
							shortSubHeaderOnMobile={shortSubHeaderOnMobile}
						/>
					)}
				</L18nText>
			);
		});
	}

	render() {
		const {items, groupItems} = this.props;

		return (
			<div className="SingleSelector__Wrapper">
				{groupItems ? this.renderGroups(items) : this.renderItems(items)}
			</div>
		);
	}
}

SingleSelector.propTypes = {
	onSelect: PropTypes.func,
	onDisabledClick: PropTypes.func,
	selected: PropTypes.shape({id: PropTypes.string, name: PropTypes.string}),
	type: PropTypes.oneOf(['default', 'winetype', 'color', 'event']),
	colors: PropTypes.objectOf(PropTypes.string),
	items: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string, name: PropTypes.string})),
	hideArrow: PropTypes.bool,
};

SingleSelector.defaultProps = {
	renderSubHeader: () => null,
	renderDescription: () => null,
};

export default SingleSelector;
