import React, {Component} from 'react';
import L18nText from 'components/shared/L18nText';

export default class ListSelectionOption extends Component {
	render() {
		const {inputType, option, index, activeSelection, isChecked} = this.props;

		return (
			<li className="list-group-item">
				<label htmlFor={'id-' + option + index} className={'class-' + option}>
					<input
						type={inputType}
						id={'id-' + option + index}
						name={activeSelection.key}
						aria-label="Radio button for following text input"
						value={option}
						onChange={this.props.handleOptionSelect}
						checked={isChecked}
					/>
					<L18nText id={option} defaultMessage={option} />
				</label>
			</li>
		);
	}
}
