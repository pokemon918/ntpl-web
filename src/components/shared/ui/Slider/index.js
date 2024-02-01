import React from 'react';
import PropTypes from 'prop-types';
import BaseSlider from 'rc-slider';

import L18nText from 'components/shared/L18nText';

import './Slider.scss';

const styles = {
	purple_active: '#391d4d',
	purple_inactive: '#afa4b8',
	slider_height: 3,
	handle_size: 17,
	handle_touch_area: 35,
};

class Slider extends React.Component {
	handleChange = (value) => {
		this.props.onChange(value);
	};

	renderCustomHandle = (props) => {
		const {initialValueChanged} = this.props;
		return (
			<BaseSlider.Handle {...props}>
				<div
					className="Slider__HandleCore"
					style={{
						width: styles.handle_size,
						height: styles.handle_size,
						backgroundColor: styles.purple_active,
						animation: !initialValueChanged && 'shadow-pulse 1.6s infinite',
					}}
				/>
			</BaseSlider.Handle>
		);
	};

	render() {
		const {title, id, minimum, maximum, current, onChange, disabled} = this.props;
		const {initialValueChanged} = this.props;
		const startText = `${id}min`;
		const endText = `${id}max`;

		return (
			<div className="Slider" data-test={id}>
				<div className="Slider__Title">
					<L18nText id={title} />
				</div>
				<div className="Slider__Labels">
					<div>
						<L18nText id={startText} defaultMessage="Low" />
					</div>
					<div>
						<L18nText id={endText} defaultMessage="High" />
					</div>
				</div>
				<div className="Slider__InputContainer">
					<BaseSlider
						value={current}
						min={minimum}
						max={maximum}
						step={0.25}
						disabled={disabled}
						onChange={onChange}
						handle={this.renderCustomHandle}
						railStyle={{
							backgroundColor: styles.purple_inactive,
							height: styles.slider_height,
						}}
						trackStyle={{
							backgroundColor: initialValueChanged ? styles.purple_active : styles.purple_inactive,
							height: styles.slider_height,
						}}
						handleStyle={{
							marginTop: -(styles.handle_touch_area / 2) + 2,
							width: styles.handle_size,
							height: styles.handle_touch_area,
							backgroundColor: 'transparent',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							border: 'none',
							boxShadow: 'none',
						}}
					/>
				</div>
			</div>
		);
	}
}

Slider.propTypes = {
	title: PropTypes.string.isRequired,
	minimum: PropTypes.number.isRequired,
	maximum: PropTypes.number.isRequired,
	current: PropTypes.number,
	onChange: PropTypes.func.isRequired,
	innerRefIndex: PropTypes.number,
	initialValueChanged: PropTypes.bool,
	disabled: PropTypes.bool,
};

Slider.defaultProps = {
	innerRefIndex: 0,
};

export default Slider;
