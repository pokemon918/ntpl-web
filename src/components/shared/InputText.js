import React, {Component} from 'react';
import L18nText from 'components/shared/L18nText';

const GRID_LENGTH = 12;

export default class InputText extends Component {
	render() {
		const {labelGridSize = 2} = this.props;
		const inputGridSize = GRID_LENGTH - labelGridSize;

		return (
			<div className="form-group row input-text">
				{this.props.label && (
					<label className={`col-sm-${labelGridSize} col-form-label`} htmlFor={this.props.id}>
						<L18nText id={this.props.label} defaultMessage={this.props.label} />:
					</label>
				)}
				<div className={`col-sm-${inputGridSize} field-wrapper`}>
					<L18nText
						id={this.props.placeholder || 'shared_empty'}
						defaultMessage={this.props.placeholder}
					>
						{(placeholder) => (
							<input
								type="text"
								className="form-control"
								id={this.props.id}
								name={this.props.name}
								value={this.props.value}
								onChange={this.props.handleChange}
								placeholder={placeholder}
							/>
						)}
					</L18nText>
				</div>
			</div>
		);
	}
}
